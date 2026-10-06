# Lambert-GA 2026

Lambert iGEM's wiki. The SWARM homepage is served at `/lambert-ga/home/`;
the root page redirects there. Other wiki pages remain in `src/pages/`.

```sh
npm ci
npm run dev
npm run build
```

Homepage HTML, styles, artwork, and browser scripts are in `static/home/`.
Editable molecular animations are in `src/home/`. `npm run build:home`
bundles them and refreshes asset hashes; both `dev` and `build` run it first.

The production build writes to `public/`. GitLab Pages publishes the build
when changes are pushed to `main`.
