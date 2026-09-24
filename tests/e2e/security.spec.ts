import { expect, test } from "@playwright/test";
import { checkSpam, MIN_FILL_MS } from "../../src/lib/forms";
import { safeUrl } from "../../src/lib/url";

// Sola lettura: i form vengono solo ispezionati, mai inviati.

test("le pagine inviano gli header di sicurezza", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["strict-transport-security"]).toContain("max-age=");
  expect(headers["permissions-policy"]).toContain("camera=()");
});

for (const path of ["/contatti", "/volontariato"]) {
  test(`il form di ${path} ha honeypot e tempo di compilazione`, async ({
    page,
  }) => {
    await page.goto(path);
    const form = page.locator("form").first();

    await expect(form.locator('input[name="website"]')).toBeHidden();
    // Costruire il FormData (come fa React all'invio) non invia il form.
    await expect
      .poll(() =>
        form.evaluate((el: HTMLFormElement) =>
          Number(new FormData(el).get("formFillMs") ?? -1),
        ),
      )
      .toBeGreaterThanOrEqual(0);
  });
}

test.describe("safeUrl", () => {
  test("accetta percorsi interni e schemi sicuri", () => {
    for (const href of [
      "/contatti",
      "/news?tag=corsi",
      "#form",
      "https://example.org/bando.pdf",
      "http://example.org",
      "mailto:info@example.org",
      "tel:+390000000",
    ]) {
      expect(safeUrl(href)).toBe(href);
    }
  });

  test("scarta schemi pericolosi, URL protocol-relative e valori vuoti", () => {
    for (const href of [
      "javascript:alert(1)",
      " JavaScript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "//evil.example",
      "/\\evil.example",
      "/\t/evil.example",
      "/\n/evil.example",
      "\t//evil.example",
      "java\tscript:alert(1)",
      "ftp://example.org",
      "",
      null,
      undefined,
    ]) {
      expect(safeUrl(href)).toBeUndefined();
    }
  });
});

test.describe("checkSpam", () => {
  function formData(fields: Record<string, string>) {
    const data = new FormData();
    for (const [key, value] of Object.entries(fields)) data.set(key, value);
    return data;
  }

  test("honeypot compilato", () => {
    const data = formData({ website: "x", formFillMs: "60000" });
    expect(checkSpam(data)).toBe("honeypot");
  });

  test("invio troppo rapido o senza tempo di compilazione", () => {
    const tooFast = String(MIN_FILL_MS - 1);
    expect(checkSpam(formData({ formFillMs: tooFast }))).toBe("too-fast");
    expect(checkSpam(formData({}))).toBe("too-fast");
    expect(checkSpam(formData({ formFillMs: "abc" }))).toBe("too-fast");
  });

  test("invio normale", () => {
    const data = formData({ formFillMs: String(MIN_FILL_MS) });
    expect(checkSpam(data)).toBe("ok");
  });
});
