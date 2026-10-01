# Project architecture rules

- Serve the approved Atelier Chrome artifact at `/` through the React route, injecting and removing its reference CSS with the route lifecycle; this preserves the vanilla WebGL behavior while isolating the salon from all legacy global CSS.
- Keep `reference/La-Barbe-a-Papa-Apercu-valide.html` byte-identical as the comparison source; production adaptations belong only in `src/atelier/` and metadata files.
- Keep legacy salon components and media in source but inactive; they are retained for restoration and must not override the approved visual system.
- Style the retained 404 only through its CSS module so navigation cannot leak either the legacy theme or reference page rules across routes.
