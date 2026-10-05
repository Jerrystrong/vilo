import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Share,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import {
  BookmarkIcon,
  InteractChatIcon,
  ShareIcon,
} from "./tab-icons";

export interface FeedPostItem {
  id: string;
  author: {
    name: string;
    avatar: ImageSourcePropType;
    timeAgo: string;
  };
  hotMultiplier?: string; // e.g. "2x"
  hasFlame?: boolean;
  type: "standard" | "live" | "video";
  text?: string;
  image: ImageSourcePropType;
  videoTitle?: string;
  liveViewers?: number;
  initialLikes?: number;
  initialBookmarks?: number;
  initialShares?: number;
  initialReservations?: number;
}

interface FeedPostCardProps {
  post: FeedPostItem;
  onHostInteraction?: () => void;
  onPlayPress?: () => void;
}

export default function FeedPostCard({
  post,
  onHostInteraction,
  onPlayPress,
}: FeedPostCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.initialLikes ?? 10);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(post.initialBookmarks ?? 20);
  const [sharesCount, setSharesCount] = useState(post.initialShares ?? 30);
  const [isReserved, setIsReserved] = useState(false);
  const [reservationsCount, setReservationsCount] = useState(post.initialReservations ?? 30);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    setIsBookmarked((prev) => !prev);
    setBookmarksCount((prev) => (isBookmarked ? prev - 1 : prev + 1));
  };

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSharesCount((prev) => prev + 1);
      await Share.share({
        message: `${post.author.name} sur Vilo: ${post.text || post.videoTitle || "Découvrez cette publication !"}`,
      });
    } catch {
      // ignore
    }
  };

  const handleReservation = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    setIsReserved((prev) => !prev);
    setReservationsCount((prev) => (isReserved ? prev - 1 : prev + 1));
  };

  return (
    <View className="mb-6">
      {/* ── Author Header ── */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <View className="flex-row items-center gap-3">
          <Image
            source={post.author.avatar}
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
          />
          <View>
            <Text className="font-bold text-[15px] dark:text-whiteBg text-[#121818]">
              {post.author.name}
            </Text>
            <Text className="text-[12px] text-[#9DA3AF]">
              {post.author.timeAgo}
            </Text>
          </View>
        </View>

        {/* Right Badge: 2x 🔥 */}
        <View className="flex-row items-center">
          {post.hotMultiplier ? (
            <Text className="text-[13px] font-semibold text-[#6B7280] dark:text-[#9CA3AF] mr-1">
              {post.hotMultiplier}
            </Text>
          ) : null}
          {post.hasFlame ? (
            <Ionicons name="flame" size={17} color="#E02424" />
          ) : null}
        </View>
      </View>

      {/* ── Content ── */}
      {post.type === "standard" ? (
        <>
          {/* Post Text */}
          {post.text ? (
            <View className="mb-3 px-1">
              <Text className="text-[14px] leading-5 text-[#374151] dark:text-[#D1D5DB]">
                {post.text}
                {!isExpanded ? (
                  <Text
                    onPress={() => setIsExpanded(true)}
                    className="font-bold text-blackBg dark:text-whiteBg"
                  >
                    {" "}...plus
                  </Text>
                ) : (
                  <Text>
                    {" "}pour garantir votre place. Ambiance festive, cocktails
                    exclusifs et musique live au rendez-vous !
                    <Text
                      onPress={() => setIsExpanded(false)}
                      className="font-bold text-primary_color"
                    >
                      {" "}...moins
                    </Text>
                  </Text>
                )}
              </Text>
            </View>
          ) : null}

          {/* Post Image */}
          <View className="w-full h-[230px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#182121]">
            <Image
              source={post.image}
              resizeMode="cover"
              className="w-full h-full"
            />
          </View>

          {/* Engagement Metrics */}
          <View className="flex-row items-center justify-between mt-3 px-1">
            <View className="flex-row items-center gap-4">
              {/* Like */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLike}
                className="flex-row items-center gap-1.5"
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={21}
                  color={isLiked ? "#E02424" : isDark ? "#9CA3AF" : "#4B5563"}
                />
                <Text className="font-bold text-[14px] dark:text-whiteBg text-[#121818]">
                  {likesCount}
                </Text>
              </TouchableOpacity>

              {/* Bookmark */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleBookmark}
                className="flex-row items-center gap-1.5"
              >
                <BookmarkIcon
                  size={19}
                  color={isBookmarked ? "#007B7B" : isDark ? "#F4F7F6" : "#121818"}
                  filled={isBookmarked}
                />
                <Text className="font-bold text-[14px] dark:text-whiteBg text-[#121818]">
                  {bookmarksCount}
                </Text>
              </TouchableOpacity>

              {/* Share */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleShare}
                className="flex-row items-center gap-1.5"
              >
                <ShareIcon
                  size={20}
                  color={isDark ? "#F4F7F6" : "#121818"}
                />
                <Text className="font-bold text-[14px] dark:text-whiteBg text-[#121818]">
                  {sharesCount}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Repeat / Reservations */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleReservation}
              className="flex-row items-center gap-1.5"
            >
              <Ionicons
                name="repeat"
                size={22}
                color={isReserved ? "#007B7B" : isDark ? "#F4F7F6" : "#121818"}
              />
              <Text className="font-bold text-[14px] dark:text-whiteBg text-[#121818]">
                {reservationsCount}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        /* ── Live / Video Post ── */
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={onPlayPress}
          className="relative w-full h-[290px] rounded-2xl overflow-hidden bg-black shadow-md"
        >
          {/* Media background image */}
          <Image
            source={post.image}
            resizeMode="cover"
            className="w-full h-full"
          />

          {/* Top-left: Live badge */}
          {post.liveViewers ? (
            <View className="absolute top-3 left-3 bg-black/60 px-2.5 py-1 rounded-full flex-row items-center gap-1.5 backdrop-blur-md">
              <Ionicons name="radio" size={13} color="#FFFFFF" />
              <Text className="text-white text-[12px] font-bold">
                {post.liveViewers}
              </Text>
            </View>
          ) : null}

          {/* Center Play Button */}
          <View className="absolute inset-0 items-center justify-center">
            <View className="w-14 h-14 rounded-full bg-white/40 backdrop-blur-sm items-center justify-center">
              <Ionicons
                name="play"
                size={26}
                color="#FFFFFF"
                style={{ marginLeft: 3 }}
              />
            </View>
          </View>

          {/* Bottom Overlay Gradient */}
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.85)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingHorizontal: 14,
              paddingBottom: 14,
              paddingTop: 36,
            }}
          >
            {post.videoTitle ? (
              <Text className="text-white font-bold text-[15px] mb-2.5">
                {post.videoTitle}
              </Text>
            ) : null}

            {/* Video Post Metrics */}
            <View className="flex-row items-center gap-5">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLike}
                className="flex-row items-center gap-1.5"
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart"}
                  size={19}
                  color={isLiked ? "#E02424" : "#E02424"}
                />
                <Text className="text-white font-bold text-[13px]">
                  {likesCount}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleReservation}
                className="flex-row items-center gap-1.5"
              >
                <Ionicons name="repeat" size={19} color="#FFFFFF" />
                <Text className="text-white font-bold text-[13px]">
                  {reservationsCount}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* ── Host Interaction Pill Bar ── */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onHostInteraction}
        className="mt-3.5 flex-row items-center gap-3 px-4 py-3 rounded-full bg-[#EAECEF] dark:bg-[#1E2727]"
      >
        <InteractChatIcon
          size={18}
          color={isDark ? "#94A3B8" : "#4E5969"}
        />
        <Text className="text-[14px] text-[#4E5969] dark:text-[#94A3B8] font-medium">
          Interagir avec l’hôte
        </Text>
      </TouchableOpacity>
    </View>
  );
}
