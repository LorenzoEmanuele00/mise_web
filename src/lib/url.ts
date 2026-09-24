const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
const PLACEHOLDER_ORIGIN = "https://same-site.invalid";
const EXPLICIT_SCHEME = /^[a-z][a-z\d+.-]*:/i;
// Browsers drop these anywhere in a URL before parsing it.
const URL_WHITESPACE = /[\t\r\n]/g;

// Returns the href only if it is safe to render: a same-site relative URL
// ("/…", "#…") or an absolute URL with an allowed scheme. Blocks javascript:,
// data: and protocol-relative ("//host", "/\t/host") values from CMS content.
export function safeUrl(href: string | null | undefined): string | undefined {
  const value = href?.trim();
  if (!value) return undefined;

  let resolved: URL;
  try {
    resolved = new URL(value, PLACEHOLDER_ORIGIN);
  } catch {
    return undefined;
  }

  if (resolved.origin === PLACEHOLDER_ORIGIN) return value;

  const hasExplicitScheme = EXPLICIT_SCHEME.test(
    value.replace(URL_WHITESPACE, ""),
  );
  return hasExplicitScheme && ALLOWED_PROTOCOLS.has(resolved.protocol)
    ? value
    : undefined;
}
