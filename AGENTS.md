# Project architecture rules

- Serve the approved Atelier Chrome artifact at `/` through the React route, preserving its original HTML/CSS/vanilla WebGL behavior; this keeps the existing Vite router and 404 while avoiding a framework migration.
- Keep `reference/La-Barbe-a-Papa-Apercu-valide.html` byte-identical as the comparison source; production adaptations belong only in `src/atelier/` and metadata files.
- Keep legacy salon components and media in source but inactive; they are retained for restoration and must not override the approved visual system.
