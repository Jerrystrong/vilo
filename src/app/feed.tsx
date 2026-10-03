import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";

import { ThemedView } from "@/components/themed-view";
import FeedPostCard, { FeedPostItem } from "@/components/feed-post-card";

interface StoryItem {
  id: string;
  name: string;
  image: ImageSourcePropType;
  badgeType: "flame" | "club" | "food" | "bar";
  hasFlame?: boolean;
}

const STORIES: StoryItem[] = [
  {
    id: "1",
    name: "Le Club",
    image: require("@/assets/images/leclub.png"),
    badgeType: "club",
    hasFlame: false,
  },
  {
    id: "2",
    name: "Patrick",
    image: require("@/assets/images/currentUser.png"),
    badgeType: "flame",
    hasFlame: true,
  },
  {
    id: "3",
    name: "Big Bite",
    image: require("@/assets/images/bigbite.png"),
    badgeType: "food",
    hasFlame: false,
  },
  {
    id: "4",
    name: "Majestic",
    image: require("@/assets/images/bbmal.png"),
    badgeType: "flame",
    hasFlame: true,
  },
  {
    id: "5",
    name: "Annette",
    image: require("@/assets/images/currentUser.png"),
    badgeType: "flame",
    hasFlame: true,
  },
];

const FEED_POSTS: FeedPostItem[] = [
  {
    id: "post-1",
    author: {
      name: "Annette Birega",
      avatar: require("@/assets/images/currentUser.png"),
      timeAgo: "Il y a 12h",
    },
    hotMultiplier: "2x",
    hasFlame: true,
    type: "standard",
    text: "Nous organisons une très grande fête, l'une des plus grandes de la ville de Kinshasa ! 🥳🎉 Vous êtes tous priés de réserver dès maintenant,",
    image: require("@/assets/images/chef-cooking.jpg"),
    initialLikes: 10,
    initialBookmarks: 20,
    initialShares: 30,
    initialReservations: 30,
  },
  {
    id: "post-2",
    author: {
      name: "Annette Birega",
      avatar: require("@/assets/images/currentUser.png"),
      timeAgo: "Il y a 12h",
    },
    hotMultiplier: "2x",
    hasFlame: true,
    type: "live",
    videoTitle: "Concert INNOCENT live ...",
    liveViewers: 30,
    image: require("@/assets/images/party.jpg"),
    initialLikes: 10,
    initialBookmarks: 15,
    initialShares: 22,
    initialReservations: 30,
  },
];

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  const handleStoryPress = (story: StoryItem) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    setActiveStoryId(story.id);
  };

  const handleHostInteraction = (post: FeedPostItem) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
    Alert.alert(
      "Interagir avec l'hôte",
      `Démarrer une conversation directe avec ${post.author.name} ?`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Envoyer un message", onPress: () => {} },
      ]
    );
  };

  const handleMorePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    Alert.alert("Options du fil", "Filtrer ou actualiser les publications", [
      { text: "Actualiser", onPress: () => {} },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  const handlePlayVideo = (post: FeedPostItem) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
    Alert.alert("Live en cours", `Vous rejoignez le ${post.videoTitle}`);
  };

  return (
    <ThemedView className="flex-1 bg-[#F9FBFA] dark:bg-[#121818]">
      {/* ── Top Header ── */}
      <View
        style={{ paddingTop: Math.max(insets.top, 32) }}
        className="px-2 pb-3 flex-row justify-between items-center"
      >
        <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg px-3 font-bold tracking-tight">
          Fil
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleMorePress}
          className="w-10 h-10 items-center justify-center rounded-full"
        >
          <Feather
            name="more-vertical"
            size={22}
            color={isDark ? "#F4F7F6" : "#121818"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* ── Horizontal Stories Row ── */}
        <View className="py-2 mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 18,
              gap: 14,
            }}
          >
            {STORIES.map((story) => {
              const isSelected = activeStoryId === story.id;
              return (
                <TouchableOpacity
                  key={story.id}
                  activeOpacity={0.8}
                  onPress={() => handleStoryPress(story)}
                  className="items-center relative"
                >
                  <View
                    className={`w-[62px] h-[62px] rounded-full p-[2px] items-center justify-center ${
                      isSelected
                        ? "border-2 border-primary_color"
                        : "border border-gray-200 dark:border-gray-700"
                    } bg-white dark:bg-[#182121]`}
                  >
                    <Image
                      source={story.image}
                      className="w-full h-full rounded-full"
                      resizeMode="cover"
                    />
                  </View>

                  {/* Story Badge */}
                  <View
                    style={styles.badge}
                    className="bg-white dark:bg-[#182121] border border-gray-100 dark:border-gray-800"
                  >
                    {story.hasFlame ? (
                      <Ionicons name="flame" size={12} color="#E02424" />
                    ) : story.badgeType === "food" ? (
                      <Ionicons name="fast-food" size={10} color="#007B7B" />
                    ) : (
                      <Ionicons name="wine" size={10} color="#007B7B" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Feed Posts List ── */}
        <View className="px-4">
          {FEED_POSTS.map((post) => (
            <FeedPostCard
              key={post.id}
              post={post}
              onHostInteraction={() => handleHostInteraction(post)}
              onPlayPress={() => handlePlayVideo(post)}
            />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
});
