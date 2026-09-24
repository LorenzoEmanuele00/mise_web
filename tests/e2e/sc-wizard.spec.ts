import { expect, test } from "@playwright/test";

// Nessun invio reale: ogni POST viene annullato e registrato.

test("il wizard SC arriva alla motivazione senza inviare il form", async ({
  page,
}) => {
  const posts: string[] = [];
  await page.route("**/*", (route) => {
    if (route.request().method() === "POST") {
      posts.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });

  await page.goto("/servizio-civile");
  const form = page.locator("form").filter({ has: page.locator("#sc-nome") });

  await form.locator("#sc-nome").fill("Prova Test");
  await form.locator("#sc-email").fill("prova@example.org");
  await form.getByRole("button", { name: "Avanti" }).click();

  const project = form.locator("button[type=button]").filter({ hasText: "·" });
  await project.first().click();
  await form.getByRole("button", { name: "Avanti" }).click();

  const motivo = form.locator("#sc-motivo");
  await expect(motivo).toBeVisible();
  await motivo.fill("Mi interessa perché…");
  await page.waitForTimeout(1500);

  await expect(motivo).toBeVisible();
  await expect(form.getByRole("button", { name: "Invia richiesta" })).toBeVisible();
  expect(posts).toEqual([]);
});

test("il wizard SC rifiuta subito le email che il server non accetta", async ({
  page,
}) => {
  await page.goto("/servizio-civile");
  const form = page.locator("form").filter({ has: page.locator("#sc-nome") });

  await form.locator("#sc-nome").fill("Prova Test");
  await form.locator("#sc-email").fill("prova@dominio.i");
  await form.getByRole("button", { name: "Avanti" }).click();

  await expect(form.locator("#sc-email-error")).toBeVisible();
  await expect(form.locator("#sc-nome")).toBeVisible();
});
