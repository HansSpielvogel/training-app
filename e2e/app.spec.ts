import { test, expect } from '@playwright/test'

test('app loads and shows root element', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#app-root')).toBeVisible()
})

test('input with text-sm class has effective font-size >= 16px', async ({ page }) => {
  await page.goto('/')
  const fontSize = await page.evaluate(() => {
    const el = document.createElement('input')
    el.className = 'text-sm'
    document.body.appendChild(el)
    const fs = parseFloat(getComputedStyle(el).fontSize)
    document.body.removeChild(el)
    return fs
  })
  expect(fontSize).toBeGreaterThanOrEqual(16)
})
