import { expect, test } from "@playwright/test";

// Test in sola lettura: nessun form viene inviato.

for (const path of ["/", "/servizi", "/news", "/contatti", "/galleria"]) {
  test(`${path} ha un canonical assoluto che punta a se stessa`, async ({
    page,
  }) => {
    await page.goto(path);
    const href = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");

    expect(href).toMatch(/^https?:\/\//);
    expect(new URL(href!).pathname.replace(/\/$/, "")).toBe(
      path === "/" ? "" : path,
    );
  });
}

test("la sitemap include /galleria", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("/galleria</loc>");
});

test("robots.txt punta alla sitemap con la stessa origine dei canonical", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");

  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain(
    `Sitemap: ${new URL(canonical!).origin}/sitemap.xml`,
  );
});

test("la home espone JSON-LD NGO valido", async ({ page }) => {
  await page.goto("/");
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  const data = JSON.parse(raw ?? "{}");

  expect(data["@type"]).toBe("NGO");
  expect(data.name).toBe("Misericordia di Gello");
});

test("il dettaglio di una news espone JSON-LD NewsArticle", async ({
  page,
}) => {
  await page.goto("/news");
  const link = page.locator('a[href^="/news/"]').first();
  test.skip((await link.count()) === 0, "Nessuna news pubblicata");

  await page.goto((await link.getAttribute("href"))!);
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  const data = JSON.parse(raw ?? "{}");

  expect(data["@type"]).toBe("NewsArticle");
  expect(data.headline).toBeTruthy();
});

test("il footer non linka pagine inesistenti", async ({ page }) => {
  await page.goto("/");
  for (const href of ["/privacy", "/trasparenza", "/cookie"]) {
    await expect(page.locator(`footer a[href="${href}"]`)).toHaveCount(0);
  }
});

test("l'immagine LCP della hero ha fetchpriority high", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("main img").first();
  test.skip((await hero.count()) === 0, "Nessuna immagine nella hero");

  await expect(hero).toHaveAttribute("fetchpriority", "high");
});
