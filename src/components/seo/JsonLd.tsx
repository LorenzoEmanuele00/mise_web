interface JsonLdProps {
  data: Record<string, unknown>;
}

// Il "<" viene escapato per impedire che un valore proveniente da Sanity
// chiuda il tag <script> (es. "</script>").
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
