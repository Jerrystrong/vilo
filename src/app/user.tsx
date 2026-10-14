 import SettingsIcon from "@/assets/svg/settingsIcon";
 import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { cssInterop } from "nativewind"; 
import { establishments } from "@/data/establishments";
import { useRef, useState, useCallback } from "react";
import {
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text, 
  TouchableOpacity, 
  useColorScheme,
  View,
} from "react-native"; 
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BookmarkIcon, HeartIcon } from "@/components/tab-icons";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import MapView, { Marker } from "react-native-maps";
import EtabPostCard from "@/components/etab-post-card";

cssInterop(LinearGradient, { className: "style" }); 

/* ─────────── Tab icons ─────────── */

function GalleryTabIcon({ color = "#9DA3AF", size = 26 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 3.5h10a2 2 0 0 1 2 2v9.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Rect
        x="3"
        y="6.5"
        width="14"
        height="14"
        rx="2"
        stroke={color}
        strokeWidth="1.8"
      />
      <Circle cx="7.5" cy="11" r="1.3" fill={color} />
      <Path
        d="M3.5 17.5l3.8-3.8a1.2 1.2 0 0 1 1.7 0l2 2a1.2 1.2 0 0 0 1.7 0l1.3-1.3a1.2 1.2 0 0 1 1.7 0l2 2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MapTabIcon({ color = "#9DA3AF", size = 26 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C6.55332 19.8124 4 14.6055 4 10.1433Z"
        stroke={color}
        strokeWidth="1.8"
      />
      <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

/* ─────────── Constants ─────────── */

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_CONTENT_WIDTH = SCREEN_WIDTH - 32; // px-4 = 16*2
const TABS = ["posts", "gallery"] as const;
type TabKey = (typeof TABS)[number];
const TAB_BAR_WIDTH = SCREEN_WIDTH - 32; // same as content area
const INDICATOR_WIDTH = 120;
const TAB_SLOT_WIDTH = TAB_BAR_WIDTH / TABS.length;
const user = {
  id: "1",
  name: "Annette MBELA",
  image: require("@/assets/images/currentUser.png"),
  location: "Kinshasa",
  coordinates: { latitude: -4.325, longitude: 15.3222 },
  description: "Chill girl, aime s'ambiancer", 
}

export default function UserScreen() {
  const colorScheme = useColorScheme(); 
  const isDark = colorScheme === "dark";
  const etab =establishments;
  const [activeTab, setActiveTab] = useState<TabKey>("posts");

  const pagerRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  /* ── Sync swipe → tab indicator ── */
  const handleSwipeEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const pageIndex = Math.round(
        e.nativeEvent.contentOffset.x / TAB_CONTENT_WIDTH
      );
      const clamped = Math.max(0, Math.min(pageIndex, TABS.length - 1));
      setActiveTab(TABS[clamped]);
    },
    []
  );

  /* ── Tap tab → scroll pager ── */
  const goToTab = useCallback((tab: TabKey) => {
    const idx = TABS.indexOf(tab);
    pagerRef.current?.scrollTo({ x: idx * TAB_CONTENT_WIDTH, animated: true });
    setActiveTab(tab);
  }, []);

  /* ── Helper: active / inactive color ── */
  const tabColor = (tab: TabKey) =>
    activeTab === tab ? (isDark ? "#FFFFFF" : "#121818") : "#9DA3AF";
  const indicatorBg = (tab: TabKey) =>
    activeTab === tab ? (isDark ? "#FFFFFF" : "#121818") : "transparent";

  /* ── Map coordinates ── */
  const coords = user?.coordinates ?? { latitude: -4.325, longitude: 15.3222 };

  return (
    <ThemedView
      className="flex-1 bg-whiteBg dark:bg-blackBg"
      style={styles.container}
    > 

      {/* header of page */}
      <View className="mt-[50px] mx-4 flex flex-row justify-between items-center">
       <View className="flex flex-row items-center justify-center ">
        <TouchableOpacity
              accessibilityLabel="Retour"
              onPress={() => router.back()}
            > 
            </TouchableOpacity>
        <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg">Profil</Text>
       </View>
        <View className="flex flex-row gap-2 items-center">
           <SettingsIcon
             width={24}
             height={24}
             color={colorScheme === "dark" ? "#FFFFFF" : "#292D32"}
           />
        </View>
      </View>
      {/* header end */} 
      <View className="flex-1">
        <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
           <View className="flex flex-row mt-[20px] items-center gap-4">
          <Image
            source={user?.image}
            resizeMode="cover"
            width={100}
            height={100}
            className="w-[100px] h-[100px] rounded-full"
          />
          <View>
            <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg">
              {user?.name} 
            </Text>
            <Text className="text-[#9DA3AF] text-[14px] ">{user?.description} </Text> 
              <View className="flex flex-row items-center gap-2 mt-1">
                <TouchableOpacity style={{backgroundColor:colorScheme === "dark" ? "#80BDBD70" : "#80BDBD"}} 
                  className="mt-2 px-3 w-fit rounded-full py-1">
                    <Text className=" text-[14px] mt-[-1] dark:text-whiteBg text-blackBg">Suit 80 sites</Text></TouchableOpacity>
         </View>
          </View>
        </View>

        {/* ═══════════ Tab Navigation (swipable + tappable) ═══════════ */}
        <View style={{ marginTop: 24 }}>
          <View className="flex flex-row items-center justify-around">
            {/* liked tab */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => goToTab("posts")}
              className="items-center"
              style={{ width: `${100 / TABS.length}%` }}
            >
              <HeartIcon size={26} color={tabColor("posts")} />
            </TouchableOpacity>

            {/* favorite tab */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => goToTab("gallery")}
              className="items-center"
              style={{ width: `${100 / TABS.length}%` }}
            >
              <BookmarkIcon size={26} color={tabColor("gallery")} />
            </TouchableOpacity> 
          </View>

          {/* Animated sliding underline */}
          <View style={{ height: 3.5, marginTop: 8 }}>
            <Animated.View
              style={{
                width: INDICATOR_WIDTH,
                height: 3.5,
                borderRadius: 2,
                backgroundColor: isDark ? "#FFFFFF" : "#121818",
                transform: [
                  {
                    translateX: scrollX.interpolate({
                      inputRange: [0, TAB_CONTENT_WIDTH],
                      outputRange: [
                        (TAB_SLOT_WIDTH - INDICATOR_WIDTH) / 2,
                        TAB_SLOT_WIDTH + (TAB_SLOT_WIDTH - INDICATOR_WIDTH) / 2,
                      ],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              }}
            />
          </View>
        </View>

        {/* ═══════════ Swipable tab content ═══════════ */}
        <Animated.ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleSwipeEnd}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          nestedScrollEnabled
          style={{ marginTop: 20, marginBottom: 40 }}
          contentContainerStyle={{ width: TAB_CONTENT_WIDTH * TABS.length }}
        >
          {/* ── Page 1: Posts favorite ── */}
          <EtabPostCard
            width={TAB_CONTENT_WIDTH}
            etab={etab[0]}
          />

          {/* ── Page 2: posts liked ── */} 
           <EtabPostCard
            width={TAB_CONTENT_WIDTH}
            etab={etab[1]}
          />
 
        </Animated.ScrollView>
        
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "visible",
  },
  pulse: {
    position: "absolute",
    width: 7,
    height: 7,
    backgroundColor: "#80BDBD",
    borderColor: "white",
    zIndex: 50,
    top: 0,
    right: 4,
    borderRadius: 50,
  },
  /* Map card */
  mapCard: {
    borderRadius: 32,
    borderWidth: 1,
    overflow: "hidden",
  },
  mapHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  mapHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  mapHeaderTitle: {
    fontWeight: 800,
    fontSize: 17,
  },
  mapHeaderSub: {
    fontFamily: "inter",
    fontSize: 13,
    color: "#9DA3AF",
    marginTop: 2,
  },
  mapWrapper: {
    height: 220,
    marginHorizontal: 12,
    borderRadius: 18,
    overflow: "hidden",
  },
  directionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#007B7B",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 18,
    paddingVertical: 12,
    borderRadius: 50,
  },
  directionBtnText: {
    color: "#FFFFFF",
    fontWeight: 900,
    fontSize: 15,
  },
});
