/**
 * EmptyState Component
 *
 * Displays empty state with icon and message.
 */

import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, FontSize } from "@/constants";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  message?: string;
}

export function EmptyState({
  icon = "newspaper-outline",
  message = "कुनै समाचार फेला परेन।",
}: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons name={icon} size={64} color={colors.textMuted} />
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  message: {
    fontSize: FontSize.lg,
    textAlign: "center",
    marginTop: Spacing.md,
  },
});
