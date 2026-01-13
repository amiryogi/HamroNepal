/**
 * Search Screen
 *
 * Search news articles.
 */

import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  useColorScheme,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants";
import { NewsCard, Loading, EmptyState } from "@/components";
import { searchArticles } from "@/services/news.service";
import type { Article } from "@/types";

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    Keyboard.dismiss();
    setLoading(true);
    setSearched(true);

    try {
      const data = await searchArticles(query.trim());
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="समाचार खोज्नुहोस्..."
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { color: colors.text }]}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {query.length > 0 && (
            <Pressable onPress={clearSearch}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={handleSearch}
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.searchButtonText}>खोज्नुहोस्</Text>
        </Pressable>
      </View>

      {/* Results */}
      {loading ? (
        <Loading />
      ) : !searched ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={80} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            समाचार खोज्न माथि टाइप गर्नुहोस्
          </Text>
        </View>
      ) : results.length === 0 ? (
        <EmptyState
          icon="search-outline"
          message={`"${query}" का लागि कुनै नतिजा फेला परेन।`}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <NewsCard article={item} variant="compact" />
            </View>
          )}
          ListHeaderComponent={
            <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
              {results.length} नतिजा फेला पर्यो
            </Text>
          }
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    height: 48,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    height: "100%",
  },
  searchButton: {
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    height: 48,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.lg,
    textAlign: "center",
    marginTop: Spacing.md,
  },
  resultsList: {
    padding: Spacing.md,
  },
  resultCount: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
  },
  resultItem: {
    marginBottom: 0,
  },
});
