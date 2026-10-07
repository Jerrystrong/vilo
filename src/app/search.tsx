import { FilterIcon } from "@/assets/svg/filterIcon";
import FeedPostCard, { FeedPostItem } from "@/components/feed-post-card";
import { ThemedView } from "@/components/themed-view";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SitesType {
  name: string;
  location: string;
  type: string;
  logo: ImageSourcePropType;
}

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const [filterTerm, setFilterTerm] = useState<string>("");
  const [filterTerms, setFilterTerms] = useState<string[]>([
    "Resto",
    "Bar",
    "Parcs",
    "Hôtel",
  ]);
  const sites: SitesType[] = [
    {
      name: "Centre culturel de Kinshasa",
      location: "Gombe, Kinshasa",
      type: "Culture",
      logo: require("@/assets/images/ccapac.png"),
    },
    {
      name: "Parc de la Vallée de la N'sele",
      location: "N'sele",
      type: "Nature & Eco",
      logo: require("@/assets/images/parcnsele.png"),
    },
    {
      name: "Musée National de la RDC",
      location: "Lingwala",
      type: "Histoire",
      logo: require("@/assets/images/musee.png"),
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
      ],
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
    <ThemedView className="flex-1 bg-whiteBg dark:bg-blackBg">
      {/* ── Top Header ── */}
      <View
        style={{ paddingTop: Math.max(insets.top, 32) }}
        className="px-2 pb-3 flex-row justify-between items-center"
      >
        <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg px-3 font-bold tracking-tight">
          Découvrir
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
      {/* search section */}
      <View className="px-3 mt-3 flex flex-row gap-3 w-[100%] ">
        {/* search bar */}
        <View className="flex items-center flex-row border rounded-full border-[#E5E7EB] dark:border-[#A9ABAE] dark:bg-[#2C3333] bg-[#ffffff] p-4 gap-3 w-[80%]">
          <Feather
            name="search"
            size={22}
            color={isDark ? "#E6F4F0" : "#9CA3AF"}
          />
          <TextInput
            placeholder="Rechercher"
            placeholderTextColor={isDark ? "#E6F4F0" : "#9CA3AF"}
            className="flex-1 dark:text-whiteBg text-[#9CA3AF]"
            keyboardType="default"
            value={filterTerm}
            onChangeText={setFilterTerm}
          />
        </View>
        {/* filter btn */}
        <View className="items-center justify-center rounded-full dark:bg-[#2C3333] border border-[#E5E7EB] dark:border-[#A9ABAE] bg-[#ffffff] w-[50px] h-[50px]">
          <FilterIcon color={isDark ? "#E6F4F0" : "#121818"} />
        </View>
      </View>
      {/* filter btn */}
      <View>
        {filterTerms.length > 0 && (
          <ScrollView
            horizontal
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              paddingHorizontal: 16,
              height: 50,
            }}
            showsHorizontalScrollIndicator={false}
          >
            {filterTerms.map((filter) => (
              <View className="w-fit flex-row items-center justify-center rounded-full dark:bg-[#2C3333] border border-[#E5E7EB] dark:border-[#2C3333] bg-[#ffffff] p-2">
                <TouchableOpacity
                  key={filter}
                  onPress={() => setFilterTerm(filter)}
                >
                  <Text className="text-[12px] dark:text-whiteBg text-blackBg px-2 tracking-tight">
                    {filter}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const index = filterTerms.indexOf(filter);
                    const newFilter = [...filterTerms];
                    newFilter.splice(index, 1);
                    setFilterTerms(newFilter);
                  }}
                >
                  <Feather name="x" size={14} color="rgba(204, 69, 0, 1)" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      {/* sites */}
      <View className="mx-3 mt-3 p-1">
        {/* list of sites */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 60,
          }}
        >
          <Text className="text-[#6B7280] dark:text-[#D1D5DB] font-bold text-[16px]">
            SITES
          </Text>
          <View className="flex gap-3 my-5">
            {sites.length > 0 &&
              sites.map((site) => (
                <View
                  key={site.name}
                  className="flex-row items-center rounded-full dark:bg-[#2C3333] border border-[#E5E7EB] dark:border-[#2C3333] bg-[#ffffff] p-3 gap-3"
                >
                  <Image
                    source={site.logo}
                    resizeMode="cover"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                  />
                  <View>
                    <Text className="text-[14px] dark:text-whiteBg text-blackBg px-2 font-bold">
                      {site.name}
                    </Text>
                    <View className="flex flex-row items-center mt-2">
                      <Text className="text-[14px] text-[#9CA3AF] px-2">
                        {site.location}
                      </Text>
                      <View className="w-1 h-1 rounded-full bg-[#9CA3AF]" />
                      <Text className="text-[14px] text-[#9CA3AF] px-2">
                        {site.type}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
          </View>
          {/* see more */}
          <Text className="text-[#6B7280] dark:text-[#D1D5DB] font-bold text-[16px]">
            PLUS DE SITES
          </Text>
          <ScrollView
            horizontal
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              paddingHorizontal: 16,
              height: 50,
              marginTop: 14,
            }}
          >
            <View className="bg-[#ffffff] dark:bg-[#2C3333] w-[50px] h-[50px] rounded-full border border-[#E5E7EB] dark:border-[#2C3333] flex-row items-center justify-center">
              <FontAwesome6
                name="plus"
                size={14}
                color={isDark ? "#E6F4F0" : "#121818"}
              />
            </View>
            <View className="bg-[#ffffff] dark:bg-[#2C3333] w-[50px] h-[50px] rounded-full"></View>
            <View className="bg-[#ffffff] dark:bg-[#2C3333] w-[50px] h-[50px] rounded-full"></View>
            <View className="bg-[#ffffff] dark:bg-[#2C3333] w-[50px] h-[50px] rounded-full"></View>
          </ScrollView>
          {/* ========== */}
          {/* evenement */}
          <View className="flex flex-row items-center justify-between my-3">
            <Text className="text-[#6B7280] dark:text-[#D1D5DB] font-bold text-[16px]">
              EVENEMENTS
            </Text>
            <Pressable>
              <Text className="text-blue-500 dark:text-blue-200 text-[12px]">
                VOIR TOUT
              </Text>
            </Pressable>
          </View>
          {/* ── Feed Posts List ── */}
          <View className="">
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
      </View>
    </ThemedView>
  );
}
