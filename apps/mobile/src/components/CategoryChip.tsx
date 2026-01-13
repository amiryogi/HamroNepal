/**
 * CategoryChip Component
 *
 * Displays a category chip for filtering.
 */

import { Text, StyleSheet, Pressable, useColorScheme } from "react-native";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants";
import type { Category } from "@/types";

interface CategoryChipProps {
  category: Category;
  isSelected?: boolean;
  onPress?: () => void;
}

export function CategoryChip({
  category,
  isSelected,
  onPress,
}: CategoryChipProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: isSelected ? colors.primary : colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}
    >
      <Text
        style={[styles.text, { color: isSelected ? "#ffffff" : colors.text }]}
      >
        {category.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: "500",
  },
});
