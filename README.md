# River to Table

A one-page Nuxt portfolio telling Henrik Javén's River to Table story. It is
statically generated for a fast, low-maintenance Netlify deployment.

## Local development

Requirements: Node.js 22 and npm.

```bash
npm install
npm run dev
```

Create the production site with:

```bash
npm run generate
```

Local generation writes to `.output/public`. On Netlify, Nuxt automatically
selects its `netlify-static` preset and writes the deployable site to `dist`.

## Editing the story

Most copy, image order, alt text, and captions live in `data/site.ts`. Each
gallery photo has three caption lines (original, alternate, and your own). You
can edit them on the page; drafts are saved in the browser via localStorage.
Before publishing:

1. Replace `hello@example.com` with the correct contact address.
2. Replace `https://example.netlify.app` in `app.vue` with the final domain.
3. Review the biographical and application copy in `data/site.ts` and `app.vue`.
4. Confirm every caption and alt description reflects the intended story.

Original HEIC, JPEG, and Live Photo files stay in `img/`. Browser-ready images
live in `public/images/`; keep those filenames when replacing an image, or
update its path in `data/site.ts`.

## Slideshow video

The included `public/video/river-to-table.mp4` is generated from the gallery
images with subtle Ken Burns movement:

```bash
npm run media:video
```

To use the preferred Apple Photos version instead:

1. In Photos on macOS, select the slideshow under **Projects**.
2. Choose **File > Export > Export Slideshow** and select 1080p.
3. Convert the export to an H.264 MP4 if Photos produces M4V or MOV.
4. Replace `public/video/river-to-table.mp4`.
5. Replace `public/images/video-poster.jpg` with a representative 16:9 frame.

Video never autoplays. Use only music and other media cleared for public web
publication.

## Deploying to Netlify

Connect this repository to a new Netlify site. `netlify.toml` supplies:

- Build command: `npm run generate`
- Publish directory: `dist`
- Node.js version: 22

Nuxt Image uses Netlify Image CDN on deployment to deliver modern formats and
appropriately sized images. No server, database, CMS, or iCloud connection is
required.
