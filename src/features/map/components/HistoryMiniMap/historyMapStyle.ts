// historyMapStyle.ts — light Google Maps style for the S6 History mini-map.
// The spec calls for a LIGHT mini-map (the frozen LiveMap stays dark), so this
// is a soft day-mode JSON rather than the night array LiveMapView uses.
export const historyMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#F2F1EC' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6B7280' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#E3E2DD' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#FBF7E8' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#C9DDF0' }] },
];
