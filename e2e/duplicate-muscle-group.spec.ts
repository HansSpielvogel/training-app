import { test, expect, type Page } from '@playwright/test'

// Oberkörper A has mg-schultern at slots index 2 and 5, and mg-ruecken-b at index 1.
// These tests cover bugs that only surface when a plan has the same muscle group more than once.

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

// EntryRow outer div has className="relative overflow-hidden" — used as entry locator
const entryRows = (page: Page) => page.locator('div.relative.overflow-hidden')

test('stale exerciseDataMap: after removing an entry, the slot that shifts into its index shows correct exercises', async ({ page }) => {
  await expect(page.getByText('Oberkörper A')).toBeVisible({ timeout: 5000 })
  await page.locator('button').filter({ hasText: 'Oberkörper A' }).click()
  await page.waitForURL('**/sessions/active')

  // Oberkörper A entry order: 0=Hintere Schulter, 1=Rücken Breite, 2=Schultern, …
  // Expand Rücken Breite (index 1) — this loads exerciseDataMap[1] with Rücken Breite exercise data
  await page.getByText('Rücken Breite').first().click()
  // Seed sessions contain Klimmzug for Rücken Breite → it must appear as a recent chip
  await expect(page.getByRole('button', { name: 'Klimmzug' })).toBeVisible({ timeout: 3000 })

  // Remove Rücken Breite via the trash button.
  // The button is in the DOM but visually behind the swipe card (covered by the translateX(0) card div).
  // Coordinate-based click (even with force:true) hits the overlapping card, so we call .click()
  // directly via evaluate, which dispatches the event on the element itself.
  await entryRows(page).nth(1).locator('button.bg-red-500').evaluate((btn) => (btn as HTMLButtonElement).click())

  // Wait for the removal to persist — the non-optional Rücken Breite disappears,
  // leaving only the optional one (count drops from 2 to 1)
  await expect(page.getByText('Rücken Breite')).toHaveCount(1, { timeout: 3000 })

  // Schultern is now at index 1 (shifted from index 2).
  // Bug scenario: exerciseDataMap[1] still holds stale Rücken Breite data, so "Klimmzug" would
  // appear as a chip for the Schultern slot. After the fix, exercise data is cleared on removal
  // and Schultern gets its own data when expanded.

  // If the entry auto-expanded due to stale expandedIndex (another bug), chips are already visible.
  // If not, click to expand it.
  const chips = page.locator('button.rounded-full')
  if (!(await chips.first().isVisible())) {
    await page.getByText('Schultern').first().click()
    await expect(chips.first()).toBeVisible({ timeout: 3000 })
  }

  // Rücken Breite exercises (from stale data) must NOT appear for the Schultern slot
  await expect(page.getByRole('button', { name: 'Klimmzug' })).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Latzug' })).not.toBeVisible()
})
