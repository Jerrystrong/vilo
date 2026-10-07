import { FilterIcon } from "@/assets/svg/filterIcon";
import FeedPostCard, { FeedPostItem } from "@/components/feed-post-card";
import { ThemedView } from "@/components/themed-view";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  ImageSourcePropType,
  Keyboard,
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

// All suggestions pool
const ALL_SUGGESTIONS = [
  "Centre culturel de Kinshasa",
  "Parc de la Vallée de la N'sele",
  "Musée National de la RDC",
  "Restaurant La Saveur",
  "Bar Le Tropique",
  "Hôtel des Diplomates",
  "Café Congo",
  "Espace Beauté Spa",
  "Club 243",
  "La Terrasse Gombe",
];

const FILTER_OPTIONS = [
  { label: "Restaurant", icon: "🍽️" },
  { label: "Bar", icon: "🍹" },
  { label: "Hôtel", icon: "🏨" },
  { label: "Parc", icon: "🌿" },
  { label: "Culture", icon: "🎭" },
  { label: "Autre", icon: "📍" },
];

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";

  const [filterTerm, setFilterTerm] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterTerms, setFilterTerms] = useState<string[]>([
    "Resto",
    "Bar",
    "Parcs",
    "Hôtel",
  ]);

  const suggestionsAnim = useRef(new Animated.Value(0)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

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

  // ── Suggestions logic ────────────────────────────────────────────
  useEffect(() => {
    if (filterTerm.trim().length > 0) {
      const filtered = ALL_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(filterTerm.toLowerCase()),
      );
      setSuggestions(filtered);
      Animated.spring(suggestionsAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else {
      Animated.timing(suggestionsAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setSuggestions([]));
    }
  }, [filterTerm]);

  // ── Filter popup toggle ──────────────────────────────────────────
  const toggleFilterPopup = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    if (showFilterPopup) {
      Animated.timing(filterAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => setShowFilterPopup(false));
    } else {
      setShowFilterPopup(true);
      Animated.spring(filterAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 12,
      }).start();
    }
  };

  const selectFilter = (label: string) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setActiveFilter(activeFilter === label ? null : label);
    Animated.timing(filterAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setShowFilterPopup(false));
  };

  const clearSearch = () => {
    setFilterTerm("");
    inputRef.current?.blur();
    setIsFocused(false);
  };

  const dismissAll = () => {
    Keyboard.dismiss();
    setIsFocused(false);
    if (showFilterPopup) {
      Animated.timing(filterAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => setShowFilterPopup(false));
    }
  };

  const handleHostInteraction = (post: FeedPostItem) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
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
    } catch {}
    Alert.alert("Options du fil", "Filtrer ou actualiser les publications", [
      { text: "Actualiser", onPress: () => {} },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  const handlePlayVideo = (post: FeedPostItem) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    Alert.alert("Live en cours", `Vous rejoignez le ${post.videoTitle}`);
  };

  // Filtered sites
  const filteredSites = sites
    .filter(
      (s) =>
        !activeFilter ||
        s.type.toLowerCase().includes(activeFilter.toLowerCase()) ||
        s.name.toLowerCase().includes(activeFilter.toLowerCase()),
    )
    .filter(
      (s) =>
        !filterTerm ||
        s.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
        s.location.toLowerCase().includes(filterTerm.toLowerCase()),
    );

  return (
    <ThemedView className="flex-1 bg-whiteBg dark:bg-blackBg">
      {/* ── Top Header ── */}
      <View
        style={{ paddingTop: Math.max(insets.top, 32) }}
        className="px-2 pb-3 flex-row justify-between items-center"
      >
        <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg px-3 tracking-tight">
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

      {/* ── Search + Filter row ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 12,
          marginTop: 4,
        }}
      >
        {/* Search bar */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 999,
            borderWidth: 1.5,
            borderColor: isFocused
              ? isDark
                ? "#5DADE2"
                : "#3B82F6"
              : isDark
                ? "#3A3F3F"
                : "#E5E7EB",
            backgroundColor: isDark ? "#2C3333" : "#ffffff",
            paddingHorizontal: 16,
            paddingVertical: 11,
            gap: 10,
          }}
        >
          <Feather
            name="search"
            size={20}
            color={
              isFocused
                ? isDark
                  ? "#5DADE2"
                  : "#3B82F6"
                : isDark
                  ? "#8A9BA8"
                  : "#9CA3AF"
            }
          />
          <TextInput
            ref={inputRef}
            placeholder="Rechercher un lieu, événement…"
            placeholderTextColor={isDark ? "#6B7E8A" : "#9CA3AF"}
            style={{
              flex: 1,
              color: isDark ? "#F4F7F6" : "#121818",
              fontSize: 15,
            }}
            keyboardType="default"
            returnKeyType="search"
            value={filterTerm}
            onChangeText={setFilterTerm}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          />
          {filterTerm.length > 0 && (
            <TouchableOpacity onPress={clearSearch} activeOpacity={0.7}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: isDark ? "#4A5568" : "#E5E7EB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather
                  name="x"
                  size={12}
                  color={isDark ? "#CBD5E0" : "#6B7280"}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter button */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={toggleFilterPopup}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: showFilterPopup
              ? "#3B82F6"
              : isDark
                ? "#2C3333"
                : "#ffffff",
            borderWidth: 1.5,
            borderColor: showFilterPopup
              ? "#3B82F6"
              : isDark
                ? "#3A3F3F"
                : "#E5E7EB",
          }}
        >
          <FilterIcon
            color={showFilterPopup ? "#ffffff" : isDark ? "#E6F4F0" : "#121818"}
          />
        </TouchableOpacity>
      </View>

      {/* ── Active filter badge ── */}
      {activeFilter && (
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <View
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "#1E3A5F" : "#EFF6FF",
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 5,
              gap: 6,
            }}
          >
            <Text
              style={{ color: isDark ? "#93C5FD" : "#2563EB", fontSize: 13 }}
            >
              {FILTER_OPTIONS.find((f) => f.label === activeFilter)?.icon}{" "}
              {activeFilter}
            </Text>
            <TouchableOpacity onPress={() => setActiveFilter(null)}>
              <Feather
                name="x"
                size={13}
                color={isDark ? "#93C5FD" : "#2563EB"}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Default chips — visible quand idle (rien tapé, pas de filtre ouvert) ── */}
      {!isFocused &&
        !showFilterPopup &&
        !activeFilter &&
        filterTerm === "" &&
        filterTerms.length > 0 && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 14,
                height: 46,
              }}
            >
              {filterTerms.map((chip) => (
                <View
                  key={chip}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 999,
                    backgroundColor: isDark ? "#2C3333" : "#ffffff",
                    borderWidth: 1,
                    borderColor: isDark ? "#3A3F3F" : "#E5E7EB",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    gap: 6,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setFilterTerm(chip)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: isDark ? "#D1D5DB" : "#374151",
                        fontWeight: "500",
                      }}
                    >
                      {chip}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const idx = filterTerms.indexOf(chip);
                      const next = [...filterTerms];
                      next.splice(idx, 1);
                      setFilterTerms(next);
                    }}
                    activeOpacity={0.7}
                  >
                    <Feather name="x" size={13} color="rgba(204, 69, 0, 1)" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

      {/* ══ FILTER POPUP — inline below search row ══ */}
      {showFilterPopup && (
        <Animated.View
          style={{
            opacity: filterAnim,
            transform: [
              {
                translateY: filterAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-8, 0],
                }),
              },
              {
                scaleY: filterAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.92, 1],
                }),
              },
            ],
            marginHorizontal: 12,
            marginTop: 8,
            borderRadius: 20,
            backgroundColor: isDark ? "#1E2626" : "#ffffff",
            borderWidth: 1,
            borderColor: isDark ? "#2E3737" : "#E5E7EB",
            elevation: 8,
            padding: 14,
            zIndex: 100,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1.2,
              color: isDark ? "#6B7E8A" : "#9CA3AF",
              marginBottom: 10,
              marginLeft: 2,
            }}
          >
            FILTRER PAR CATÉGORIE
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 14,
            }}
          >
            {FILTER_OPTIONS.map((option) => {
              const isActive = activeFilter === option.label;
              return (
                <TouchableOpacity
                  key={option.label}
                  activeOpacity={0.75}
                  onPress={() => selectFilter(option.label)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: isActive
                      ? "#3B82F6"
                      : isDark
                        ? "#2C3333"
                        : "#F3F4F6",
                  }}
                >
                  {/* <Text style={{ fontSize: 14 }}>{option.icon}</Text> */}
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: isActive
                        ? "#ffffff"
                        : isDark
                          ? "#D1D5DB"
                          : "#374151",
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      )}

      {/* ══ SUGGESTIONS DROPDOWN ══ */}
      {suggestions.length > 0 && isFocused && (
        <Animated.View
          style={{
            opacity: suggestionsAnim,
            transform: [
              {
                translateY: suggestionsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-6, 0],
                }),
              },
            ],
            marginHorizontal: 12,
            marginTop: 6,
            borderRadius: 20,
            backgroundColor: isDark ? "#1E2626" : "#ffffff",
            borderWidth: 1,
            borderColor: isDark ? "#2E3737" : "#E5E7EB",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.45 : 0.14,
            shadowRadius: 20,
            elevation: 10,
            zIndex: 200,
            overflow: "hidden",
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 260 }}
          >
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={suggestion}
                activeOpacity={0.7}
                onPress={() => {
                  setFilterTerm(suggestion);
                  setIsFocused(false);
                  Keyboard.dismiss();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 13,
                  borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
                  borderBottomColor: isDark ? "#263030" : "#F3F4F6",
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isDark ? "#2C3A3A" : "#EFF6FF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather
                    name="map-pin"
                    size={14}
                    color={isDark ? "#5DADE2" : "#3B82F6"}
                  />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: "600",
                    color: isDark ? "#F4F7F6" : "#111827",
                  }}
                  numberOfLines={1}
                >
                  {suggestion}
                </Text>
                <Feather
                  name="arrow-up-left"
                  size={14}
                  color={isDark ? "#4A5568" : "#D1D5DB"}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* ── Main content ── */}
      <View style={{ flex: 1 }}>
        <View className="mx-3 mt-3 p-1 flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
          >
            <Text className="text-[#6B7280] dark:text-[#D1D5DB] font-bold text-[16px]">
              SITES
            </Text>
            <View className="flex gap-3 my-5">
              {filteredSites.map((site) => (
                <View
                  key={site.name}
                  className="flex-row items-center rounded-full dark:bg-[#2C3333] border border-[#E5E7EB] dark:border-[#2C3333] bg-[#ffffff] p-3 gap-3"
                >
                  <Image
                    source={site.logo}
                    resizeMode="cover"
                    style={{ width: 50, height: 50, borderRadius: 50 }}
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
              {filteredSites.length === 0 && (
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 24,
                    gap: 8,
                  }}
                >
                  <Feather
                    name="search"
                    size={32}
                    color={isDark ? "#3A4A4A" : "#D1D5DB"}
                  />
                  <Text
                    style={{
                      color: isDark ? "#4B5563" : "#9CA3AF",
                      fontSize: 14,
                    }}
                  >
                    Aucun résultat trouvé
                  </Text>
                </View>
              )}
            </View>

            <Text className="text-[#6B7280] dark:text-[#D1D5DB] font-bold text-[16px]">
              PLUS DE SITES
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 4,
                height: 60,
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
              <View className="bg-[#ffffff] dark:bg-[#2C3333] w-[50px] h-[50px] rounded-full" />
              <View className="bg-[#ffffff] dark:bg-[#2C3333] w-[50px] h-[50px] rounded-full" />
              <View className="bg-[#ffffff] dark:bg-[#2C3333] w-[50px] h-[50px] rounded-full" />
            </ScrollView>

            <View className="flex flex-row items-center justify-between my-3">
              <Text className="text-[#6B7280] dark:text-[#D1D5DB] font-bold text-[16px]">
                EVENEMENTS
              </Text>
              <Pressable onPress={() => router.push("/feed")}>
                <Text className="text-blue-500 dark:text-blue-200 text-[12px]">
                  VOIR TOUT
                </Text>
              </Pressable>
            </View>

            <View>
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
      </View>
    </ThemedView>
  );
}
