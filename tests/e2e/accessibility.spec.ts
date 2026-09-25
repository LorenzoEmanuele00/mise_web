import { expect, test } from "@playwright/test";

// Test in sola lettura: nessun form viene inviato.

test("lo skip link è il primo elemento raggiungibile e porta al contenuto", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Salta al contenuto" });
  await expect(skipLink).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator("#main")).toBeFocused();
});

test("le etichette dei form hanno contrasto di almeno 4,5:1", async ({
  page,
}) => {
  await page.goto("/contatti");
  const label = page.locator(".input-label").first();

  const ratio = await label.evaluate((el) => {
    const channel = (v: number) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    const luminance = (rgb: string) => {
      const [r = 0, g = 0, b = 0] = rgb.match(/\d+(\.\d+)?/g)!.map(Number);
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };
    const fg = luminance(getComputedStyle(el).color);
    // Sfondo più scuro tra quelli usati dai form (bg-deep): caso peggiore.
    const bg = luminance("rgb(229, 223, 207)");
    return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
  });

  expect(ratio).toBeGreaterThanOrEqual(4.5);
});

test("i campi anagrafici dei form dichiarano autocomplete", async ({
  page,
}) => {
  await page.goto("/contatti");
  await expect(page.locator("#c-nome")).toHaveAttribute("autocomplete", "name");
  await expect(page.locator("#c-email")).toHaveAttribute(
    "autocomplete",
    "email",
  );
});

test.describe("menu mobile", () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!isMobile, "Il burger è visibile solo su viewport stretti");
  });

  test("da chiuso non è raggiungibile con Tab (inert)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#nav-drawer")).toHaveAttribute("inert", "");
  });

  test("all'apertura il focus entra nel menu, Tab resta dentro, Escape lo restituisce al burger", async ({
    page,
  }) => {
    await page.goto("/");
    const burger = page.locator(".nav-burger");
    await burger.click();

    const drawer = page.locator("#nav-drawer");
    await expect(drawer).not.toHaveAttribute("inert", "");
    await expect
      .poll(() => drawer.evaluate((el) => el.contains(document.activeElement)))
      .toBe(true);

    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const inside = await drawer.evaluate((el) =>
        el.contains(document.activeElement),
      );
      expect(inside).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(burger).toBeFocused();
    await expect(drawer).toHaveAttribute("inert", "");
  });
});

test("la lightbox della galleria intrappola il focus e lo restituisce alla miniatura", async ({
  page,
}) => {
  await page.goto("/galleria");
  const thumbnail = page.getByRole("button", { name: /^Apri immagine/ }).first();
  test.skip((await thumbnail.count()) === 0, "Nessuna immagine in galleria");

  await thumbnail.click();
  const dialog = page.locator('[role="dialog"]:not([inert])');
  await expect(page.getByRole("button", { name: "Chiudi galleria" })).toBeFocused();

  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(thumbnail).toBeFocused();
});

test("con prefers-reduced-motion le card della hero restano statiche", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const cards = page.locator(".scroll-stack-card");
  test.skip((await cards.count()) === 0, "Nessuna card ScrollStack nella pagina");

  const willChange = await cards.evaluateAll((els) =>
    els.map((el) => (el as HTMLElement).style.willChange),
  );
  expect(willChange.every((value) => value === "")).toBe(true);
});

test("i titoli di sezione della home sono h2 e non saltano livello", async ({
  page,
}) => {
  await page.goto("/");
  const levels = await page
    .locator("main h1, main h2, main h3")
    .evaluateAll((els) => els.map((el) => Number(el.tagName[1])));

  expect(levels.filter((l) => l === 1)).toHaveLength(1);
  levels.reduce((prev, level) => {
    expect(level - prev).toBeLessThanOrEqual(1);
    return level;
  }, 0);
});

test("i tab del servizio civile espongono i ruoli ARIA e si usano con le frecce", async ({
  page,
}) => {
  await page.goto("/servizio-civile");
  const tabs = page.getByRole("tab");
  test.skip((await tabs.count()) < 2, "Servono almeno due tipi di servizio");

  await expect(page.getByRole("tablist")).toBeVisible();
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.first()).toHaveAttribute("aria-selected", "false");
  await expect(page.getByRole("tabpanel")).toHaveAttribute(
    "aria-labelledby",
    "sc-tab-1",
  );
});

test("le FAQ espongono aria-expanded e nascondono le risposte chiuse", async ({
  page,
}) => {
  await page.goto("/servizio-civile");
  const question = page.locator("button[aria-controls^='faq-panel-']").first();
  test.skip((await question.count()) === 0, "Nessuna FAQ in pagina");

  const panel = page.locator(`#${await question.getAttribute("aria-controls")}`);
  await expect(question).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toHaveAttribute("inert", "");

  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(panel).not.toHaveAttribute("inert", "");
});

test("il filtro news espone lo stato attivo e annuncia i risultati", async ({
  page,
}) => {
  await page.goto("/news");
  const all = page.getByRole("button", { name: "Tutti", exact: true });
  await expect(all).toHaveAttribute("aria-pressed", "true");

  const bando = page.getByRole("button", { name: "Bando", exact: true });
  await bando.click();
  await expect(bando).toHaveAttribute("aria-pressed", "true");
  await expect(all).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("status")).toContainText("nella categoria Bando");
});

test("le aree di interesse del form volontari sono in un fieldset con legenda", async ({
  page,
}) => {
  await page.goto("/volontariato");
  await expect(
    page.getByRole("group", { name: "Aree di interesse" }),
  ).toBeVisible();
});

test("il wizard SC annuncia lo step e sposta il focus al cambio (senza inviare)", async ({
  page,
}) => {
  await page.goto("/servizio-civile");
  const nome = page.locator("#sc-nome");
  test.skip((await nome.count()) === 0, "Wizard non presente");

  await nome.fill("Mario Rossi");
  await page.locator("#sc-email").fill("mario.rossi@example.com");
  await page.getByRole("button", { name: /Avanti/ }).click();

  await expect(page.getByText("Step 2 di 3")).toBeVisible();
  const project = page.locator("button[data-progetto]").first();
  if ((await project.count()) > 0) {
    await expect(project).toBeFocused();
    await project.click();
    await expect(project).toHaveAttribute("aria-pressed", "true");
  }
});
