// darkMapStyle.ts — Google Maps night-style JSON (S5, verbatim from the task spec)
// + LiveMap overlay palette. Never touches shared theme tokens (UI-FREEZE).
export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0B1016' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6B7280' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B1016' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1F2937' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#111827' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#374151' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0E1621' }] },
];

/** Live-map overlay inks (map feature local — shared theme untouched). */
export const mapColors = {
  routeGreen: '#22C55E',
  trafficRed: '#EF4444',
  dashWhite: '#FFFFFF',
} as const;