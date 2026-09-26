import { expect, test } from "@playwright/test";

test("la lightbox della galleria mostra il contatore 1 / N", async ({ page }) => {
  await page.goto("/galleria");
  const thumbnails = page.getByRole("button", { name: /^Apri immagine:/ });
  const total = await thumbnails.count();
  test.skip(total === 0, "Nessuna immagine in galleria");

  await thumbnails.first().click();

  await expect(page.getByText(`1 / ${total}`)).toBeVisible();
});

test("le FAQ del Servizio Civile si aprono e si chiudono", async ({ page }) => {
  await page.goto("/servizio-civile");
  const questions = page.locator("button[aria-controls^='faq-panel-']");
  test.skip((await questions.count()) < 2, "Servono almeno due FAQ");

  const first = questions.nth(0);
  const second = questions.nth(1);

  await first.click();
  await expect(first).toHaveAttribute("aria-expanded", "true");

  await second.click();
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(first).toHaveAttribute("aria-expanded", "false");

  await second.click();
  await expect(second).toHaveAttribute("aria-expanded", "false");
});

test("lo ScrollStack dell'hero anima le card del proprio contenitore", async ({
  page,
}) => {
  test.skip(
    (page.viewportSize()?.width ?? 0) >= 1024,
    "Lo stack è montato solo sotto i 1024px",
  );
  await page.goto("/");

  const cards = page.locator(".scroll-stack-scroller .scroll-stack-card");
  test.skip((await cards.count()) === 0, "Nessuna card nell'hero");

  // Nessuna card fuori da un contenitore ScrollStack...
  await expect(page.locator(".scroll-stack-card")).toHaveCount(await cards.count());
  // ...e ScrollStack imposta la trasformazione sulle proprie card.
  await expect
    .poll(() => cards.first().evaluate((el) => (el as HTMLElement).style.transform))
    .toContain("scale(");
});
