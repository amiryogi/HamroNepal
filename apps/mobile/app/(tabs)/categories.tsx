/**
 * Categories Screen
 *
 * Browse news by category.
 */

import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants";
import { Loading, ErrorView, EmptyState } from "@/components";
import { getCategories } from "@/services/categories.service";
import { getArticles } from "@/services/news.service";
import type { Category } from "@/types";

interface CategoryWithCount extends Category {
  articleCount?: number;
}

export default function CategoriesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);

  const loadCategories = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const data = await getCategories();

      // Get article counts for each category
      const categoriesWithCounts = await Promise.all(
        data.map(async (category) => {
          try {
            const articles = await getArticles(1, 0, category.$id);
            return { ...category, articleCount: articles.total };
          } catch {
            return { ...category, articleCount: 0 };
          }
        })
      );

      setCategories(categoriesWithCounts);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("श्रेणीहरू लोड गर्न सकिएन।");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCategories(false);
  }, [loadCategories]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={() => loadCategories()} />;
  }

  if (categories.length === 0) {
    return <EmptyState icon="grid-outline" message="कुनै श्रेणी फेला परेन।" />;
  }

  const getCategoryIcon = (slug: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      politics: "flag",
      sports: "football",
      business: "briefcase",
      entertainment: "musical-notes",
      technology: "hardware-chip",
      health: "heart",
      education: "school",
      world: "globe",
      society: "people",
    };
    return iconMap[slug] || "newspaper";
  };

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.$id}
      numColumns={2}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push(`/category/${item.slug}` as never)}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons
              name={getCategoryIcon(item.slug)}
              size={32}
              color={colors.primary}
            />
          </View>
          <Text style={[styles.categoryName, { color: colors.text }]}>
            {item.name}
          </Text>
          {item.articleCount !== undefined && (
            <Text style={[styles.articleCount, { color: colors.textMuted }]}>
              {item.articleCount} समाचार
            </Text>
          )}
        </Pressable>
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.md,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  categoryName: {
    fontSize: FontSize.md,
    fontWeight: "600",
    textAlign: "center",
  },
  articleCount: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
});
