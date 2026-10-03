# Interactive English P.1

Interactive English learning web app for Thai Grade 1 students.

## Product direction

The app is content-driven. Google Sheets is the curriculum source of truth, Google Drive is the master asset library, and the web app delivers reusable lesson interactions. Three.js is used only where 3D improves learning rather than as the rendering layer for every screen.

### Lesson runtime

`Home → Lesson Map → Learn → Listen → Practice → Game → Quiz → Reward → Progress`

### MVP lessons

- **L01 Hello!** — vocabulary + listening/speaking
- **L08 Colors** — Three.js interactive scene
- **L12 Animals** — vocabulary/game foundation

## Tech stack

- Next.js App Router
- React + TypeScript
- Three.js
- Browser Speech Synthesis for the first audio prototype

## Project structure

```text
src/
  app/
  components/
  lib/
docs/
public/
```

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production workflow

1. Curriculum/content is authored and reviewed in Google Sheets.
2. Illustration, audio and 3D assets are produced and reviewed.
3. Approved masters are stored in Google Drive.
4. Web-ready assets are published to app storage/CDN.
5. Lesson data references approved assets.
6. Content QA → UX/UI QA → interaction QA → child usability test → publish.

See `docs/WORKFLOW.md` and `docs/ARCHITECTURE.md`.
