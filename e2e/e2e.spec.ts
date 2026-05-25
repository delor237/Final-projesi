import { expect, test } from "@playwright/test";

test("register -> todo CRUD -> categories CRUD", async ({ page }) => {
  const username = `e2e-${Date.now()}`;
  const password = "secret123";

  // Register
  await page.goto("/login");
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[name="action"][value="register"]');
  await page.waitForURL("**/");
  await expect(page.locator("h1")).toContainText(username);

  // Create todo
  const title = `E2E Todo ${Date.now()}`;
  await page.fill('input[placeholder="Bugün ne yapacaksınız?"]', title);
  await page.fill(
    'textarea[placeholder="Daha fazla detay ekleyin..."]',
    "E2E details",
  );
  await page.click('button:has-text("Görevi Kaydet")');
  await expect(page.locator(`text=${title}`)).toBeVisible();

  // Toggle todo
  const todoItem = page.locator("li", { hasText: title }).first();
  const checkbox = todoItem.locator('input[type="checkbox"]');
  await checkbox.click();
  await expect(checkbox).toBeChecked();

  // Delete todo (accept confirm)
  page.once("dialog", (d) => d.accept());
  await todoItem.locator('button[title="Görevi Sil"]').click();
  await expect(page.locator(`text=${title}`)).not.toBeVisible();

  // Categories: create and delete
  await page.goto("/categories");
  await page.fill('input[placeholder="Örn: Tasarım, Yazılım..."]', "E2E Cat");
  // set color value via evaluate
  await page.locator('input[type="color"]').evaluate((el: HTMLInputElement) =>
    el.value = "#ff0000"
  );
  await page.click('button:has-text("Ekle")');
  await expect(page.locator("text=E2E Cat")).toBeVisible();

  // Delete category (accept confirm)
  page.once("dialog", (d) => d.accept());
  await page.locator('button[title="Sil"]').first().click();
  await expect(page.locator("text=E2E Cat")).not.toBeVisible();
});
