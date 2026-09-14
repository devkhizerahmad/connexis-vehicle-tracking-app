// Icons.tsx — dependency-free icons composed from View/Text (no vector-font/SVG libs)
import React from 'react';
import {View, Text} from 'react-native';
import {C} from '../../theme/detailsTokens';

interface IconProps {
  color: string;
  size: number;
}

export const Chevron = ({
  dir = 'left',
  color = C.white,
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

export const StatusIcons = () => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
      {[3, 5, 7, 9].map(h => (
        <View
          key={h}
          style={{
            width: 2.5,
            height: h,
            borderRadius: 1,
            backgroundColor: C.white,
            marginLeft: 1.5,
          }}
        />
      ))}
    </View>
    <View style={{width: 13, height: 11, alignItems: 'center', justifyContent: 'flex-end', marginLeft: 4}}>
      <View
        style={{
          width: 12,
          height: 6,
          borderTopWidth: 1.6,
          borderLeftWidth: 1.6,
          borderRightWidth: 1.6,
          borderColor: C.white,
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
          borderColor: C.white,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          marginTop: -1,
        }}
      />
      <View style={{width: 2.5, height: 2.5, borderRadius: 2, backgroundColor: C.white, marginTop: 0.5}} />
    </View>
    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 4}}>
      <View
        style={{
          width: 20,
          height: 10,
          borderWidth: 1,
          borderColor: C.white,
          borderRadius: 2.5,
          padding: 1,
        }}>
        <View style={{flex: 1, width: '80%', backgroundColor: C.white, borderRadius: 1}} />
      </View>
      <View
        style={{
          width: 1.5,
          height: 4,
          backgroundColor: C.white,
          borderTopRightRadius: 1,
          borderBottomRightRadius: 1,
          marginLeft: 0.5,
        }}
      />
    </View>
  </View>
);

export const Pin = ({color, size}: IconProps) => (
  <View style={{width: size, height: size, alignItems: 'center'}}>
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
        backgroundColor: C.white,
      }}
    />
  </View>
);

export const Clock = ({color, size}: IconProps) => (
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

export const Speedo = ({color, size}: IconProps) => (
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
        transform: [{rotate: '35deg'}],
        marginTop: size * 0.1,
      }}
    />
  </View>
);

export const FuelPump = ({color, size}: IconProps) => (
  <View style={{flexDirection: 'row', alignItems: 'flex-end', height: size}}>
    <View
      style={{
        width: size * 0.52,
        height: size,
        backgroundColor: color,
        borderRadius: size * 0.08,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{width: size * 0.28, height: size * 0.3, backgroundColor: C.white, borderRadius: 1}} />
    </View>
    <View style={{width: size * 0.08, height: size * 0.62, backgroundColor: color, marginLeft: size * 0.06}} />
    <View style={{width: size * 0.22, height: size * 0.1, backgroundColor: color}} />
  </View>
);

export const Thermo = ({color, size}: IconProps) => (
  <View style={{width: size, height: size, alignItems: 'center'}}>
    <View
      style={{
        width: size * 0.36,
        height: size * 0.6,
        borderWidth: size * 0.1,
        borderColor: color,
        borderRadius: size * 0.18,
        alignItems: 'center',
      }}>
      <View style={{width: size * 0.1, height: size * 0.3, backgroundColor: color, marginTop: size * 0.14}} />
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

export const RouteIcon = ({color, size}: IconProps) => (
  <View style={{width: size, height: size, alignItems: 'center', justifyContent: 'space-between'}}>
    <View style={{width: size * 0.32, height: size * 0.32, borderRadius: size * 0.16, backgroundColor: color}} />
    <View style={{width: size * 0.12, flex: 1, backgroundColor: color}} />
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

export const Clipboard = ({color, size}: IconProps) => (
  <View style={{width: size * 0.75, height: size, borderWidth: size * 0.09, borderColor: color, borderRadius: 2, alignItems: 'center'}}>
    <View style={{width: size * 0.36, height: size * 0.16, backgroundColor: color, borderRadius: 1, marginTop: -size * 0.05}} />
    <View style={{width: size * 0.4, height: size * 0.07, backgroundColor: color, marginTop: size * 0.14}} />
    <View style={{width: size * 0.4, height: size * 0.07, backgroundColor: color, marginTop: size * 0.08}} />
  </View>
);

export const StopSign = ({color, size}: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: size * 0.22,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <View style={{width: size * 0.5, height: size * 0.16, backgroundColor: C.white, borderRadius: 1}} />
  </View>
);

export const CircleGlyph = ({
  color,
  size,
  glyph,
  glyphColor = C.white,
}: IconProps & {glyph: string; glyphColor?: string}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text style={{color: glyphColor, fontSize: size * 0.58, fontWeight: '800', lineHeight: size * 0.68, textAlign: 'center'}}>
      {glyph}
    </Text>
  </View>
);

export const AlertCircle = ({color, size}: IconProps) => (
  <CircleGlyph color={color} size={size} glyph="!" />
);

export const CheckCircle = ({color, size}: IconProps) => (
  <CircleGlyph color={color} size={size} glyph="✓" />
);

export const SadFace = ({color, size}: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderWidth: size * 0.09,
      borderColor: color,
      borderRadius: size / 2,
      alignItems: 'center',
    }}>
    <View style={{flexDirection: 'row', marginTop: size * 0.24}}>
      <View style={{width: size * 0.09, height: size * 0.09, borderRadius: size * 0.05, backgroundColor: color, marginHorizontal: size * 0.13}} />
      <View style={{width: size * 0.09, height: size * 0.09, borderRadius: size * 0.05, backgroundColor: color, marginHorizontal: size * 0.13}} />
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
        transform: [{rotate: '180deg'}],
      }}
    />
  </View>
);

export const Droplet = ({color, size}: IconProps) => (
  <View style={{width: size, height: size, alignItems: 'center'}}>
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

export const Shield = ({color, size}: IconProps) => (
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
      transform: [{rotate: '45deg'}],
      marginTop: size * 0.04,
    }}
  />
);

export const Tank = ({color, size}: IconProps) => (
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
    <View style={{width: size * 0.5, height: size * 0.1, backgroundColor: color, borderRadius: 1}} />
  </View>
);

export const Ruler = ({color, size}: IconProps) => (
  <View style={{width: size * 0.34, height: size * 0.9, borderWidth: size * 0.1, borderColor: color, borderRadius: 2, alignItems: 'center', justifyContent: 'space-evenly'}}>
    {[0, 1, 2].map(i => (
      <View key={i} style={{width: size * 0.16, height: size * 0.06, backgroundColor: color}} />
    ))}
  </View>
);

export const Wind = ({color, size}: IconProps) => (
  <View style={{width: size, height: size * 0.8, justifyContent: 'space-between', marginTop: size * 0.08}}>
    <View style={{height: size * 0.09, width: size, backgroundColor: color, borderRadius: 1}} />
    <View style={{height: size * 0.09, width: size * 0.72, backgroundColor: color, borderRadius: 1}} />
    <View style={{height: size * 0.09, width: size * 0.88, backgroundColor: color, borderRadius: 1}} />
  </View>
);

export const Leaf = ({color, size}: IconProps) => (
  <View style={{width: size, height: size, alignItems: 'center', justifyContent: 'center'}}>
    <View
      style={{
        width: size * 0.66,
        height: size * 0.66,
        borderWidth: size * 0.1,
        borderColor: color,
        borderBottomLeftRadius: size * 0.5,
        borderTopRightRadius: size * 0.5,
        transform: [{rotate: '45deg'}],
      }}
    />
  </View>
);

export const Steering = ({color, size}: IconProps) => (
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
    <View style={{width: size * 0.72, height: size * 0.09, backgroundColor: color, position: 'absolute', top: size * 0.3}} />
    <View style={{width: size * 0.09, height: size * 0.34, backgroundColor: color, position: 'absolute', bottom: size * 0.08, transform: [{rotate: '28deg'}], left: size * 0.18}} />
    <View style={{width: size * 0.09, height: size * 0.34, backgroundColor: color, position: 'absolute', bottom: size * 0.08, transform: [{rotate: '-28deg'}], right: size * 0.18}} />
    <View style={{width: size * 0.18, height: size * 0.18, borderRadius: size * 0.09, backgroundColor: color, marginTop: size * 0.14}} />
  </View>
);

export const FlagIcon = ({color, size}: IconProps) => (
  <View style={{width: size, height: size, flexDirection: 'row'}}>
    <View style={{width: size * 0.09, height: size, backgroundColor: color, borderRadius: 1}} />
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

export const Fence = ({color, size}: IconProps) => (
  <View style={{width: size, height: size, justifyContent: 'space-between'}}>
    <View style={{height: size * 0.1, width: size, backgroundColor: color, borderRadius: 1}} />
    <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingTop: size * 0.06}}>
      {[0, 1, 2].map(i => (
        <View key={i} style={{width: size * 0.14, backgroundColor: color, borderRadius: 1, flex: 1, marginHorizontal: 1}} />
      ))}
    </View>
  </View>
);

export const Group = ({color, size}: IconProps) => (
  <View style={{width: size, height: size, alignItems: 'center'}}>
    <View style={{flexDirection: 'row'}}>
      <View style={{width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14, backgroundColor: color, marginRight: -size * 0.08}} />
      <View style={{width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14, backgroundColor: color, marginLeft: -size * 0.08}} />
    </View>
    <View style={{flexDirection: 'row', marginTop: 1}}>
      <View style={{width: size * 0.34, height: size * 0.36, backgroundColor: color, borderTopLeftRadius: size * 0.17, borderTopRightRadius: size * 0.17, marginRight: -size * 0.1}} />
      <View style={{width: size * 0.34, height: size * 0.36, backgroundColor: color, borderTopLeftRadius: size * 0.17, borderTopRightRadius: size * 0.17, marginLeft: -size * 0.1}} />
    </View>
  </View>
);

export const FoldedMap = ({color, size}: IconProps) => (
  <View style={{width: size, height: size * 0.8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
    <View style={{width: size * 0.26, height: size * 0.7, borderWidth: size * 0.09, borderColor: color, borderRightWidth: 0, borderRadius: 1, transform: [{rotate: '-6deg'}]}} />
    <View style={{width: size * 0.26, height: size * 0.7, borderWidth: size * 0.09, borderColor: color, borderRightWidth: 0, borderRadius: 1, transform: [{rotate: '6deg'}]}} />
    <View style={{width: size * 0.26, height: size * 0.7, borderWidth: size * 0.09, borderColor: color, borderRadius: 1, transform: [{rotate: '-6deg'}]}} />
  </View>
);

export const BoxIcon = ({color, size}: IconProps) => (
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
    <View style={{width: size * 0.5, height: size * 0.1, backgroundColor: color, borderRadius: 1}} />
  </View>
);

export const HomeIcon = ({color, size}: IconProps) => (
  <View style={{width: size, height: size, alignItems: 'center'}}>
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
      <View style={{width: size * 0.2, height: size * 0.26, backgroundColor: C.white, borderTopLeftRadius: 1, borderTopRightRadius: 1}} />
    </View>
  </View>
);

export const DocIcon = ({color, size}: IconProps) => (
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
      <View key={i} style={{width: size * 0.4, height: size * 0.07, backgroundColor: color, borderRadius: 1}} />
    ))}
  </View>
);

export const KeyIcon = ({color, size}: IconProps) => (
  <View style={{width: size, height: size, flexDirection: 'row', alignItems: 'center'}}>
    <View style={{width: size * 0.4, height: size * 0.4, borderWidth: size * 0.1, borderColor: color, borderRadius: size * 0.2}} />
    <View style={{width: size * 0.42, height: size * 0.1, backgroundColor: color}} />
    <View style={{width: size * 0.1, height: size * 0.22, backgroundColor: color, marginTop: size * 0.16}} />
  </View>
);

export const PersonIcon = ({color, size}: IconProps) => (
  <View style={{width: size, height: size, alignItems: 'center'}}>
    <View style={{width: size * 0.36, height: size * 0.36, borderRadius: size * 0.18, backgroundColor: color, marginTop: size * 0.04}} />
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

export const MapOutline = ({color, size}: IconProps) => (
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
    <View style={{width: size * 0.06, backgroundColor: color}} />
    <View style={{width: size * 0.06, backgroundColor: color}} />
  </View>
);

// Semantic mappers used by the screen components
export const TileIcon = ({name, color, size}: {name: string; color: string; size: number}) => {
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

export const ReportIcon = ({name, color, size}: {name: string; color: string; size: number}) => {
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





export const CheckMark = ({color, size}: IconProps) => (
  <Text style={{color, fontSize: size, fontWeight: '800', lineHeight: size * 1.2, textAlign: 'center'}}>
    ✓
  </Text>
);

export const ArrowCircle = ({color, size}: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text style={{color: C.white, fontSize: size * 0.62, fontWeight: '800', lineHeight: size * 0.7, textAlign: 'center'}}>
      ▲
    </Text>
  </View>
);
