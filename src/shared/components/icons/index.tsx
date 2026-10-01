// index.tsx — dependency-free icons barrel
import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@shared/theme';

export interface IconProps {
  color: string;
  size: number;
}

export const Chevron = ({
  dir = 'left',
  color = colors.white,
  size = 14,
}: {
  dir?: 'left' | 'right' | 'down';
  color?: string;
  size?: number;
}) => {
  const glyph = dir === 'left' ? '❮' : dir === 'right' ? '❯' : '▾';
  return (
    <Text
      style={{
        color,
        fontSize: dir === 'down' ? size + 2 : size + 4,
        fontWeight: '700',
        lineHeight: size + 6,
        textAlign: 'center',
        marginTop: dir === 'down' ? -size * 0.35 : 0,
      }}>
      {glyph}
    </Text>
  );
};

/**
 * PATCH L5: V-shape chevron (down) — dropdown affordance. Dependency-free: two
 * borders on a rotated square. Added alongside `Chevron` (whose filled ▾ glyph is
 * left untouched so frozen Details/Profile dropdowns render byte-identically).
 */
export const ChevronDown = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size * 0.55,
        height: size * 0.55,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: color,
        transform: [{ rotate: '45deg' }],
        marginTop: -size * 0.18,
      }}
    />
  </View>
);

export const StatusIcons = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      {[3, 5, 7, 9].map(h => (
        <View
          key={h}
          style={{
            width: 2.5,
            height: h,
            borderRadius: 1,
            backgroundColor: colors.white,
            marginLeft: 1.5,
          }}
        />
      ))}
    </View>
    <View style={{ width: 13, height: 11, alignItems: 'center', justifyContent: 'flex-end', marginLeft: 4 }}>
      <View
        style={{
          width: 12,
          height: 6,
          borderTopWidth: 1.6,
          borderLeftWidth: 1.6,
          borderRightWidth: 1.6,
          borderColor: colors.white,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        }}
      />
      <View
        style={{
          width: 7,
          height: 4,
          borderTopWidth: 1.6,
          borderLeftWidth: 1.6,
          borderRightWidth: 1.6,
          borderColor: colors.white,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          marginTop: -1,
        }}
      />
      <View style={{ width: 2.5, height: 2.5, borderRadius: 2, backgroundColor: colors.white, marginTop: 0.5 }} />
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
      <View
        style={{
          width: 20,
          height: 10,
          borderWidth: 1,
          borderColor: colors.white,
          borderRadius: 2.5,
          padding: 1,
        }}>
        <View style={{ flex: 1, width: '80%', backgroundColor: colors.white, borderRadius: 1 }} />
      </View>
      <View
        style={{
          width: 1.5,
          height: 4,
          backgroundColor: colors.white,
          borderTopRightRadius: 1,
          borderBottomRightRadius: 1,
          marginLeft: 0.5,
        }}
      />
    </View>
  </View>
);

export const Pin = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center' }}>
    <View
      style={{
        width: size * 0.62,
        height: size * 0.62,
        borderRadius: size * 0.31,
        backgroundColor: color,
        marginTop: size * 0.06,
      }}
    />
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: size * 0.2,
        borderRightWidth: size * 0.2,
        borderTopWidth: size * 0.3,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: color,
        marginTop: -size * 0.04,
      }}
    />
    <View
      style={{
        position: 'absolute',
        top: size * 0.24,
        width: size * 0.24,
        height: size * 0.24,
        borderRadius: size * 0.12,
        backgroundColor: colors.white,
      }}
    />
  </View>
);

export const Clock = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderWidth: size * 0.11,
      borderColor: color,
      borderRadius: size / 2,
    }}>
    <View
      style={{
        width: size * 0.1,
        height: size * 0.26,
        backgroundColor: color,
        position: 'absolute',
        left: size * 0.44,
        top: size * 0.16,
      }}
    />
    <View
      style={{
        width: size * 0.2,
        height: size * 0.1,
        backgroundColor: color,
        position: 'absolute',
        left: size * 0.44,
        top: size * 0.42,
      }}
    />
  </View>
);

export const Speedo = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size,
      height: size * 0.62,
      borderTopWidth: size * 0.14,
      borderLeftWidth: size * 0.14,
      borderRightWidth: size * 0.14,
      borderColor: color,
      borderTopLeftRadius: size,
      borderTopRightRadius: size,
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
    <View
      style={{
        width: size * 0.1,
        height: size * 0.42,
        backgroundColor: color,
        transform: [{ rotate: '35deg' }],
        marginTop: size * 0.1,
      }}
    />
  </View>
);

export const FuelPump = ({ color, size }: IconProps) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: size }}>
    <View
      style={{
        width: size * 0.52,
        height: size,
        backgroundColor: color,
        borderRadius: size * 0.08,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{ width: size * 0.28, height: size * 0.3, backgroundColor: colors.white, borderRadius: 1 }} />
    </View>
    <View style={{ width: size * 0.08, height: size * 0.62, backgroundColor: color, marginLeft: size * 0.06 }} />
    <View style={{ width: size * 0.22, height: size * 0.1, backgroundColor: color }} />
  </View>
);

export const Thermo = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center' }}>
    <View
      style={{
        width: size * 0.36,
        height: size * 0.6,
        borderWidth: size * 0.1,
        borderColor: color,
        borderRadius: size * 0.18,
        alignItems: 'center',
      }}>
      <View style={{ width: size * 0.1, height: size * 0.3, backgroundColor: color, marginTop: size * 0.14 }} />
    </View>
    <View
      style={{
        width: size * 0.42,
        height: size * 0.42,
        borderRadius: size * 0.21,
        backgroundColor: color,
        marginTop: -size * 0.12,
      }}
    />
  </View>
);

export const RouteIcon = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'space-between' }}>
    <View style={{ width: size * 0.32, height: size * 0.32, borderRadius: size * 0.16, backgroundColor: color }} />
    <View style={{ width: size * 0.12, flex: 1, backgroundColor: color }} />
    <View
      style={{
        width: size * 0.32,
        height: size * 0.32,
        borderRadius: size * 0.16,
        borderWidth: size * 0.1,
        borderColor: color,
      }}
    />
  </View>
);

export const Clipboard = ({ color, size }: IconProps) => (
  <View style={{ width: size * 0.75, height: size, borderWidth: size * 0.09, borderColor: color, borderRadius: 2, alignItems: 'center' }}>
    <View style={{ width: size * 0.36, height: size * 0.16, backgroundColor: color, borderRadius: 1, marginTop: -size * 0.05 }} />
    <View style={{ width: size * 0.4, height: size * 0.07, backgroundColor: color, marginTop: size * 0.14 }} />
    <View style={{ width: size * 0.4, height: size * 0.07, backgroundColor: color, marginTop: size * 0.08 }} />
  </View>
);

export const StopSign = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: size * 0.22,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <View style={{ width: size * 0.5, height: size * 0.16, backgroundColor: colors.white, borderRadius: 1 }} />
  </View>
);

export const CircleGlyph = ({
  color,
  size,
  glyph,
  glyphColor = colors.white,
}: IconProps & { glyph: string; glyphColor?: string }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text style={{ color: glyphColor, fontSize: size * 0.58, fontWeight: '800', lineHeight: size * 0.68, textAlign: 'center' }}>
      {glyph}
    </Text>
  </View>
);

export const AlertCircle = ({ color, size }: IconProps) => (
  <CircleGlyph color={color} size={size} glyph="!" />
);

export const CheckCircle = ({ color, size }: IconProps) => (
  <CircleGlyph color={color} size={size} glyph="✓" />
);

export const SadFace = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderWidth: size * 0.09,
      borderColor: color,
      borderRadius: size / 2,
      alignItems: 'center',
    }}>
    <View style={{ flexDirection: 'row', marginTop: size * 0.24 }}>
      <View style={{ width: size * 0.09, height: size * 0.09, borderRadius: size * 0.05, backgroundColor: color, marginHorizontal: size * 0.13 }} />
      <View style={{ width: size * 0.09, height: size * 0.09, borderRadius: size * 0.05, backgroundColor: color, marginHorizontal: size * 0.13 }} />
    </View>
    <View
      style={{
        width: size * 0.4,
        height: size * 0.2,
        borderWidth: size * 0.08,
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
        borderBottomLeftRadius: size * 0.2,
        borderBottomRightRadius: size * 0.2,
        marginTop: size * 0.1,
        transform: [{ rotate: '180deg' }],
      }}
    />
  </View>
);

export const Droplet = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center' }}>
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: size * 0.18,
        borderRightWidth: size * 0.18,
        borderBottomWidth: size * 0.2,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      }}
    />
    <View
      style={{
        width: size * 0.62,
        height: size * 0.62,
        borderRadius: size * 0.31,
        backgroundColor: color,
        marginTop: -size * 0.04,
      }}
    />
  </View>
);

export const Shield = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size * 0.7,
      height: size * 0.86,
      borderWidth: size * 0.1,
      borderColor: color,
      borderTopLeftRadius: size * 0.35,
      borderTopRightRadius: size * 0.35,
      borderBottomLeftRadius: size * 0.35,
      borderBottomRightRadius: 0,
      transform: [{ rotate: '45deg' }],
      marginTop: size * 0.04,
    }}
  />
);

export const Tank = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size * 0.8,
      height: size * 0.9,
      borderWidth: size * 0.1,
      borderColor: color,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: size * 0.06,
    }}>
    <View style={{ width: size * 0.5, height: size * 0.1, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

export const Ruler = ({ color, size }: IconProps) => (
  <View style={{ width: size * 0.34, height: size * 0.9, borderWidth: size * 0.1, borderColor: color, borderRadius: 2, alignItems: 'center', justifyContent: 'space-evenly' }}>
    {[0, 1, 2].map(i => (
      <View key={i} style={{ width: size * 0.16, height: size * 0.06, backgroundColor: color }} />
    ))}
  </View>
);

export const Wind = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size * 0.8, justifyContent: 'space-between', marginTop: size * 0.08 }}>
    <View style={{ height: size * 0.09, width: size, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ height: size * 0.09, width: size * 0.72, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ height: size * 0.09, width: size * 0.88, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

export const Leaf = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size * 0.66,
        height: size * 0.66,
        borderWidth: size * 0.1,
        borderColor: color,
        borderBottomLeftRadius: size * 0.5,
        borderTopRightRadius: size * 0.5,
        transform: [{ rotate: '45deg' }],
      }}
    />
  </View>
);

export const Steering = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderWidth: size * 0.1,
      borderColor: color,
      borderRadius: size / 2,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <View style={{ width: size * 0.72, height: size * 0.09, backgroundColor: color, position: 'absolute', top: size * 0.3 }} />
    <View style={{ width: size * 0.09, height: size * 0.34, backgroundColor: color, position: 'absolute', bottom: size * 0.08, transform: [{ rotate: '28deg' }], left: size * 0.18 }} />
    <View style={{ width: size * 0.09, height: size * 0.34, backgroundColor: color, position: 'absolute', bottom: size * 0.08, transform: [{ rotate: '-28deg' }], right: size * 0.18 }} />
    <View style={{ width: size * 0.18, height: size * 0.18, borderRadius: size * 0.09, backgroundColor: color, marginTop: size * 0.14 }} />
  </View>
);

export const FlagIcon = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, flexDirection: 'row' }}>
    <View style={{ width: size * 0.09, height: size, backgroundColor: color, borderRadius: 1 }} />
    <View
      style={{
        width: size * 0.6,
        height: size * 0.55,
        backgroundColor: color,
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
        marginTop: size * 0.1,
      }}
    />
  </View>
);

export const Fence = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: 'space-between' }}>
    <View style={{ height: size * 0.1, width: size, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingTop: size * 0.06 }}>
      {[0, 1, 2].map(i => (
        <View key={i} style={{ width: size * 0.14, backgroundColor: color, borderRadius: 1, flex: 1, marginHorizontal: 1 }} />
      ))}
    </View>
  </View>
);

export const Group = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center' }}>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14, backgroundColor: color, marginRight: -size * 0.08 }} />
      <View style={{ width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14, backgroundColor: color, marginLeft: -size * 0.08 }} />
    </View>
    <View style={{ flexDirection: 'row', marginTop: 1 }}>
      <View style={{ width: size * 0.34, height: size * 0.36, backgroundColor: color, borderTopLeftRadius: size * 0.17, borderTopRightRadius: size * 0.17, marginRight: -size * 0.1 }} />
      <View style={{ width: size * 0.34, height: size * 0.36, backgroundColor: color, borderTopLeftRadius: size * 0.17, borderTopRightRadius: size * 0.17, marginLeft: -size * 0.1 }} />
    </View>
  </View>
);

export const FoldedMap = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size * 0.8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: size * 0.26, height: size * 0.7, borderWidth: size * 0.09, borderColor: color, borderRightWidth: 0, borderRadius: 1, transform: [{ rotate: '-6deg' }] }} />
    <View style={{ width: size * 0.26, height: size * 0.7, borderWidth: size * 0.09, borderColor: color, borderRightWidth: 0, borderRadius: 1, transform: [{ rotate: '6deg' }] }} />
    <View style={{ width: size * 0.26, height: size * 0.7, borderWidth: size * 0.09, borderColor: color, borderRadius: 1, transform: [{ rotate: '-6deg' }] }} />
  </View>
);

export const BoxIcon = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size * 0.86,
      height: size * 0.7,
      borderWidth: size * 0.09,
      borderColor: color,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: size * 0.1,
    }}>
    <View style={{ width: size * 0.5, height: size * 0.1, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

export const HomeIcon = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center' }}>
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: size * 0.5,
        borderRightWidth: size * 0.5,
        borderBottomWidth: size * 0.36,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      }}
    />
    <View
      style={{
        width: size * 0.72,
        height: size * 0.44,
        backgroundColor: color,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{ width: size * 0.2, height: size * 0.26, backgroundColor: colors.white, borderTopLeftRadius: 1, borderTopRightRadius: 1 }} />
    </View>
  </View>
);

export const DocIcon = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size * 0.72,
      height: size * 0.92,
      borderWidth: size * 0.09,
      borderColor: color,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingVertical: size * 0.08,
    }}>
    {[0, 1, 2].map(i => (
      <View key={i} style={{ width: size * 0.4, height: size * 0.07, backgroundColor: color, borderRadius: 1 }} />
    ))}
  </View>
);

export const KeyIcon = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ width: size * 0.4, height: size * 0.4, borderWidth: size * 0.1, borderColor: color, borderRadius: size * 0.2 }} />
    <View style={{ width: size * 0.42, height: size * 0.1, backgroundColor: color }} />
    <View style={{ width: size * 0.1, height: size * 0.22, backgroundColor: color, marginTop: size * 0.16 }} />
  </View>
);

export const PersonIcon = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center' }}>
    <View style={{ width: size * 0.36, height: size * 0.36, borderRadius: size * 0.18, backgroundColor: color, marginTop: size * 0.04 }} />
    <View
      style={{
        width: size * 0.66,
        height: size * 0.4,
        backgroundColor: color,
        borderTopLeftRadius: size * 0.33,
        borderTopRightRadius: size * 0.33,
        marginTop: size * 0.06,
      }}
    />
  </View>
);

export const MapOutline = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size * 0.9,
      height: size * 0.72,
      borderWidth: size * 0.09,
      borderColor: color,
      borderRadius: 2,
      flexDirection: 'row',
      alignItems: 'stretch',
      justifyContent: 'space-evenly',
      paddingVertical: size * 0.06,
      marginTop: size * 0.1,
    }}>
    <View style={{ width: size * 0.06, backgroundColor: color }} />
    <View style={{ width: size * 0.06, backgroundColor: color }} />
  </View>
);

export const TileIcon = ({ name, color, size }: { name: string; color: string; size: number }) => {
  switch (name) {
    case 'gauge':
      return <Speedo color={color} size={size} />;
    case 'droplet':
      return <Droplet color={color} size={size} />;
    case 'shield':
      return <Shield color={color} size={size} />;
    case 'tank':
      return <Tank color={color} size={size} />;
    case 'ruler':
      return <Ruler color={color} size={size} />;
    case 'thermo':
      return <Thermo color={color} size={size} />;
    case 'wind':
      return <Wind color={color} size={size} />;
    case 'leaf':
      return <Leaf color={color} size={size} />;
    default:
      return <Droplet color={color} size={size} />;
  }
};

export const ReportIcon = ({ name, color, size }: { name: string; color: string; size: number }) => {
  switch (name) {
    case 'steering':
      return <Steering color={color} size={size} />;
    case 'flag':
      return <FlagIcon color={color} size={size} />;
    case 'fence':
      return <Fence color={color} size={size} />;
    case 'group':
      return <Group color={color} size={size} />;
    case 'map':
      return <FoldedMap color={color} size={size} />;
    case 'box':
      return <BoxIcon color={color} size={size} />;
    default:
      return <DocIcon color={color} size={size} />;
  }
};

export const CheckMark = ({ color, size }: IconProps) => (
  <Text style={{ color, fontSize: size, fontWeight: '800', lineHeight: size * 1.2, textAlign: 'center' }}>
    ✓
  </Text>
);

export const ArrowCircle = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text style={{ color: colors.white, fontSize: size * 0.62, fontWeight: '800', lineHeight: size * 0.7, textAlign: 'center' }}>
      ▲
    </Text>
  </View>
);

// ─── HOME SCREEN glyphs (additive, PATCH HOME) ───────────────────────────────

/** Notification bell — Home header actions slot. */
export const BellIcon = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center' }}>
    <View
      style={{
        width: size * 0.58,
        height: size * 0.52,
        borderTopWidth: size * 0.15,
        borderLeftWidth: size * 0.15,
        borderRightWidth: size * 0.15,
        borderColor: color,
        borderTopLeftRadius: size * 0.3,
        borderTopRightRadius: size * 0.3,
      }}
    />
    <View style={{ width: size * 0.76, height: size * 0.15, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: size * 0.18, height: size * 0.12, borderRadius: size * 0.06, backgroundColor: color, marginTop: 1 }} />
  </View>
);

/** 3x3 grid — Total summary card. */
export const GridIcon = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
      <View key={i} style={{ width: size * 0.22, height: size * 0.22, backgroundColor: color, borderRadius: 1, margin: size * 0.055 }} />
    ))}
  </View>
);

/** Car silhouette — Running summary card. */
export const CarGlyph = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size * 0.62, alignItems: 'center' }}>
    <View
      style={{
        width: size * 0.8,
        height: size * 0.34,
        borderTopWidth: size * 0.1,
        borderLeftWidth: size * 0.1,
        borderRightWidth: size * 0.1,
        borderColor: color,
        borderTopLeftRadius: size * 0.2,
        borderTopRightRadius: size * 0.2,
      }}
    />
    <View style={{ width: size, height: size * 0.14, backgroundColor: color, borderRadius: 2 }} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: size * 0.9 }}>
      <View style={{ width: size * 0.18, height: size * 0.18, borderRadius: size * 0.09, backgroundColor: color, marginTop: -1 }} />
      <View style={{ width: size * 0.18, height: size * 0.18, borderRadius: size * 0.09, backgroundColor: color, marginTop: -1 }} />
    </View>
  </View>
);

/**
 * Refresh CIRCULAR double-arrow — Assets List row (PATCH H-C).
 * Composed from a ring with the top+bottom quadrants transparent (=> two side arcs) plus two
 * triangular arrowheads, reproducing the reference's circular sync glyph (NOT a "⇆" swap arrow).
 */
export const RefreshIcon = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: size * 0.11,
        borderColor: color,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
      }}
    />
    {/* top arrowhead — clockwise */}
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: size * 0.1,
        width: 0,
        height: 0,
        borderLeftWidth: size * 0.3,
        borderLeftColor: color,
        borderTopWidth: size * 0.17,
        borderTopColor: 'transparent',
        borderBottomWidth: size * 0.17,
        borderBottomColor: 'transparent',
      }}
    />
    {/* bottom arrowhead — clockwise */}
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: size * 0.1,
        width: 0,
        height: 0,
        borderRightWidth: size * 0.3,
        borderRightColor: color,
        borderTopWidth: size * 0.17,
        borderTopColor: 'transparent',
        borderBottomWidth: size * 0.17,
        borderBottomColor: 'transparent',
      }}
    />
  </View>
);

/** Battery (red/yellow/green variants by color) — AssetCard mini-list. */
export const BatteryGlyph = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size * 0.55, flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ width: size * 0.78, height: size * 0.5, borderWidth: size * 0.1, borderColor: color, borderRadius: 1.5 }} />
    <View style={{ width: size * 0.14, height: size * 0.22, backgroundColor: color, marginLeft: 0.5, borderRadius: 0.5 }} />
  </View>
);

/** Ascending signal bars (green) — AssetCard mini-list. */
export const SignalBars = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size * 0.62, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    {[0.34, 0.55, 0.78, 1].map((h, i) => (
      <View key={i} style={{ width: size * 0.16, height: size * 0.62 * h, backgroundColor: color, borderRadius: 0.5 }} />
    ))}
  </View>
);

/** Star — Premium bar. */
export const StarIcon = ({ color, size }: IconProps) => (
  <Text style={{ color, fontSize: size, lineHeight: size * 1.2, textAlign: 'center' }}>★</Text>
);

/** Vehicle door — sensor strip. */
export const DoorIcon = ({ color, size }: IconProps) => (
  <View style={{ width: size * 0.66, height: size, borderWidth: size * 0.11, borderColor: color, borderRadius: 1.5, alignItems: 'flex-end', justifyContent: 'center', paddingRight: size * 0.12 }}>
    <View style={{ width: size * 0.1, height: size * 0.1, borderRadius: size * 0.05, backgroundColor: color }} />
  </View>
);

/** Warning triangle — No Data summary card. */
export const WarningTriangle = ({ color, size }: IconProps) => (
  <Text style={{ color, fontSize: size, lineHeight: size * 1.2, textAlign: 'center' }}>⚠</Text>
);

/** PATCH HOME/H-D: right arrow glyph — "More Details" link on AssetCard. */
export const ArrowRight = ({ color, size }: IconProps) => (
  <Text style={{ color, fontSize: size, lineHeight: size * 1.2, textAlign: 'center' }}>→</Text>
);

/** PATCH HOME/H-D: red circle-play glyph — "Last Location" row on AssetCard. */
export const CirclePlay = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text style={{ color: colors.white, fontSize: size * 0.44, lineHeight: size * 0.5, marginLeft: size * 0.06 }}>▶</Text>
  </View>
);

/** List/document glyph — Reports button on AssetCard. */
export const ListIcon = ({ color, size }: IconProps) => (
  <View style={{ width: size * 0.8, height: size, justifyContent: 'space-evenly', alignItems: 'center' }}>
    {[0, 1, 2].map(i => (
      <View key={i} style={{ width: size * 0.7, height: size * 0.09, backgroundColor: color, borderRadius: 0.5 }} />
    ))}
  </View>
);

/**
 * PATCH T-HISTORY: thin left arrow — the "View Live" link on the S2 chip row.
 * Dependency-free (text glyph) so frozen screens keep their existing icons.
 */
export const ArrowLeft = ({ color, size }: IconProps) => (
  <Text style={{ color, fontSize: size, lineHeight: size * 1.15, textAlign: 'center' }}>←</Text>
);

/** PATCH T-HISTORY: filled navigation arrow tilted up-right — S6 alert banner. */
export const NavArrow = ({ color, size }: IconProps) => (
  <Text
    style={{
      color,
      fontSize: size,
      lineHeight: size * 1.1,
      textAlign: 'center',
      transform: [{ rotate: '-45deg' }],
    }}>
    ➤
  </Text>
);

/** PATCH T-HISTORY: solid caret ('◀' / '▶') — S8 hour/minute jump arrows. */
export const CaretSolid = ({
  color,
  size,
  dir = 'left',
}: IconProps & { dir?: 'left' | 'right' }) => (
  <Text style={{ color, fontSize: size, lineHeight: size * 1.15, textAlign: 'center' }}>
    {dir === 'left' ? '◀' : '▶'}
  </Text>
);

/** PATCH T-HISTORY: ring dot (coloured ring, white centre) — S7 playback state pill. */
export const StatusRing = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: Math.max(2, size * 0.3),
      borderColor: color,
      backgroundColor: colors.white,
    }}
  />
);

/** PATCH T-HISTORY: outlined calendar shell — S7 playback timestamp row. */
export const CalendarGlyph = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center' }}>
    <View
      style={{
        width: size,
        height: size * 0.88,
        borderWidth: Math.max(1.5, size * 0.11),
        borderColor: color,
        borderRadius: size * 0.16,
        marginTop: size * 0.12,
        justifyContent: 'center',
      }}>
      <View style={{ height: Math.max(1.5, size * 0.1), backgroundColor: color }} />
    </View>
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: size * 0.18,
        width: Math.max(1.5, size * 0.1),
        height: size * 0.24,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: size * 0.18,
        width: Math.max(1.5, size * 0.1),
        height: size * 0.24,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />
  </View>
);

/** PATCH T-HISTORY: transport glyphs (skip-back / play / pause / skip-forward). */
export const TransportGlyph = ({
  color,
  size,
  glyph,
}: IconProps & { glyph: 'prev' | 'play' | 'pause' | 'next' }) => (
  <Text
    style={{
      color,
      fontSize: size,
      lineHeight: size * 1.15,
      textAlign: 'center',
    }}>
    {glyph === 'prev' ? '⏮' : glyph === 'next' ? '⏭' : glyph === 'pause' ? '❚❚' : '▶'}
  </Text>
);

/* ------------------------------------------------------------------ *
 * Reports screen glyphs (dependency-free, drawn with borders/rects).
 * New icons only — nothing above this block is touched, so the frozen
 * Home/Details/Profile/LiveMap/History icon output stays byte-identical.
 * ------------------------------------------------------------------ */

/** Reports S7–S9: road/highway glyph (two rails + a centre divider). */
export const HighwayGlyph = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: size * 0.08,
    }}>
    <View
      style={{
        position: 'absolute',
        left: size * 0.16,
        top: 0,
        bottom: 0,
        width: size * 0.1,
        backgroundColor: color,
        borderRadius: size * 0.05,
      }}
    />
    <View
      style={{
        position: 'absolute',
        right: size * 0.16,
        top: 0,
        bottom: 0,
        width: size * 0.1,
        backgroundColor: color,
        borderRadius: size * 0.05,
      }}
    />
    {[0, 1, 2].map(i => (
      <View
        key={i}
        style={{
          width: size * 0.12,
          height: size * 0.16,
          backgroundColor: color,
          borderRadius: size * 0.04,
        }}
      />
    ))}
  </View>
);

/** Reports S7–S9: geofence glyph (location pin over a dashed boundary). */
export const GeofenceGlyph = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-start' }}>
    <View
      style={{
        width: size * 0.44,
        height: size * 0.44,
        borderRadius: size * 0.22,
        borderWidth: Math.max(1.2, size * 0.09),
        borderColor: color,
        marginTop: size * 0.1,
      }}
    />
    <View
      style={{
        marginTop: -size * 0.06,
        width: size * 0.2,
        height: size * 0.2,
        borderRadius: size * 0.1,
        backgroundColor: color,
      }}
    />
    <View
      style={{
        marginTop: size * 0.04,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: size * 0.8,
      }}>
      {[0, 1, 2, 3].map(i => (
        <View
          key={i}
          style={{
            width: size * 0.14,
            height: size * 0.08,
            backgroundColor: color,
            borderRadius: size * 0.04,
          }}
        />
      ))}
    </View>
  </View>
);

/** Reports S7–S9: share glyph (three dots joined by two rails). */
export const ShareGlyph = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: 'space-between' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.24,
          height: size * 0.24,
          borderRadius: size * 0.12,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          flex: 1,
          height: Math.max(1, size * 0.1),
          marginHorizontal: size * 0.06,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          width: size * 0.24,
          height: size * 0.24,
          borderRadius: size * 0.12,
          backgroundColor: color,
        }}
      />
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.24,
          height: size * 0.24,
          borderRadius: size * 0.12,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          flex: 1,
          height: Math.max(1, size * 0.1),
          marginHorizontal: size * 0.06,
          backgroundColor: color,
        }}
      />
    </View>
  </View>
);

/** Reports S7–S9: green circular "+" affordance (bottom-right of a tile body). */
export const PlusCircleGlyph = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <View
      style={{
        position: 'absolute',
        width: size * 0.5,
        height: Math.max(1.4, size * 0.12),
        borderRadius: size * 0.06,
        backgroundColor: colors.white,
      }}
    />
    <View
      style={{
        position: 'absolute',
        height: size * 0.5,
        width: Math.max(1.4, size * 0.12),
        borderRadius: size * 0.06,
        backgroundColor: colors.white,
      }}
    />
  </View>
);

/* ------------------------------------------------------------------ *
 * Engine Control screen glyphs (dependency-free, drawn with borders/rects).
 * Additive block: nothing above this line is touched, so the frozen
 * Home/Details/Profile/LiveMap/History/Reports icon output stays
 * byte-identical.
 * ------------------------------------------------------------------ */

/** Engine Control S3: OUTLINED alert ring (red/amber ring + "!"). */
export const AlertRing = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: Math.max(1.5, size * 0.11),
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text
      style={{
        color,
        fontSize: size * 0.62,
        fontWeight: '800',
        lineHeight: size * 0.72,
        textAlign: 'center',
      }}>
      !
    </Text>
  </View>
);

/** Engine Control S8: closed padlock (shackle up + body). */
export const LockGlyph = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center' }}>
    <View
      style={{
        width: size * 0.5,
        height: size * 0.42,
        borderWidth: Math.max(1.5, size * 0.1),
        borderBottomWidth: 0,
        borderColor: color,
        borderTopLeftRadius: size * 0.25,
        borderTopRightRadius: size * 0.25,
        marginTop: size * 0.04,
      }}
    />
    <View
      style={{
        width: size * 0.8,
        height: size * 0.5,
        backgroundColor: color,
        borderRadius: size * 0.12,
        marginTop: -size * 0.06,
      }}
    />
  </View>
);

/** Engine Control S8: open padlock (shackle lifted clear of the body). */
export const UnlockGlyph = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'flex-end' }}>
    <View
      style={{
        width: size * 0.5,
        height: size * 0.42,
        borderWidth: Math.max(1.5, size * 0.1),
        borderBottomWidth: 0,
        borderColor: color,
        borderTopLeftRadius: size * 0.25,
        borderTopRightRadius: size * 0.25,
        marginRight: size * 0.1,
        marginTop: size * 0.04,
      }}
    />
    <View
      style={{
        width: size * 0.8,
        height: size * 0.5,
        backgroundColor: color,
        borderRadius: size * 0.12,
        marginTop: -size * 0.06,
      }}
    />
  </View>
);

/** Engine Control S12: support headset (band + two ear cups). */
export const SupportGlyph = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center' }}>
    <View
      style={{
        width: size * 0.62,
        height: size * 0.34,
        borderWidth: Math.max(1.5, size * 0.1),
        borderBottomWidth: 0,
        borderColor: color,
        borderTopLeftRadius: size * 0.34,
        borderTopRightRadius: size * 0.34,
        marginTop: size * 0.08,
      }}
    />
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: size * 0.86,
        marginTop: -size * 0.02,
      }}>
      <View
        style={{
          width: size * 0.22,
          height: size * 0.38,
          borderRadius: size * 0.08,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          width: size * 0.22,
          height: size * 0.38,
          borderRadius: size * 0.08,
          backgroundColor: color,
        }}
      />
    </View>
    <View
      style={{
        width: size * 0.34,
        height: size * 0.18,
        borderBottomWidth: Math.max(1.5, size * 0.1),
        borderLeftWidth: Math.max(1.5, size * 0.1),
        borderColor: color,
        borderBottomLeftRadius: size * 0.16,
        marginTop: -size * 0.06,
        marginLeft: size * 0.2,
      }}
    />
  </View>
);

/** Engine Control S5: fence chip glyph — three posts behind two rails. */
export const FenceChipGlyph = ({ color, size }: IconProps) => {
  const bar = Math.max(1.4, size * 0.13);
  return (
    <View
      style={{
        width: size,
        height: size,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {[0, 1, 2].map(index => (
        <View
          key={index}
          style={{
            width: bar,
            height: size,
            borderRadius: bar / 2,
            backgroundColor: color,
          }}
        />
      ))}
      <View
        style={{
          position: 'absolute',
          top: size * 0.24,
          left: 0,
          right: 0,
          height: bar,
          borderRadius: bar / 2,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.24,
          left: 0,
          right: 0,
          height: bar,
          borderRadius: bar / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

/**
 * Engine Control S2: "out of fence" pill badge — a rounded badge outline holding a
 * small rounded square (fence post) with a centre dot, per the reference pill glyph.
 */
export const ZoneBadge = ({ color, size }: IconProps) => {
  const ring = Math.max(1.5, size * 0.1);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderWidth: ring,
        borderColor: color,
        borderRadius: size * 0.3,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: size * 0.42,
          height: size * 0.42,
          borderWidth: ring,
          borderColor: color,
          borderRadius: size * 0.08,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{ width: size * 0.14, height: size * 0.14, backgroundColor: color }} />
      </View>
    </View>
  );
};

/** Engine Control S2 (F3): camera-lock glyph — body + lens ring + shutter dot. */
export const CameraLockGlyph = ({ color, size }: IconProps) => {
  const ring = Math.max(1.2, size * 0.1);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderWidth: ring,
        borderColor: color,
        borderRadius: size * 0.22,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: size * 0.44,
          height: size * 0.44,
          borderWidth: ring,
          borderColor: color,
          borderRadius: size * 0.22,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.14,
          right: size * 0.1,
          width: size * 0.18,
          height: size * 0.18,
          borderRadius: size * 0.09,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

/** Engine Control S2 (F3): open-in-new (external link) — box + diagonal arrow. */
export const ExternalLinkGlyph = ({ color, size }: IconProps) => {
  const bar = Math.max(1.2, size * 0.11);
  return (
    <View style={{ width: size, height: size, justifyContent: 'flex-end' }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: size * 0.62,
          height: size * 0.62,
          borderTopWidth: bar,
          borderRightWidth: bar,
          borderColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.1,
          right: size * 0.1,
          width: size * 0.42,
          height: bar,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
        }}
      />
      <View
        style={{
          width: size * 0.6,
          height: size * 0.6,
          marginRight: size * 0.14,
          marginBottom: size * 0.14,
          borderWidth: bar,
          borderRightWidth: 0,
          borderBottomWidth: 0,
          borderColor: color,
        }}
      />
    </View>
  );
};

/** Engine Control S2 (F4): right-pointing play triangle (solid). */
export const PlayTriangleGlyph = ({ color, size }: IconProps) => (
  <View
    style={{
      width: 0,
      height: 0,
      borderTopWidth: size * 0.5,
      borderBottomWidth: size * 0.5,
      borderLeftWidth: size * 0.86,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: color,
    }}
  />
);

/** Engine Control S4 (F6): shield with a check — used by the "Current Fence" chip. */
export const ShieldCheckGlyph = ({ color, size }: IconProps) => {
  const bar = Math.max(1.2, size * 0.11);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.82,
          height: size * 0.9,
          borderWidth: bar,
          borderColor: color,
          borderTopLeftRadius: size * 0.16,
          borderTopRightRadius: size * 0.16,
          borderBottomLeftRadius: size * 0.4,
          borderBottomRightRadius: size * 0.4,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: size * 0.3,
            height: size * 0.16,
            borderLeftWidth: bar,
            borderBottomWidth: bar,
            borderColor: color,
            transform: [{ rotate: '-45deg' }],
            marginTop: -size * 0.12,
          }}
        />
      </View>
    </View>
  );
};

/** Engine Control S5 (F7): shuffle — two crossing rails with two arrowheads. */
export const ShuffleGlyph = ({ color, size }: IconProps) => {
  const bar = Math.max(1.3, size * 0.12);
  const rail = {
    position: 'absolute' as const,
    height: bar,
    backgroundColor: color,
    borderRadius: bar / 2,
  };
  const head = {
    position: 'absolute' as const,
    right: 0,
    width: 0,
    height: 0,
    borderTopWidth: size * 0.17,
    borderBottomWidth: size * 0.17,
    borderLeftWidth: size * 0.2,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: color,
  };
  return (
    <View style={{ width: size, height: size }}>
      <View style={[rail, { top: size * 0.24, left: 0, width: size * 0.62 }]} />
      <View style={[rail, { bottom: size * 0.24, left: 0, width: size * 0.62 }]} />
      <View
        style={[
          rail,
          {
            top: size * 0.42,
            left: size * 0.28,
            width: size * 0.48,
            transform: [{ rotate: '-34deg' }],
          },
        ]}
      />
      <View
        style={[
          rail,
          {
            bottom: size * 0.42,
            left: size * 0.28,
            width: size * 0.48,
            transform: [{ rotate: '34deg' }],
          },
        ]}
      />
      <View style={[head, { top: size * 0.1 }]} />
      <View style={[head, { bottom: size * 0.1 }]} />
    </View>
  );
};

/** Engine Control S4 (F10): blue diamond map marker. */
export const DiamondMarker = ({ color, size }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      transform: [{ rotate: '45deg' }],
    }}
  />
);

/** Engine Control S4 (F10): red teardrop map pin (circle head + triangular tail). */
export const TeardropPin = ({ color, size }: IconProps) => (
  <View style={{ width: size, height: size * 1.25, alignItems: 'center' }}>
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        borderWidth: Math.max(1.2, size * 0.08),
        borderColor: '#FFFFFF',
      }}
    />
    <View
      style={{
        width: 0,
        height: 0,
        marginTop: -size * 0.16,
        borderLeftWidth: size * 0.26,
        borderRightWidth: size * 0.26,
        borderTopWidth: size * 0.36,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: color,
      }}
    />
  </View>
);

