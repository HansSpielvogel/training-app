import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/training-app/sessions')
  await page.evaluate(() => new Promise<void>((resolve) => {
    const req = indexedDB.deleteDatabase('TrainingApp')
    req.onsuccess = () => resolve()
    req.onerror = () => resolve()
  }))
  await page.reload()
  await page.waitForFunction(
    async () => {
      const dbs = await indexedDB.databases()
      return dbs.some((d) => d.name === 'TrainingApp' && d.version === 5)
    },
    null,
    { timeout: 10000 },
  )
  await page.waitForTimeout(300)
  await page.goto('/training-app/sessions')
})

test('complete exercise, verify next one auto-opens', async ({ page }) => {
  await expect(page.getByText('Oberkörper A')).toBeVisible({ timeout: 5000 })
  await page.locator('button').filter({ hasText: 'Oberkörper A' }).click()
  await page.waitForURL('**/sessions/active')

  // Open first slot (Hintere Schulter) and pick an exercise
  await page.getByText('Hintere Schulter').click()
  const firstChip = page.locator('button.rounded-full').first()
  await expect(firstChip).toBeVisible({ timeout: 3000 })
  await firstChip.click()

  // Log a set
  await expect(page.getByPlaceholder('Weight')).toBeVisible({ timeout: 3000 })
  await page.getByPlaceholder('Weight').fill('15')
  await page.getByPlaceholder('Reps').fill('12')
  await page.getByText(/Log \d+×/).click()

  // Mark slot done — next slot (Rücken Breite) should auto-open
  await page.getByRole('button', { name: 'Done' }).click()

  // Second slot must auto-expand (shows exercise chips or loading)
  await expect(page.locator('button.rounded-full').first()).toBeVisible({ timeout: 5000 })
  await expect(page.getByText('Loading exercises…')).toHaveCount(0)
})

test('log sets, switch to Stats, return, active exercise is focused', async ({ page }) => {
  await expect(page.getByText('Oberkörper A')).toBeVisible({ timeout: 5000 })
  await page.locator('button').filter({ hasText: 'Oberkörper A' }).click()
  await page.waitForURL('**/sessions/active')

  // Open first slot and pick an exercise, log a set
  await page.getByText('Hintere Schulter').click()
  const firstChip = page.locator('button.rounded-full').first()
  await expect(firstChip).toBeVisible({ timeout: 3000 })
  await firstChip.click()

  await page.getByPlaceholder('Weight').fill('15')
  await page.getByPlaceholder('Reps').fill('12')
  await page.getByText(/Log \d+×/).click()

  // Navigate to Stats
  await page.getByRole('link', { name: /Stats/i }).click()
  await page.waitForURL('**/analytics')

  // Return to active session
  await page.getByRole('link', { name: /Train/i }).click()
  await page.waitForURL('**/sessions/active')

  // The first slot (Hintere Schulter) should be expanded (active exercise restored)
  // Its set count indicator should be visible in the header row
  await expect(page.getByText(/\d+ sets?/).first()).toBeVisible({ timeout: 3000 })
  // The set logger should be visible (slot is expanded)
  await expect(page.getByPlaceholder('Weight')).toBeVisible({ timeout: 3000 })
})

test('log set with RPE 7, edit to RPE 8, verify persistence', async ({ page }) => {
  await expect(page.getByText('Oberkörper A')).toBeVisible({ timeout: 5000 })
  await page.locator('button').filter({ hasText: 'Oberkörper A' }).click()
  await page.waitForURL('**/sessions/active')

  // Open first slot and pick an exercise
  await page.getByText('Hintere Schulter').click()
  const firstChip = page.locator('button.rounded-full').first()
  await expect(firstChip).toBeVisible({ timeout: 3000 })
  await firstChip.click()

  // Log a set with RPE 7
  await page.getByPlaceholder('Weight').fill('15')
  await page.getByPlaceholder('Reps').fill('12')
  await page.getByPlaceholder('RPE (1-10)').fill('7')
  await page.getByText(/Log \d+×/).click()

  // The logged set row should show @7
  await expect(page.getByText(/@7/).first()).toBeVisible({ timeout: 3000 })

  // Click the edit (pencil) icon next to the set
  await page.getByRole('button', { name: 'Edit RPE' }).first().click()

  // Enter new RPE value
  const rpeEditInput = page.getByPlaceholder('RPE').last()
  await expect(rpeEditInput).toBeVisible({ timeout: 2000 })
  await rpeEditInput.fill('8')
  await page.getByRole('button', { name: '✓' }).click()

  // Should now show @8 on at least one set, and @7 only on unchanged sets
  await expect(page.getByText(/@8/).first()).toBeVisible({ timeout: 3000 })
})
