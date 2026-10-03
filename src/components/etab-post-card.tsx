import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Share,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MapEstablishment } from "@/data/establishments";
import { BookmarkIcon, CalendarCheckIcon, InteractChatIcon, ShareIcon } from "./tab-icons";

export interface EtabPostCardProps {
  width?: number;
  etab?: MapEstablishment;
  postImage?: ImageSourcePropType;
  initialLikes?: number;
  initialBookmarks?: number;
  initialShares?: number;
  initialReservations?: number;
  description?: string;
  onInteractionPress?: () => void;
}

export default function EtabPostCard({
  width,
  etab,
  postImage = require("@/assets/images/party.jpg"),
  initialLikes = 10,
  initialBookmarks = 20,
  initialShares = 30,
  initialReservations = 30,
  description = "Nous organisons une tres grande fete, une de plus grande dans la ville de kinshasa, vous etes tous prié de reserver dès",
  onInteractionPress,
}: EtabPostCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [isLiked, setIsLiked] = useState(true);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(initialBookmarks);
  const [sharesCount, setSharesCount] = useState(initialShares);
  const [isReserved, setIsReserved] = useState(false);
  const [reservationsCount, setReservationsCount] = useState(initialReservations);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShare = async () => {
    setSharesCount((prev) => prev + 1);
    try {
      await Share.share({
        message: `Rejoignez-nous à la grande fête de ${
          etab?.name || "l'établissement"
        } !`,
      });
    } catch {
      // ignore
    }
  };

  return (
    <View style={width ? { width } : undefined}>
      <View
        className="bg-white dark:bg-[#182121] rounded-[32px] p-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 2,
        }}
      >
        {/* Post Image */}
        <Image
          source={postImage}
          resizeMode="cover"
          className="w-full h-[220px] rounded-[20px]"
        />

        {/* Actions / Metrics Row */}
        <View className="flex flex-row items-center justify-between mt-4 px-1">
          <View className="flex flex-row items-center gap-4">
            {/* Like */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsLiked(!isLiked);
                setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
              }}
              className="flex flex-row items-center gap-1.5"
            >
              <Ionicons
                name="heart"
                size={22}
                color={isLiked ? "#E02424" : isDark ? "#6B7280" : "#9CA3AF"}
              />
              <Text className="font-bold text-[15px] dark:text-whiteBg text-blackBg">
                {likesCount}
              </Text>
            </TouchableOpacity>

            {/* Bookmark */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsBookmarked(!isBookmarked);
                setBookmarksCount((prev) =>
                  isBookmarked ? prev - 1 : prev + 1
                );
              }}
              className="flex flex-row items-center gap-1.5"
            >
              <BookmarkIcon
                size={19}
                color={isBookmarked ? "#007B7B" : isDark ? "#F4F7F6" : "#121818"}
                filled={isBookmarked}
              />
              <Text className="font-bold text-[15px] dark:text-whiteBg text-blackBg">
                {bookmarksCount}
              </Text>
            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleShare}
              className="flex flex-row items-center gap-1.5"
            >
              <ShareIcon
                size={22}
                color={isDark ? "#F4F7F6" : "#121818"}
              />
              <Text className="font-bold text-[15px] dark:text-whiteBg text-blackBg">
                {sharesCount}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Checkmark / Reservations */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setIsReserved(!isReserved);
              setReservationsCount((prev) =>
                isReserved ? prev - 1 : prev + 1
              );
            }}
            className="flex flex-row items-center gap-1.5"
          >
            <CalendarCheckIcon size={22} color={isDark ? "#F4F7F6" : "#121818"}  />
            <Text className="font-bold text-[15px] dark:text-whiteBg text-blackBg">
              {reservationsCount}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View className="mt-4 px-1">
          <Text className="text-[14px] leading-5 text-[#374151] dark:text-[#D1D5DB]">
            {description}
            {!isExpanded ? (
              <Text
                onPress={() => setIsExpanded(true)}
                className="font-bold text-blackBg dark:text-whiteBg"
              >
                {" "}...plus
              </Text>
            ) : (
              <Text>
                {" "}maintenant pour garantir votre place. Ambiance festive,
                cocktails exclusifs et musique live au rendez-vous !
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

        {/* Interaction Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onInteractionPress}
          className="mt-4 flex-row items-center gap-3 px-4 py-3 rounded-full bg-[#EAECEF] dark:bg-[#202B2B]"
        >
          <InteractChatIcon
            size={18}
            color={isDark ? "#94A3B8" : "#4E5969"}
          />
          <Text className="text-[14px] text-[#4E5969] dark:text-[#94A3B8]">
            Interagir avec l’hôte
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
