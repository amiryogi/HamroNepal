/**
 * Category Detail Screen
 *
 * Shows articles for a specific category.
 */

import { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Colors, Spacing } from "@/constants";
import { NewsCard, Loading, ErrorView, EmptyState } from "@/components";
import { getArticles } from "@/services/news.service";
import { getCategoryBySlug } from "@/services/categories.service";
import type { Article, Category } from "@/types";

export default function CategoryDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);

  const loadData = useCallback(
    async (showLoading = true) => {
      if (!slug) return;

      if (showLoading) setLoading(true);
      setError(null);

      try {
        const categoryData = await getCategoryBySlug(slug);
        if (!categoryData) {
          setError("श्रेणी फेला परेन।");
          return;
        }

        setCategory(categoryData);

        const articlesData = await getArticles(30, 0, categoryData.$id);
        setArticles(articlesData.documents);
      } catch (err) {
        console.error("Failed to load category:", err);
        setError("डाटा लोड गर्न सकिएन।");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [slug]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(false);
  }, [loadData]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={() => loadData()} />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: category?.name || "श्रेणी",
        }}
      />
      <FlatList
        data={articles}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.articleItem}>
            <NewsCard article={item} />
          </View>
        )}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.md,
  },
  articleItem: {
    marginBottom: Spacing.md,
  },
});
