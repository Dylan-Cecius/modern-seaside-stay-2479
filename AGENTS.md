# Project architecture rules

- Serve the approved Atelier Chrome artifact at `/` through the React route, injecting and removing its reference CSS with the route lifecycle; this preserves the vanilla WebGL behavior while isolating the salon from all legacy global CSS.
- Keep `reference/La-Barbe-a-Papa-Apercu-valide.html` byte-identical as the comparison source; production adaptations belong only in `src/atelier/` and metadata files.
- Keep legacy salon components and media in source but inactive; they are retained for restoration and must not override the approved visual system.
- Style the retained 404 only through its CSS module so navigation cannot leak either the legacy theme or reference page rules across routes.
- Keep booking and admin pages in an isolated booking module with scoped CSS and shared server-owned catalog/settings; adapt only the homepage hero actions in its React rendering and reuse the reference button classes without adding homepage styles, preserving the approved artifact.
- Enforce appointment privacy, administrator roles, December-only dates and non-overlapping agenda ranges in PostgreSQL; browser guards are presentation only and public inserts pass through a validated Cloud function.
- Save booking activation, hours and service durations together through the role-checked transactional settings function; partial configuration must never be reported as a successful save.
- Public availability (`booking_slots`) is read-only and independent of booking activation, returning only free start instants computed by the pure `booking_free_starts` helper; only creation (`create_booking`/booking-public) checks activation and validations, so previews show real free hours without ever writing appointments.
