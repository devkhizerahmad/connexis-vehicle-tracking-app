import { StyleSheet } from 'react-native';
import { colors, radii, shadows } from '@shared/theme';

export const styles = StyleSheet.create({
  /**
   * PATCH UI-POLISH (PART 2): visible 1pt near-black outline + subtle shadow.
   *
   * The shadow is why the clipping moved out to `cardClip`. On Android,
   * `elevation` is drawn by the parent compositor and an `overflow: 'hidden'` on
   * the SAME view suppresses it — so this shell carries border + radius +
   * elevation and no clipping, while `cardClip` keeps the rounded-corner clip
   * that the coloured header/status bar needs.
   *
   * `borderWidth` sits INSIDE the element box in Yoga, so the outline costs the
   * inner content 2pt and leaves the card's outer footprint identical — no
   * layout shift in the list.
   */
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line.strong,
    marginBottom: 10,
    ...shadows.card,
  },
  /** Rounded-corner clip for the coloured header/status bar + premium bar. */
  cardClip: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  // PATCH H-D: header h40, name 13pt/400 padL 12, status 13pt bold centred
  header: {
    height: 40,
    flexDirection: 'row',
  },
  headerName: {
    width: '55%',
    backgroundColor: colors.black,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  headerNameText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '400',
  },
  headerStatus: {
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStatusText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  // B14: the three bright status fills fail white-text contrast, so they
  // use dark ink; the red Stop fill keeps white.
  headerStatusTextDark: {
    color: colors.black,
  },
  // body — PATCH H-D: photo 86x55 at (14,12)
  body: {
    backgroundColor: colors.surface.card,
    paddingTop: 12,
    paddingLeft: 14,
    paddingRight: 12,
    paddingBottom: 12,
    // PATCH UI-POLISH (PART 3): column, because the Last-Update + buttons row
    // needs the FULL card width. Kept as a 35/65 row it was ~210pt wide and two
    // 40pt buttons plus the "Last Update:" label simply did not fit at 390pt —
    // "View on Map" was clipped off the card edge. The photo/details column and
    // the two info rows keep their original 35/65 split inside `bodyTop`.
    flexDirection: 'column',
  },
  bodyTop: {
    flexDirection: 'row',
  },
  leftCol: {
    width: '35%',
    alignItems: 'flex-start',
  },
  photo: {
    width: 86,
    height: 55,
  },
  // PATCH H-D: battery/satellite/signal rows wrapped in a dashed box
  batteryBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 2,
    padding: 6,
    marginTop: 8,
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  batteryText: {
    color: colors.grayStrong,
    fontSize: 10,
    marginLeft: 3,
  },
  // PATCH H-D: "More Details" 10pt/600 #8A9199 with an ArrowRight glyph (10)
  moreDetailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  moreDetails: {
    color: colors.grayStrong,
    fontSize: 10,
    fontWeight: '600',
    marginRight: 2,
  },
  rightCol: {
    flex: 1,
    paddingLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  infoIcon: {
    marginTop: 1,
  },
  // PATCH H-D: LABEL bold 11pt #4A4F54 + VALUE regular 11pt #7A8288
  infoLabel: {
    color: colors.text.label,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 8,
  },
  infoValue: {
    color: colors.text.secondary,
    fontSize: 11,
    flexShrink: 1,
  },
  // PATCH UI-POLISH (PART 3): "Last Update" + the two action buttons now share
  // one row. `infoValue` keeps flexShrink so the date is the ONLY thing that
  // gives way; the buttons are pinned by `flexShrink: 0` so they can never be
  // squeezed, wrapped or clipped at 390pt.
  /**
   * PATCH UI-POLISH (footer restore): the footer is ONE row beneath the
   * photo/info split — "More Details →" on the left, the two compact action
   * buttons on the right, both vertically centred. Its side padding mirrors
   * `body` (14 / 12) so the footer's edges line up with the columns above it.
   */
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    // intrinsic width — the buttons must size to their label, never stretch
    flexShrink: 0,
  },
  /**
   * Compact, intrinsic-width action button.
   *
   * Geometry is SAMPLED from `design-references/home total assts records.jpeg`
   * (Suzuki Mehran footer, row scan at y=495; image is 336px wide for a 390pt
   * screen, so scale = 0.8615):
   *   grey button  x 166..226 -> 70.8pt wide
   *   navy button  x 231..303 -> 84.7pt wide
   *   height      y 492..508 -> 19.7pt
   *   gap         4-5px      -> ~5pt
   * `fontSize: 10` + `icon 12` + `paddingHorizontal: 10` reproduces both sampled
   * widths almost exactly. Height is 24 rather than the measured ~20: 4pt of
   * that is JPEG softening on the corner, and 24 keeps a sane tap target while
   * staying far closer to the reference than the 40pt this used to be.
   *
   * NO `flex`, NO `width`, NO `alignSelf` — intrinsic width only.
   */
  actionBtn: {
    height: 24,
    borderRadius: radii.sm,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  // PATCH H-D: premium bar h26 maroon, star 12 + 11pt/400 #C9CED4 padL 10
  premiumBar: {
    height: 26,
    backgroundColor: colors.home.premiumMaroon,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  premiumText: {
    color: colors.home.premiumLabel,
    fontSize: 11,
    fontWeight: '400',
    marginLeft: 6,
  },
  chevronWrap: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  // PATCH H-D: sensor strip h44, cells HORIZONTAL (icon 14 + label/value column)
  sensorClip: {
    overflow: 'hidden',
    backgroundColor: colors.surface.card,
  },
  sensorStrip: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: colors.surface.card,
  },
  sensorCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  sensorCol: {
    marginLeft: 6,
  },
  sensorDivider: {
    width: 1,
    backgroundColor: colors.home.sensorDivider,
  },
  sensorLabel: {
    color: colors.text.secondary,
    fontSize: 9,
  },
  sensorValue: {
    color: colors.home.bodyText,
    fontSize: 11,
    fontWeight: '700',
  },
});
