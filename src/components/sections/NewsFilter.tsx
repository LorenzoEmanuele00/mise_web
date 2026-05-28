"use client";

import { useState } from "react";
import Link from "next/link";
import type { PostListItem, Post } from "@/lib/types";
import { formatDate } from "@/sanity/lib/utils";

type FilterTag = Post["tag"] | "Tutti";
const TAGS: FilterTag[] = [
  "Tutti",
  "Comunicato",
  "Bando",
  "Formazione",
  "Eventi",
];

interface NewsFilterProps {
  posts: PostListItem[];
}

export default function NewsFilter({ posts }: NewsFilterProps) {
  const [active, setActive] = useState<FilterTag>("Tutti");

  const filtered =
    active === "Tutti" ? posts : posts.filter((p) => p.tag === active);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-12">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={`kicker no-rule px-4 py-2 transition-colors border ${
              active === tag
                ? "border-ink bg-ink text-bg"
                : "border-hair bg-transparent text-ink-soft"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="body text-muted">Nessun articolo per questa categoria.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <Link
            key={post._id}
            href={`/news/${post.slug.current}`}
            prefetch={false}
            className="group block p-6 transition-colors border border-hair bg-bg"
          >
            {post.tag && (
              <p className="body-sm uppercase tracking-wide mb-3 text-accent">
                {post.tag}
              </p>
            )}
            <h2 className="heading-03 mb-3 transition-colors group-hover:opacity-70 text-ink">
              {post.title}
            </h2>
            <p className="body mb-4 line-clamp-3 text-ink-soft">
              {post.excerpt}
            </p>
            <p className="body-sm text-muted">{formatDate(post.date)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
