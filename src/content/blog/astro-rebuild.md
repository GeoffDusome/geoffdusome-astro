---
slug: 'astro-rebuild'
title: 'How I rebuilt my personal website as a blog using Astro'
description: 'Notes from moving a personal site to Astro 6: content collections, routing, and wiring up SEO metadata plus an automatic sitemap.'
pubDate: 2026-04-24
category: { slug: 'technology', label: 'Technology' }
tags:
    [
        { slug: 'astro', label: 'Astro' },
        { slug: 'web-development', label: 'Web Development' },
    ]
imageUrl: '../../assets/img/astro-banner.jpg'
imageAlt: 'Flat image with Astro logo'
---

Astro comes up a lot in my day-to-day as a tool that fits **content-heavy** sites unusually well. It had been a while since I reached for something new just for the sake of learning, so I did what any reasonable web developer would do: I rebuilt my personal site with it.

This post is a walkthrough of how I structured the project and what I leaned on in Astro along the way. The site is still evolving, but the core is solid: layouts, pages, a markdown-driven blog, tag archives, and **SEO + sitemap** so new posts are describable in `<head>` and discoverable in `sitemap.xml`.

## Getting started

Spinning up a project is one command: `npm create astro@latest`.

The CLI walks you through basics (TypeScript, strictness, starter template). From there, Astro stays out of your way: you choose how much framework you want on top. I knew I wanted a personal site with a real blog, not just a landing page. If I did it again, I would sketch the information architecture first—URLs, what is markdown vs. components—before touching the template. Lesson learned.

## How I think about the Astro shape

At a high level, everything lives under `src/`:

- **`src/pages`** — File-based routing. Each route is a file (or folder with `index.astro`).
- **`src/layouts`** — Shared document boilerplate: `<html>`, `<head>`, global shell like header and footer.
- **`src/components`** — Reusable UI (hero blocks, post cards, containers).
- **`src/content`** — Markdown (and MDX if you add it) plus a small config file that describes collections.

That split kept me from dumping everything into pages: pages stay thin, and the interesting logic sits in content + components.

## Layouts

The main entry for site boilerplate is `Layout.astro`. Mine holds the document shell, pulls in global CSS, and wraps page content in `<main>` between a header and footer.

You can have **multiple** layout files if different sections need different boilerplate—think a minimal layout for a print-friendly page vs. the full marketing shell. If you only need small variations, passing props (available as `Astro.props` in the layout) and branching in one layout is fine too. I started with a single layout and will split only when a page really needs a different frame.

## Pages and routing

**Static routes** map directly to files: `src/pages/about.astro` becomes `/about`.

**Dynamic routes** use bracket segments, for example `src/pages/blog/[id].astro`. Astro generates one HTML file per entry returned from `getStaticPaths()`. That is how a single template can back every blog post: you load the collection, map each post to `{ params: { id: ... }, props: { ... } }`, and the page receives the matching entry.

On this site, the blog index at `/blog` lists posts sorted by date. Each post lives at `/blog/[slug]` using the slug from frontmatter, not the filename—so titles and URLs can stay stable even if I rename files. Tag archives use the same idea under `/blog/tags/[tag]`, building paths from the unique tag slugs across all posts.

## Content collections

The blog is powered by a **content collection**: markdown files in `src/content/blog` plus a schema in `src/content.config.ts`.

A few things that made this pleasant:

1. **`defineCollection`** — Registers the collection with a name (here, `blog`).
2. **A glob loader** — Points at `./src/content/blog` and picks up `*.md` / `*.mdx` without manual imports.
3. **A Zod schema** — Validates frontmatter at build time. If I typo a required field or use the wrong type, the build fails early instead of breaking a template at runtime.

Frontmatter carries `slug`, `title`, `description`, `pubDate`, optional `updatedDate`, `category`, `tags` (each with `slug` and `label` for URLs and display), hero image metadata, and an optional `relatedPosts` field using Astro’s `reference()` type for later cross-linking between posts.

In pages, **`getCollection('blog')`** returns all entries, and **`render(post)`** gives a `Content` component for the markdown body. That keeps post pages declarative: hero metadata in the template, article body as `<Content />`.

## Styling and markdown

I am not using a utility-first CSS framework here—just layered global CSS (`reset`, `variables`, `utilities`) imported from the layout. That matches how I like to work on small sites: a few tokens, predictable spacing, no build-time tailwind unless I need it.

For markdown, Astro’s built-in pipeline is enough for now. In `astro.config.mjs` I set **Shiki** to the Gruvbox Light Hard theme so fenced code blocks match the rest of the aesthetic.

## Fonts and view transitions

Fonts are configured through Astro’s first-party **`fontProviders.fontsource()`** integration: Open Sans is registered once in config, exposed as a CSS variable, and applied on `html` / `body` via the `<Font />` component from `astro:assets` in the layout.

I also enabled **`ClientRouter`** from `astro:transitions` and used `transition:animate` / `transition:name` on a few elements so navigating between blog list and post feels a bit softer. This is optional polish, but the transition keeps things feeling smooth.

## Sitemap and SEO

Two pieces work together: a **production site URL** and **per-page metadata**.

In `astro.config.mjs`, `site` is set to the live origin (for example `https://geoffduso.me`). That value feeds `Astro.site` at build time, which I use on post pages to build absolute **canonical** URLs and absolute **Open Graph image** URLs. For OG images, `getImage()` from `astro:assets` resizes the post hero; wrapping that path with `new URL(..., site)` gives a full URL crawlers and social cards expect.

The official **`@astrojs/sitemap`** integration is added to `integrations` in the same config file. On build, Astro emits a `sitemap-index.xml` in `dist` that lists static routes and anything generated from `getStaticPaths`—blog posts and tag pages included—with no hand-maintained URL list.

Head tags live behind a small **`SEO.astro`** component the layout renders when a page passes an `seo` prop: meta description, canonical + `og:url`, `og:title`, `og:type`, optional `og:image` / `og:image:alt`, article `published_time` / `modified_time` for posts, and Twitter card tags (`summary` on listing pages, `summary_large_image` on posts with a hero). Each meta line is conditional on the prop being set, so simple pages do not need to fake fields they do not use.

## What is still in flight

Plenty left on the wish list:

- **RSS** once I have enough of a publishing rhythm to justify the feed.
- **`relatedPosts`** actually rendered on the post template using the references the schema already allows.

If you are on the fence about Astro for a personal site or doc-heavy project, my takeaway so far is simple: **Astro is great for content heavy sites, large or small**. However, Astro is capable of so much more that I wouldn't likely explore until I needed it on a project.
