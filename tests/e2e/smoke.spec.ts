import { expect, test, type Page } from "@playwright/test";

// Smoke test in sola lettura: nessun test invia form, quindi niente
// scritture sul dataset Sanity collegato all'ambiente.

const PAGES = [
  "/",
  "/servizi",
  "/news",
  "/storia",
  "/servizio-civile",
  "/volontariato",
  "/contatti",
  "/galleria",
];

async function expectPageRenders(page: Page, path: string) {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));

  const response = await page.goto(path);

  expect(response?.status()).toBe(200);
  await expect(page.locator("header.nav")).toBeVisible();
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
  expect(errors).toEqual([]);
}

for (const path of PAGES) {
  test(`${path} mostra header, contenuto e footer`, async ({ page }) => {
    await expectPageRenders(page, path);
  });
}

// /servizi usa un accordion senza link: i dettagli sono linkati dalla home.
const DETAIL_SOURCES = [
  { section: "servizi", from: "/" },
  { section: "news", from: "/news" },
];

for (const { section, from } of DETAIL_SOURCES) {
  test(`il primo dettaglio di /${section} si apre`, async ({ page }) => {
    await page.goto(from);
    const firstLink = page.locator(`main a[href^="/${section}/"]`).first();
    test.skip((await firstLink.count()) === 0, `nessun link a /${section}/ in ${from}`);

    const href = await firstLink.getAttribute("href");
    await expectPageRenders(page, href!);
    await expect(page.locator("main h1")).toBeVisible();
  });
}

test("uno slug inesistente restituisce 404", async ({ page }) => {
  const response = await page.goto("/news/slug-che-non-esiste-e2e");
  expect(response?.status()).toBe(404);
});

test("il webhook di revalidate rifiuta richieste senza firma", async ({
  request,
}) => {
  const response = await request.post("/api/revalidate", {
    data: { _type: "post" },
  });
  // 401 con SANITY_WEBHOOK_SECRET configurato, 500 se manca (es. in locale)
  expect([401, 500]).toContain(response.status());
});
