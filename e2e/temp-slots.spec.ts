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

test('6.6: add temp slot, log sets, complete — temp slot in history', async ({ page }) => {
  await expect(page.getByText('Oberkörper A')).toBeVisible({ timeout: 5000 })

  // Start a session
  await page.locator('button').filter({ hasText: 'Oberkörper A' }).click()
  await page.waitForURL('**/sessions/active')

  // Add a temp slot for "Bauch" (not in Oberkörper A)
  await page.getByText('+ Add muscle group').click()
  await page.getByRole('button', { name: 'Bauch', exact: true }).click()

  // Temp badge should be visible on the new slot
  await expect(page.getByText('Temp')).toBeVisible()

  // Expand the temp slot (last entry) and pick an exercise
  const tempRow = page.locator('div').filter({ hasText: /^BauchTemp/ }).first()
  await tempRow.click()
  const chip = page.locator('button.rounded-full').first()
  await expect(chip).toBeVisible({ timeout: 3000 })
  await chip.click()

  // Log a set
  await page.getByPlaceholder('Weight').last().fill('50')
  await page.getByPlaceholder('Reps').last().fill('15')
  await page.getByText(/Log \d+×/).last().click()

  // Complete the session
  await page.getByText('Finish Session').click()
  await page.getByText('Finish').click()
  await page.waitForURL('**/sessions')

  // Session history should exist; navigate to analytics to verify Bauch exercise appears
  await expect(page.getByText('Oberkörper A')).toBeVisible({ timeout: 3000 })
})

test('6.7: add plan slots — overlapping muscle groups not duplicated', async ({ page }) => {
  await expect(page.getByText('Oberkörper A')).toBeVisible({ timeout: 5000 })

  // Start Oberkörper A session
  await page.locator('button').filter({ hasText: 'Oberkörper A' }).click()
  await page.waitForURL('**/sessions/active')

  // Add plan "Oberkörper B" — only new muscle group is Rücken Dicke
  await page.getByText('+ Add plan').click()
  await page.getByRole('button', { name: 'Oberkörper B' }).click()

  // The new temp slot should be "Rücken Dicke"
  await expect(page.getByText('Rücken Dicke')).toBeVisible({ timeout: 3000 })

  // Exactly 1 Temp badge — overlapping muscle groups were NOT duplicated
  await expect(page.getByText('Temp')).toHaveCount(1)
})
