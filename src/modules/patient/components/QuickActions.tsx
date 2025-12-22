import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';

export type QuickAction = {
  title: string;
  description: string;
  icon: string;
  iconColor?: string;
};

type QuickActionsProps = {
  theme: ThemePalette;
  actions: QuickAction[];
};

const QuickActions: React.FC<QuickActionsProps> = ({ theme, actions }) => {
  return (
    <View style={styles.grid}>
      {actions.map(action => (
        <View
          key={action.title}
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Icon
            name={action.icon}
            size={24}
            color={action.iconColor ?? theme.accent}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {action.title}
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {action.description}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    width: '47%',
    gap: 8,
    borderWidth: 1,
  },
  icon: {
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default QuickActions;
