import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Clear DB, reload so app re-seeds, wait until Dexie has fully initialised
  // (version 5), then give seeding a moment to complete before navigating fresh.
  // indexedDB.databases() is used for the version check because it never opens
  // a connection and therefore cannot interfere with Dexie's own connection.
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
  await page.waitForTimeout(300) // async seeding completes after DB is ready
  await page.goto('/training-app/sessions')
})

test('finishing a slot auto-expands the next one with exercises loaded', async ({ page }) => {
  await expect(page.getByText('Oberkörper A')).toBeVisible({ timeout: 5000 })

  await page.locator('button').filter({ hasText: 'Oberkörper A' }).click()
  await page.waitForURL('**/sessions/active')

  // Open first slot and pick an exercise (click first available chip)
  await page.getByText('Hintere Schulter').click()
  const firstChip = page.locator('button.rounded-full').first()
  await expect(firstChip).toBeVisible({ timeout: 3000 })
  await firstChip.click()

  // Log a set
  await page.getByPlaceholder('Weight').fill('15')
  await page.getByPlaceholder('Reps').fill('12')
  await page.getByText(/Log \d+×/).click()

  // Mark slot 1 done — triggers auto-expand of slot 2
  await page.getByRole('button', { name: 'Done' }).click()

  // Slot 2 (Rücken Breite) must auto-expand and show exercises — not stuck on "Loading exercises..."
  // The VariationPicker loads and renders exercise chips for the next muscle group
  await expect(page.locator('button.rounded-full').first()).toBeVisible({ timeout: 5000 })
  await expect(page.getByText('Loading exercises…')).toHaveCount(0)
})
