// radii.ts — border radii definitions verbatim
export const radii = {
  card: 8,
  cardLg: 10,
  tile: 8,
  banner: 6,
  tab: 4,
  plate: 8,
  pill: 14,
  button: 8,

  // PATCH UI-POLISH: generic "card" radius for blocks that previously rendered
  // with square corners (History playback / list headers, reports sections).
  // Same value as `card` by design so the app reads as one system.
  md: 8,
  // PATCH UI-POLISH: compact-control radius, sampled off the Home reference's
  // asset-card footer buttons (crop of "home total assts records.jpeg"), whose
  // corners read as a tight 4pt rather than the 8pt used by full cards.
  sm: 4,

  // Verbatim aliases
  vehicleCard: 4,
  plateRow: 8,
  navActive: 10,
  badge: 4,
  chip: 6,
} as const;
