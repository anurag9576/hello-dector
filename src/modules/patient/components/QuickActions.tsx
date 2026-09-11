import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';
import { useThemeContext } from '../../../theme/ThemeContext';

export type QuickAction = {
  title: string;
  description: string;
  icon: string;
  iconColor?: string;
};

type QuickActionsProps = {
  theme: ThemePalette;
  actions: QuickAction[];
  onActionPress?: (actionTitle: string) => void;
};

/* ── Individual card with press animation ── */
const ActionCard: React.FC<{
  action: QuickAction;
  theme: ThemePalette;
  mode: string;
  onPress?: () => void;
}> = ({ action, theme, mode, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 8,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const iconBg = action.iconColor
    ? action.iconColor + '15'
    : theme.accent + '15';

  const accentColor = action.iconColor ?? theme.accent;

  return (
    <Animated.View
      style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor:
              mode === 'dark'
                ? 'rgba(255,255,255,0.07)'
                : 'rgba(0,0,0,0.05)',
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Decorative corner accent */}
        <View
          style={[
            styles.cornerAccent,
            { backgroundColor: accentColor + '08' },
          ]}
        />

        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
          <Icon name={action.icon} size={22} color={accentColor} />
        </View>

        {/* Content */}
        <Text
          style={[styles.title, { color: theme.textPrimary }]}
          numberOfLines={2}
        >
          {action.title}
        </Text>
        <Text
          style={[styles.description, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {action.description}
        </Text>

        {/* Inline CTA */}
        <View style={styles.ctaRow}>
          <View
            style={[styles.ctaPill, { backgroundColor: accentColor + '12' }]}
          >
            <Icon name="arrow-right" size={14} color={accentColor} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

/* ── Grid container ── */
const QuickActions: React.FC<QuickActionsProps> = ({
  theme,
  actions,
  onActionPress,
}) => {
  const { mode } = useThemeContext();

  // Render rows of 2 items each
  const rows: QuickAction[][] = [];
  for (let i = 0; i < actions.length; i += 2) {
    rows.push(actions.slice(i, i + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map(action => (
            <ActionCard
              key={action.title}
              action={action}
              theme={theme}
              mode={mode}
              onPress={() => onActionPress?.(action.title)}
            />
          ))}
          {/* If odd number in last row, add spacer */}
          {row.length === 1 && <View style={styles.cardWrapper} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    borderRadius: 22,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cornerAccent: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 19,
  },
  description: {
    fontSize: 11,
    lineHeight: 16,
    opacity: 0.7,
  },
  ctaRow: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  ctaPill: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuickActions;
