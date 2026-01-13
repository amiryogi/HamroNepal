/**
 * NewsCard Component
 *
 * Displays a news article card.
 */

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants";
import { formatRelativeTime, getImageUrl } from "@/lib";
import type { Article } from "@/types";

interface NewsCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const imageUrl = article.featuredImage
    ? getImageUrl(article.featuredImage, 400, 250)
    : null;

  if (variant === "featured") {
    return (
      <Link href={`/news/${article.$id}`} asChild>
        <Pressable
          style={[styles.featuredCard, { backgroundColor: colors.surface }]}
        >
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.featuredImage}
              contentFit="cover"
              transition={200}
            />
          )}
          <View style={styles.featuredOverlay}>
            {article.isBreaking && (
              <View
                style={[
                  styles.breakingBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.breakingText}>ब्रेकिङ</Text>
              </View>
            )}
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {article.title}
            </Text>
            <Text style={styles.featuredMeta}>
              {formatRelativeTime(article.$createdAt)}
            </Text>
          </View>
        </Pressable>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/news/${article.$id}`} asChild>
        <Pressable
          style={[
            styles.compactCard,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.compactContent}>
            <Text
              style={[styles.compactTitle, { color: colors.text }]}
              numberOfLines={2}
            >
              {article.title}
            </Text>
            <Text style={[styles.compactMeta, { color: colors.textMuted }]}>
              {formatRelativeTime(article.$createdAt)}
            </Text>
          </View>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.compactImage}
              contentFit="cover"
              transition={200}
            />
          )}
        </Pressable>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/news/${article.$id}`} asChild>
      <Pressable style={[styles.card, { backgroundColor: colors.surface }]}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        )}
        <View style={styles.content}>
          {article.isBreaking && (
            <View
              style={[
                styles.breakingBadge,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.breakingText}>ब्रेकिङ</Text>
            </View>
          )}
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={2}
          >
            {article.title}
          </Text>
          <Text
            style={[styles.excerpt, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {article.excerpt}
          </Text>
          <View style={styles.meta}>
            <Text style={[styles.metaText, { color: colors.textMuted }]}>
              {article.authorName}
            </Text>
            <Text style={[styles.metaText, { color: colors.textMuted }]}>
              {formatRelativeTime(article.$createdAt)}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  // Default card
  card: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: "100%",
    height: 180,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    marginBottom: Spacing.xs,
    lineHeight: FontSize.lg * 1.4,
  },
  excerpt: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
    lineHeight: FontSize.sm * 1.5,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: FontSize.xs,
  },

  // Featured card
  featuredCard: {
    height: 250,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  featuredTitle: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    color: "#ffffff",
    lineHeight: FontSize.xl * 1.3,
  },
  featuredMeta: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.8)",
    marginTop: Spacing.xs,
  },

  // Compact card
  compactCard: {
    flexDirection: "row",
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  compactContent: {
    flex: 1,
    marginRight: Spacing.md,
    justifyContent: "center",
  },
  compactTitle: {
    fontSize: FontSize.md,
    fontWeight: "500",
    lineHeight: FontSize.md * 1.4,
  },
  compactMeta: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
  compactImage: {
    width: 80,
    height: 60,
    borderRadius: BorderRadius.sm,
  },

  // Breaking badge
  breakingBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  breakingText: {
    color: "#ffffff",
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
});
