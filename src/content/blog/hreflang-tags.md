---
slug: 'hreflang-tags'
title: 'What is a hreflang tag anyway?'
description: 'What is a hreflang tag, why is it used, and how is it used?'
pubDate: 2026-05-05
category: { slug: 'technology', label: 'Technology' }
tags:
    [
        { slug: 'html', label: 'HTML' },
        { slug: 'web-development', label: 'Web Development' },
    ]
imageUrl: '../../assets/img/code.jpg'
imageAlt: 'Matrix-like jumble of green symbols'
---

Recently I did a deep dive into `hreflang` tags for a client project to understand what `hreflang` tags are, why they are used, why they are important, and most importantly, how to implement them.

What follows is the condensed version of that research: enough to reason about multilingual and multi-regional sites without treating `hreflang` like magic metadata.

## What `hreflang` actually is

`hreflang` is not its own HTML element. It is an **attribute** on `<link rel="alternate">` elements. Together, those annotations describe **which URL is the right language or regional variant** of a given page for search engines.

If you publish the same _intent_ in more than one language, or the same language with meaningful regional differences (currency, spelling, legal copy), `hreflang` helps crawlers build a **cluster** of related URLs instead of guessing which one should appear for a given searcher.

Search engines like Google use these signals in their indexing and ranking systems. Other engines may weight them differently or lean on other cues (for example `lang` on the document, or server locale), but for Google-centric international SEO, `hreflang` is the usual mechanism.

## Why it matters

**User experience on the search engine results page (SERP).** Someone searching in German is more likely to click a German title and snippet than an English one. Fewer mismatched clicks usually means better engagement signals for the URL that actually gets the click.

**Near-duplicate regional pages.** US English and UK English product pages can look like duplicates to a crawler. `hreflang` explains that both URLs are deliberate alternatives, not accidental copies—so the engine can try to **swap in the best-matching URL** for the searcher’s language and region.

**Important nuance:** `hreflang` is a **signal**, not a guarantee. Search engines still choose what to show based on many factors. Treat `hreflang` as part of a coherent international setup: consistent URLs, clear content differences where it matters, and sane canonicalization elsewhere.

## What the markup looks like

Each alternate is a link relation. The pattern is:

```html
<link rel="alternate" hreflang="de" href="https://example.com/de/" />
```

- `rel="alternate"` marks the target as another version of this resource.
- `hreflang` carries the language (and optionally region) code.
- `href` is the absolute URL of that variant.

**Language codes** use [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) (two letters), for example `en`, `de`, `ja`.

**Optional region** uses [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2), combined with a hyphen: `en-GB`, `en-US`, `pt-BR`. Use a region when the _same language_ genuinely differs by market—pricing, availability, compliance—or when you only want a page associated with a specific country, not every speaker of that language worldwide.

## Rules that save you from subtle bugs

### 1. Annotations must be reciprocal

If the English page points to the French page, the French page must point back to the English page (and to every other member of the cluster it participates in). One-way declarations do not establish a trusted cluster; they look like incomplete or mistaken wiring.

### 2. Every URL should list the full set (including itself)

Google’s documentation expects each URL in a cluster to enumerate **all** language or regional versions that belong together, **including a self-referencing** entry for the current page. That keeps clusters unambiguous when pages are templated or translated in parallel.

### 3. `x-default` is worth having

`hreflang="x-default"` names a fallback—often your primary or global page—when no language or region match is a good fit. It is optional in the strict sense, but Google recommends it, and it gives you a deliberate answer for “everything else” instead of leaving the engine to improvise.

### 4. Absolute URLs

Use fully qualified `https://` URLs in `href`. Relative URLs are a common source of validation noise and broken clusters.

## Where to put the annotations

**In the HTML `<head>`** — Straightforward for document pages. Every variant carries the same set of `<link rel="alternate" hreflang="…" href="…">` tags (plus `x-default` if you use it). The downside is maintenance: adding a new locale means touching every page in the cluster unless you generate these tags from a single source of truth.

## What I watch for in reviews

- **Orphan alternates** — A page points outward, but nothing points back.
- **Code typos** — Invalid `hreflang` values are ignored; a single bad code can break matching for that edge.
- **Mixed signals** — Conflicting canonical tags, redirects that drop language paths, or hrefs that 404 undercut the whole cluster.
- **Drift** — New locale ships, but older pages never get the extra `<link>` row; the cluster silently rots.

`hreflang` feels like a small HTML detail, but it encodes a **graph of equivalences** across your site. Treat it like configuration: one source of truth, generated consistently, and validated whenever URLs or locales change. That was the practical heart of the client work—and the part that pays off long after the first deploy.
