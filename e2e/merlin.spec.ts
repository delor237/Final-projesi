import { expect, test } from "@playwright/test";

test("merlin login works", async ({ page }) => {
  const username = "merlin";
  const password = "merlin123";

  await page.goto("/login");
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[name="action"][value="login"]');
  await page.waitForURL("**/");
  await expect(page.locator("h1")).toContainText(username);
});
