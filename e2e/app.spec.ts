import { test, expect } from '@playwright/test'

test('app loads and shows root element', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#app-root')).toBeVisible()
})
