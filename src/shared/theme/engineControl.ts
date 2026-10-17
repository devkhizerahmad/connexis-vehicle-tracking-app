// engineControl.ts — Engine Control screen design tokens (S1–S12).
// Kept in its own module (like reports.ts / history.ts) so the frozen
// Home/Details/Profile/LiveMap/History/Reports token blocks stay byte-identical;
// the barrel re-export is additive.
//
// PROVENANCE: every value below was sampled from the 390x844 reference artboard
// (`design-references/engine control enhance version.png`, 724x2172 px) with a
// GDI+ pixel probe (rows / quant ops). The artboard is 1.856x the 390pt grid, so
// pixel measurements were divided by 1.856 and rounded.

/** Engine Control palette. */
export const ecColors = {
  // S1 header ink (gradient header comes from colors.gradientHeader)
  headerInk: '#FFFFFF',
  /**
   * PHASE-1 DESIGN LANGUAGE (P8) — Engine Control's own header gradient.
   *
   * The shared `colors.gradientHeader` (#B2250C -> #160F12) is frozen for every
   * other screen, so this screen cannot repoint it. These stops are HUE samples
   * off `design-references/engine control.jpeg`: a brick #A13E16 at the status
   * bar easing to a near-black #251E1D under the nav row — i.e. the same
   * top-to-bottom direction but a RED THAT IS SLIGHTLY LESS DEEP than the shared
   * pair. Direction preserved, depth reduced.
   */
  headerGradient: ['#A13E16', '#251E1D'] as const,

  // S2 vehicle cards
  card: '#FFFFFF',
  cardBorder: '#E8EEF4',
  /** P1: grey half of the "Last Updated" caption under the car photo. */
  captionInk: '#5A626C',
  /** P1: bold half of that caption (the mock's time value). */
  nameInk: '#1A1A1A',
  statusInk: '#1F2A37',
  addressInk: '#8A9199',
  /** S2 "Out of Fence" badge (sampled #EA061D — flat fill, no gradient). */
  fencePillBg: '#EA061D',
  fencePillInk: '#FFFFFF',
  /** S2 "Running" flag + S6 route-1 badge (sampled #55D003 / #55DA06). */
  runningGreen: '#55D003',

  // S3 out-of-geofence alert banner (sampled #FEE3E7 bg / #EB0518 ring + ink)
  alertBg: '#FEE3E7',
  alertInk: '#EA061D',
  /**
   * PHASE-1 (P7): the thin pink-red hairline that makes the banner a RECTANGLE
   * rather than a floating tinted pill. A shade deeper than `alertBg` so it reads
   * as an edge, never as a second fill.
   */
  alertBorder: '#F0AFB4',

  /** S4 geofence map overlays (sampled #082339 / #67DC52 green chip) */
  mapBoxBg: '#082339',
  mapBoxInk: '#FFFFFF',
  mapBoxLabel: '#C9CED4',
  /**
   * PHASE-1 (P4): the "Current Fence" chip re-inked. The old pair was
   * #8AF96A fill + WHITE text, which failed contrast outright. The reference
   * samples the fill at #67DC52 and paints DARK GREEN type on it.
   */
  mapChipBg: '#67DC52',
  mapChipInk: '#0E3B18',
  /** Dark-green fence glyph inside the lime chip (sampled #036D37). */
  mapChipIconInk: '#036D37',
  mapDot: '#2196F3',
  mapPin: '#EA061D',
  mapFence: '#0F1723',
  /** Barely-there tint inside the geofence ring (the reference fill is clear). */
  mapFenceFill: 'rgba(15, 23, 35, 0.02)',
  /**
   * F1: last-resort avatar tint so the header can never show a blank white disc.
   */
  avatarFallback: '#7A4A3A',

  // S5 change-fence button (sampled #00873A deep green — NOT the #4CAF50 family)
  fenceGreen: '#00873A',

  // S6/S7 section bars — dark maroon base + the diagonal bright-red block
  barDark: '#220C0F',
  barDarkEdge: '#1A0709',
  barRed: '#B00101',
  /** Gradient stops of the diagonal block itself (sampled #8B0201 → #D60101). */
  barRedDeep: '#8B0201',
  barRedBright: '#D60101',
  barInk: '#FFFFFF',

  // S6 route rows
  badgeGreen: '#55D003',
  /**
   * PHASE-1 (P6): route-2's badge is ORANGE in the reference (sampled #EEB748,
   * a warm amber-orange). The old `badgeAmber` #FDBE07 read as flat yellow and
   * was repointed here; nothing else consumed the old value.
   */
  badgeOrange: '#F0941F',
  badgeRed: '#E90821',
  badgeInk: '#FFFFFF',
  /**
   * PHASE-1 (P6): the duration read as a BLUE-grey (#7C93AE) against an otherwise
   * neutral row. The reference paints it plain grey, so it is neutralised.
   */
  durationInk: '#9AA0A6',
  routeTitleInk: '#1A1A1A',
  routeSubInk: '#8A9199',
  timeInk: '#7A8288',
  /**
   * PHASE-1 (P6): the dashed connector that chains the number badges. The old
   * hairline grey (#EDF1F5) was effectively invisible on white; this is the
   * mid grey the reference's dashes actually read as.
   */
  connectorInk: '#C2C8CE',
  /**
   * PHASE-1 (P6): route state is PLAIN COLOURED TEXT, so only inks survive —
   * the chip background tokens (movingBg / idleBg / stopBg) are gone with the
   * chips. Idle moved #E5A200 -> #E07B00 so it matches the new orange badge.
   */
  movingInk: '#43A047',
  idleInk: '#E07B00',
  stopInk: '#E53935',

  // S7 control rows (sampled #EAF4FC row fill, #071A34 ink)
  rowBg: '#EAF4FC',
  rowInk: '#0B1F37',
  chevronInk: '#8A9199',

  // S8 lock / unlock cards (sampled #E53935 + #1599FD borders, #0B1B36 / #00295F inks)
  lockBorder: '#E53935',
  unlockBorder: '#0097FE',
  /** The Unlock card carries a pale blue tint under its blue border. */
  unlockBg: '#F1F9FE',
  /**
   * PATCH EC-SWIPE: the mirror of `unlockBg` for the SELECTED Lock card, so the
   * pending-action model can tint whichever side is armed with its own accent.
   * Sampled to the same near-white density as the blue tint (not a saturated red).
   */
  lockBg: '#FDECEE',
  lockInk: '#0B1B36',
  unlockInk: '#00295F',
  actionInk: '#1F2A37',

  // S9 privacy policy row (sampled #F4F9FD fill, #374864 ink)
  privacyBg: '#F4F9FD',
  privacyInk: '#374864',

  // S10 slide to proceed (sampled #03203B)
  slideBg: '#03203B',
  slideInk: '#FFFFFF',
  /**
   * PATCH S10-ANIM: the artboard's pill shows neither a thumb nor a trail, so
   * these two are the slider's OWN drag feedback (revealed only while a drag is
   * live) and stay inside the navy so the resting pill still matches the mock.
   */
  slideTrail: 'rgba(255, 255, 255, 0.16)',
  slideKnob: '#FFFFFF',
  /**
   * PATCH EC-SWIPE (rn-swipe-button): the library's thumb is a real drag handle,
   * but the artboard draws a FLAT navy pill with the chevrons floating in it and
   * no visible disc. These two keep the resting look while still giving the
   * thumb a grab affordance — a barely-there lighter navy disc (same density as
   * `slideTrail`) rather than a white knob.
   */
  slideThumbBg: 'rgba(255, 255, 255, 0.10)',
  slideThumbInk: '#FFFFFF',

  // S11 FAQ card
  faqTitleInk: '#03203B',
  faqQInk: '#1F2A37',
  faqAInk: '#8A9199',

  // S12 support button (sampled #0097FE)
  supportBg: '#0097FE',
  supportInk: '#FFFFFF',
} as const;

/**
 * Engine Control metrics, in points.
 *
 * Multipliers in the comments are the raw artboard pixel reads (/1.856).
 */
export const ecSizes = {
  /**
   * PHASE-1 DESIGN LANGUAGE (P8) — corner radii.
   *
   * `flat` is the Phase-1 default: the reference is a FLAT / SHARP design, so
   * every Phase-1 surface (vehicle card, alert banner, map, route card, section
   * bar, map corner badges) paints square. `cardRadius` / `radiusSm` /
   * `radiusChip` are deliberately LEFT ALONE below — ControlRows (S7),
   * FaqCard (S11), SupportButton (S12), LockUnlockRow (S8) and PrivacyPolicyRow
   * (S9) all read them, and those are Phase-2, out of scope for this item.
   * `fenceBtnRadius` is the single Phase-1 exception (P7 keeps the Change Fence
   * button at ~8).
   */
  flat: 0,
  /** P7: the ONE rounded corner radius left in Phase 1 — the Change Fence button. */
  fenceBtnRadius: 8,

  /**
   * S7–S12 page gutter — cards measured at x=26..697 px. UNTOUCHED: ControlRows
   * (S7) and FaqCard (S11) consume it, and both are Phase-2.
   */
  gutter: 14,
  /**
   * PHASE-1 (P8): the ONE symmetric left/right page margin for the Phase-1
   * surfaces that stay inset (Driving Routes card + Change Fence button).
   * Declared separately from `gutter` precisely so Phase-2 is unaffected, and so
   * the two inset Phase-1 blocks can never drift out of alignment with each
   * other — they previously sat on 14 and 16 respectively.
   * The vehicle card, alert banner and map are edge-to-edge (margin 0).
   */
  pageGutter: 14,
  /** S8/S10/S12 — measured at x=48..676 px (the cards' inner gutter). */
  innerGutter: 26,

  /** Vertical rhythm between sections (rowmap gaps ≈ 10–17 px). */
  sectionGap: 8,
  /**
   * P1: the vehicle card is attached directly under the header (the reference
   * shows no gap at all), so this is now 0 rather than the old 10.
   */
  scrollTopPad: 0,
  scrollBottomPad: 24,
  /**
   * F13: extra breathing room between S12 (Support) and the top of the absolute
   * BottomNav overlay, added on top of `sizes.bottomNav + insets.bottom`.
   */
  scrollNavBuffer: 12,
  /**
   * PATCH EC-SWIPE: gap between the toast's bottom edge and the top of the
   * BottomNav overlay. Without it the toast is painted over by the nav.
   */
  toastNavGap: 10,

  /**
   * PHASE-1 (P8): header avatar. 32 -> 28 pt (~12% smaller, per P8).
   * `avatarCropScale` over-scales the photo inside the circular frame so the
   * asset's BAKED-IN white ring (profile_avatar.png is an opaque 96x96 square
   * with a white hoop at ~92% radius) falls outside the clip — the ring is
   * removed by clipping, not by swapping the asset.
   */
  avatar: 28,
  avatarCropScale: 1.16,
  /**
   * P8: header title one step down from the shared 18 pt, and semi-bold.
   * The shared AppHeader reads typography.title (18/700); this is passed in as
   * an override so every other screen keeps its own frozen value.
   */
  headerTitleSize: 15.5,
  /** P8: back chevron size and lighter weight (the shared default is 16 / 700). */
  headerBackSize: 13,
  headerBackWeight: '400' as const,

  // S2 — ONE flat full-width card (left identity | right live status)
  /**
   * P8: car photo 108 -> 96 pt wide (~11% down), keeping the source 135:68
   * (1.985) aspect ratio so the artwork is scaled uniformly, never squashed.
   */
  carW: 96,
  carH: 48,
  /** Inner side pad of the flat vehicle card. */
  vehicleCardPadH: 14,
  /** Card's bottom pad (the top band is owned by the absolutely-placed badge). */
  vehicleCardPadV: 12,
  /** Gap between the "Out of Fence" badge and the first status line under it. */
  statusTopGap: 6,
  /** P3/P8: badge height 29 -> 24 pt, and SQUARE (P3/P7 sharp, no radius). */
  pillH: 24,
  /** P2: the "Running" row is tall enough for its own lineHeight + descender. */
  statusRowH: 24,
  /** P8: the green ▸ flag shrinks with the rest of the type. */
  flagSize: 13,
  flagGap: 5,
  /** Address lines align with the "Running" label, not the flag. */
  addressIndent: 18,
  addressLineH: 15,

  // S3 banner — P7: 30 -> 21 pt (≈30% less vertical padding)
  bannerH: 21,

  // S4 map — edge-to-edge, sharp, and slightly TALLER to hold the fitted fence
  mapH: 215,
  /**
   * P4: both corner badges are FLUSH to the map's sharp top corners (0), so
   * they no longer float inside a rounded map.
   */
  mapInset: 0,

  // S5 change-fence button — P7: 32 -> 27 pt (≈15% shorter)
  fenceBtnH: 27,

  // S6/S7 section bars (43 px → 23 pt) — barH is SHARED with the Phase-2
  // "Control Vehicle" bar via SectionBar, so it is deliberately unchanged.
  barH: 23,

  // S6 route rows — P6: tighter rows, smaller number badges, no chip metrics
  routeRowH: 60,
  badge: 20,
  badgeRadius: 5,

  // S7 control rows (1400..1452 px → 29 pt)
  controlRowH: 29,
  controlRowPadH: 12,

  // S8 lock / unlock cards (1535..1603 px → 37 pt is the sampled FILL; the
  // artboard's 1.5 pt red/blue border puts the border-box at 1531..1606 px →
  // 40 pt, and RN's `height` IS the border-box, so the card needs 40 pt to
  // render a 37 pt fill. Re-sampled from the column scans at x=190/x=450.)
  actionCardH: 40,
  /** Seam between the two cards (x=188..201 px → 11 pt). */
  actionCardGap: 11,
  /**
   * PATCH EC-SWIPE: the armed Lock/Unlock card thickens its border from the
   * resting 1.5 pt to 2.5 pt so the pending selection reads at a glance
   * (fill tint + heavier outline), matching the reference's chosen-state weight.
   */
  actionCardSelectedBorder: 2.5,

  // S9 privacy row (1606..1657 px → 27 pt)
  privacyRowH: 27,

  // S10 slide to proceed (re-sampled: the navy run at x=330/x=450 is
  // 1659..1723 px → 35 pt, not the 1661..1719 px the first pass caught). The
  // pill is a capsule, so the radius follows the height instead of a flat 16 pt.
  slideH: 35,
  slideRadius: 17.5,

  // S11 FAQ card (1747..2009 px → 141 pt of content in one white card).
  //
  // The card is content-driven, so matching the artboard means matching its TYPE.
  // Sampled from the artboard's body lines (16..17 px pitch at 1.856 px/dp → ≈9 pt
  // leading, Q&A pairs ≈24 px apart → ≈3 pt of air, long answers spanning ≈183 pt
  // for ≈55 characters → ≈8.5 pt). On-device at a 390 pt viewport (the artboard's
  // own width, so answers wrap identically) the text block then measured 147.5 pt
  // for a 141 pt target: the text was already correct and the residual 6.5 pt sat
  // in the padding and the air between pairs, so padV 6 -> 5 and gap 3 -> 2 remove
  // exactly 6 pt. The type sizes below are unchanged.
  faqPadH: 14,
  faqPadV: 5,
  faqGap: 2,
  faqIndent: 15,

  // S12 support button (2014..2051 px → 20 pt)
  supportH: 20,

  /**
   * SHARED radii — Phase-2 consumers (ControlRows S7, FaqCard S11,
   * SupportButton S12, LockUnlockRow S8, PrivacyPolicyRow S9, SectionBar S7).
   * FROZEN for this item: Phase 1 uses `flat` / `fenceBtnRadius` above instead.
   */
  cardRadius: 10,
  radiusSm: 8,
  radiusChip: 6,

  // glyph sizes
  iconSm: 14,
  iconMd: 18,

  /**
   * PHASE-1 (P5): the fence ring stroke. 3 -> 2 pt — the reference draws a thin
   * black hoop, and a 3 pt ring reads heavy once the camera is fitted (P5b).
   */
  mapFenceStroke: 2,
  /**
   * PHASE-1 (P5c): every map marker is one SMALL red pin. Was 18 (blue
   * diamonds) / 20 / 18 (red teardrops).
   */
  mapPinSize: 12,
  /**
   * PHASE-1 (P5b): the fitted camera leaves this fraction of the viewport as
   * clear air around the fence ring, so the circle never touches an edge.
   * 1.55 => the fence occupies ~65% of the map's SHORT axis (~18% margin a side).
   */
  mapFitPadFactor: 1.55,
  /**
   * PHASE-1 (P7): the "Driving Routes" bar title. 14/700 -> 12.5/600.
   * Applied by RouteList through SectionBar's `edge` variant, so the Phase-2
   * "Control Vehicle" bar keeps 14/700.
   */
  barTitleSize: 12.5,
} as const;
