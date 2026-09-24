import { expect, test } from "@playwright/test";

for (const path of ["/pagina-che-non-esiste", "/news/slug-che-non-esiste"]) {
  test(`${path} mostra la 404 del sito con header e footer`, async ({
    page,
  }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(404);
    await expect(page.locator("header.nav")).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: "Questa pagina non esiste." }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Torna alla home" })).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });
}

test("la 404 non viene indicizzata", async ({ page }) => {
  await page.goto("/pagina-che-non-esiste");
  await expect(
    page.locator('meta[name="robots"][content*="noindex"]').first(),
  ).toBeAttached();
});
