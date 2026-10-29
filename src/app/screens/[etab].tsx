import DotIcon from "@/assets/svg/dotIcon";
import EtabPostCard from "@/components/etab-post-card";
import { FireIcon } from "@/components/tab-icons";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { establishments } from "@/data/establishments";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { cssInterop } from "nativewind";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Easing, useSharedValue } from "react-native-reanimated";
import { Carousel } from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";

cssInterop(LinearGradient, { className: "style" });

/* ─────────── Tab icons ─────────── */

function GalleryTabIcon({
  color = "#9DA3AF",
  size = 26,
}: {
  color?: string;
  size?: number;
}) {
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

function MapTabIcon({
  color = "#9DA3AF",
  size = 26,
}: {
  color?: string;
  size?: number;
}) {
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
const TABS = ["posts", "gallery", "map"] as const;
type TabKey = (typeof TABS)[number];
const TAB_BAR_WIDTH = SCREEN_WIDTH - 32; // same as content area
const INDICATOR_WIDTH = 60;
const TAB_SLOT_WIDTH = TAB_BAR_WIDTH / 3;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.9, 360);

export default function EtabScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["45%", "75%"], []);
  const isDark = colorScheme === "dark";
  const { etab: etabParam, id: idParam } = useLocalSearchParams<{
    etab?: string;
    id?: string;
  }>();
  const currentId = etabParam || idParam;
  const etab = establishments.find((item) => item.id === currentId);

  const [activeTab, setActiveTab] = useState<TabKey>("posts");

  /* ── Options / Emergency Drawer State & Animations ── */
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [notifyNewPosts, setNotifyNewPosts] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);

  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openOptions = () => {
    setIsOptionsOpen(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeOptions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: DRAWER_WIDTH,
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOptionsOpen(false);
    });
  };

  const handleToggleNotify = (value: boolean) => {
    setNotifyNewPosts(value);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (value) {
      Alert.alert(
        "Notifications activées",
        `Vous recevrez une notification à chaque nouvelle publication de ${
          etab?.name || "cet établissement"
        }.`,
      );
    }
  };

  const handleUnsubscribe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Se désabonner",
      `Êtes-vous sûr de ne plus vouloir suivre ${
        etab?.name || "cet établissement"
      } ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se désabonner",
          style: "destructive",
          onPress: () => {
            setIsFollowing(false);
            closeOptions();
            Alert.alert(
              "Désabonné",
              `Vous ne suivez plus ${etab?.name || "cet établissement"}.`,
            );
          },
        },
      ],
    );
  };

  const handleReport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Signaler le compte",
      `Sélectionnez le motif pour signaler ${
        etab?.name || "cet établissement"
      } :`,
      [
        {
          text: "Contenu inapproprié ou illégal",
          onPress: () => {
            closeOptions();
            Alert.alert(
              "Signalement envoyé",
              "Merci pour votre signalement. Notre équipe va examiner ce compte.",
            );
          },
        },
        {
          text: "Arnaque ou fausses informations",
          onPress: () => {
            closeOptions();
            Alert.alert(
              "Signalement envoyé",
              "Merci pour votre signalement. Notre équipe va examiner ce compte.",
            );
          },
        },
        {
          text: "Harcèlement ou usurpation",
          onPress: () => {
            closeOptions();
            Alert.alert(
              "Signalement envoyé",
              "Merci pour votre signalement. Notre équipe va examiner ce compte.",
            );
          },
        },
        { text: "Annuler", style: "cancel" },
      ],
    );
  };

  const handleBlock = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Bloquer le compte",
      `Êtes-vous sûr de vouloir bloquer ${
        etab?.name || "cet établissement"
      } ? Vous ne verrez plus ses publications et son profil sera masqué.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Bloquer",
          style: "destructive",
          onPress: () => {
            closeOptions();
            Alert.alert(
              "Compte bloqué",
              `${etab?.name || "Cet établissement"} a été bloqué avec succès.`,
              [
                {
                  text: "Retour",
                  onPress: () => router.back(),
                },
              ],
            );
          },
        },
      ],
    );
  };

  const pagerRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  /* ── Sync swipe → tab indicator ── */
  const handleSwipeEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const pageIndex = Math.round(
        e.nativeEvent.contentOffset.x / TAB_CONTENT_WIDTH,
      );
      const clamped = Math.max(0, Math.min(pageIndex, TABS.length - 1));
      setActiveTab(TABS[clamped]);
    },
    [],
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
  const coords = etab?.coordinates ?? { latitude: -4.325, longitude: 15.3222 };
  // open bottom-sheet to see more about the etablissement
  const openAllEstablishments = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const activeDay = [
    { jour: "Lun", ouvrir: true },
    { jour: "Mar", ouvrir: true },
    { jour: "Mer", ouvrir: true },
    { jour: "Jeu", ouvrir: true },
    { jour: "Ven", ouvrir: true },
    { jour: "Sam", ouvrir: false },
    { jour: "Dim", ouvrir: false },
  ];
  const progress = useSharedValue<number>(0);
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
            <Feather
              name="chevron-left"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg">
            {etab?.name}
          </Text>
        </View>
        <View className="flex flex-row gap-2 items-center">
          <TouchableOpacity
            accessibilityLabel="Options d'urgence et du compte"
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={openOptions}
            className="p-2.5 rounded-full dark:bg-white/10 bg-black/5 active:scale-95"
          >
            <DotIcon
              style={{ width: 20, height: 20 }}
              width={20}
              height={20}
              fill={
                colorScheme === "dark"
                  ? Colors.light.background
                  : Colors.dark.background
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* header end */}
      <View className="flex-1">
        <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
          <View className="flex flex-row mt-[20px] items-center gap-4">
            <Image
              source={etab?.image}
              resizeMode="cover"
              width={100}
              height={100}
              className="w-[100px] h-[100px] rounded-full"
            />
            <View>
              <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg">
                {etab?.name}
              </Text>
              <Text className="text-[#9DA3AF] text-[14px]">
                {etab?.location} Gombe Righini n 109
              </Text>
              <View className="flex flex-row items-center gap-2 mt-1">
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      colorScheme === "dark" ? "#80BDBD70" : "#80BDBD",
                  }}
                  className="mt-2 px-3 w-fit rounded-full py-1"
                >
                  <Text className=" text-[14px] mt-[-1] dark:text-whiteBg text-blackBg">
                    10k abonnés
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openAllEstablishments}>
                  <Text className="text-primary_color text-[14px] py-1 pl-2">
                    Plus d'info
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ═══════════ Tab Navigation (swipable + tappable) ═══════════ */}
          <View style={{ marginTop: 24 }}>
            <View className="flex flex-row items-center justify-around">
              {/* Posts tab */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => goToTab("posts")}
                className="items-center"
                style={{ width: "33%" }}
              >
                <FireIcon size={26} color={tabColor("posts")} />
              </TouchableOpacity>

              {/* Gallery tab */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => goToTab("gallery")}
                className="items-center"
                style={{ width: "33%" }}
              >
                <GalleryTabIcon size={26} color={tabColor("gallery")} />
              </TouchableOpacity>

              {/* Map tab */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => goToTab("map")}
                className="items-center"
                style={{ width: "33%" }}
              >
                <MapTabIcon size={26} color={tabColor("map")} />
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
                        inputRange: [
                          0,
                          TAB_CONTENT_WIDTH,
                          TAB_CONTENT_WIDTH * 2,
                        ],
                        outputRange: [
                          (TAB_SLOT_WIDTH - INDICATOR_WIDTH) / 2,
                          TAB_SLOT_WIDTH +
                            (TAB_SLOT_WIDTH - INDICATOR_WIDTH) / 2,
                          TAB_SLOT_WIDTH * 2 +
                            (TAB_SLOT_WIDTH - INDICATOR_WIDTH) / 2,
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
              { useNativeDriver: true },
            )}
            scrollEventThrottle={16}
            nestedScrollEnabled
            style={{ marginTop: 20, marginBottom: 40 }}
            contentContainerStyle={{ width: TAB_CONTENT_WIDTH * 3 }}
          >
            {/* ── Page 1: Posts ── */}
            <EtabPostCard width={TAB_CONTENT_WIDTH} etab={etab} />

            {/* ── Page 2: Gallery ── */}
            <View style={{ width: TAB_CONTENT_WIDTH }}>
              <View className="flex flex-row flex-wrap justify-between gap-3 px-2">
                {(etab?.menu && etab.menu.length < 0
                  ? etab.menu
                  : [
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1_O8epLfXAOwRMBVY0tIZei1ZULSSFDCWERM99zyq3TvBCvSDU2RVHEs&s=10",
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0XFuhLuifOhj_h01FQapSn1Jrd6o83MT9mumrWZt92WA1OibPEZaVt4&s=10",
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdlMf7QBSv4bHI93O5vq8XuIqYxa9ntjpiUJWbFYnz603y1O90cfiYQtY&s=10",
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlMtBsEpWJM2bepnEjdEvDQVpuga42hkUkgP0VxCP9xx2AUfLjeQupcAs&s=10",
                    ]
                ).map((img, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.85}
                    className="w-[48%] h-[150px] rounded-2xl overflow-hidden bg-white dark:bg-[#182121]"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 8,
                      elevation: 2,
                    }}
                  >
                    <Image
                      source={typeof img === "string" ? { uri: img } : img}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ── Page 3: Map ── */}
            <View style={{ width: TAB_CONTENT_WIDTH }}>
              <View>
                {/* Map header */}
                <View style={styles.mapHeader}>
                  <View style={styles.mapHeaderLeft}>
                    <MapTabIcon size={20} color="#007B7B" />
                    <Text
                      style={[
                        styles.mapHeaderTitle,
                        { color: isDark ? "#F4F7F6" : "#121818" },
                      ]}
                    >
                      {etab?.name ?? "Localisation"}
                    </Text>
                  </View>
                  <Text style={styles.mapHeaderSub}>
                    {etab?.location ?? ""}
                  </Text>
                </View>

                {/* Map */}
                <View style={styles.mapWrapper}>
                  <MapView
                    initialRegion={{
                      ...coords,
                      latitudeDelta: 0.008,
                      longitudeDelta: 0.008,
                    }}
                    style={StyleSheet.absoluteFill}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                  >
                    <Marker
                      coordinate={coords}
                      title={etab?.name}
                      description={`${etab?.location ?? ""} Gombe Righini n 109`}
                      pinColor="#007B7B"
                    />
                  </MapView>
                </View>

                {/* Direction button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.directionBtn}
                >
                  <Ionicons name="navigate" size={16} color="#FFFFFF" />
                  <Text style={styles.directionBtnText}>Itinéraire</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.ScrollView>
        </ScrollView>
      </View>
      {/* see more details */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#121818" : "#FFFFFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          // borderColor: colorScheme === "dark" ? "#121818" : "#769E9B",
          // borderWidth: 2,
          overflow: "hidden",
        }}
        handleIndicatorStyle={{
          backgroundColor: colorScheme === "dark" ? "#769E9B" : "#A8C0C0",
        }}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Carousel Menu / Photos */}
          {etab?.menu && etab.menu.length > 0 ? (
            <View className="mb-3">
              <Carousel
                autoplayInterval={2000}
                data={etab.menu}
                loop={true}
                style={{
                  width: SCREEN_WIDTH,
                  height: 250,
                }}
                layout={{
                  type: "parallax",
                  scale: 0.9,
                  offset: 50,
                }}
                progress={progress}
                renderItem={({ item }) => (
                  <View className="w-full h-full px-2">
                    <Image
                      source={{ uri: item }}
                      className="w-full h-full rounded-2xl"
                      resizeMode="cover"
                    />
                  </View>
                )}
              />
            </View>
          ) : null}

          {/* Details Content */}
          <View style={styles.sheetHeader}>
            <Text
              style={[
                styles.sheetTitle,
                { color: colorScheme === "dark" ? "#F4F7F6" : "#121818" },
              ]}
            >
              A PROPOS
            </Text>

            <Text
              style={[
                styles.sheetSubtitle,
                {
                  paddingVertical: 8,
                  color: colorScheme === "dark" ? "#B7CCC9" : "#60646C",
                },
              ]}
            >
              {etab?.description ||
                "Le Musée National de la République démocratique du Congo, situé à Kinshasa, est un lieu emblématique dédié à la préservation et à la valorisation du patrimoine culturel congolais. À travers ses collections d’objets traditionnels, d’œuvres d’art et de témoignages historiques, il invite les visiteurs à découvrir la richesse des traditions, l’histoire et la diversité des peuples de la RDC. Une visite incontournable pour plonger au cœur de l’identité et de la culture congolaise."}
            </Text>

            <View className="mt-2">
              <Text
                style={[
                  { color: colorScheme === "dark" ? "#F4F7F6" : "#121818" },
                ]}
                className="font-bold text-[16px]"
              >
                Horaire d'ouverture
              </Text>
              <View className="mt-2">
                <View className="relative">
                  <View className="bg-gray-200/10 mt-2 rounded-xl px-3 flex flex-row gap-3 justify-between border border-gray-200/70 dark:border-white/10 w-full items-center py-4">
                    {activeDay.map((jour) => (
                      <View key={jour.jour} className="gap-2 items-center">
                        <Text
                          className={`text-[14px] font-medium ${
                            jour.ouvrir
                              ? colorScheme === "dark"
                                ? "text-whiteBg"
                                : "text-blackBg"
                              : "text-red-700/50"
                          }`}
                        >
                          {jour.jour}
                        </Text>
                        {jour.ouvrir ? (
                          <Feather
                            name="check-circle"
                            size={14}
                            color="#10B981"
                          />
                        ) : (
                          <Feather name="x-circle" size={14} color="#EF4444" />
                        )}
                      </View>
                    ))}
                  </View>
                </View>

                {/* Heures */}
                <View className="flex flex-row justify-between mt-5 gap-3">
                  {/* heure ouverture */}
                  <View className="flex items-center justify-center border rounded-[12px] border-gray-200 py-2 px-3 bg-gray-200/10">
                    <Text className="text-[16px] dark:text:whiteBg blackBg text-[12px]">
                      Heure d'ouverture
                    </Text>
                    <View className="flex flex-row items-center gap-1 mt-2">
                      <View className="border rounded-[12px] flex items-center justify-center border-gray-300 w-[42px] h-[32px]">
                        <Text className="font-bold">07</Text>
                      </View>
                      <Text className="font-bold text-[16px]">:</Text>
                      <View className="border rounded-[12px] flex items-center justify-center border-gray-300 w-[42px] h-[32px]">
                        <Text className="font-bold">30</Text>
                      </View>
                    </View>
                  </View>
                  {/* Heure de fermeture */}
                  <View className="flex items-center justify-center border rounded-[12px] border-gray-200 py-2 px-3 bg-gray-200/10">
                    <Text className="text-[16px] dark:text:whiteBg blackBg text-[12px]">
                      Heure de fermeture
                    </Text>
                    <View className="flex flex-row items-center gap-1 mt-2">
                      <View className="border rounded-[12px] flex items-center justify-center border-gray-300 w-[42px] h-[32px]">
                        <Text className="font-bold">19</Text>
                      </View>
                      <Text className="font-bold text-[16px]">:</Text>
                      <View className="border rounded-[12px] flex items-center justify-center border-gray-300 w-[42px] h-[32px]">
                        <Text className="font-bold">30</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* btn action */}
            <TouchableOpacity className="w-full items-center mt-5">
              <View className="bg-primary_color rounded-full p-2.5 px-5 w-full text-center h-[50px] flex justify-center items-center">
                <Text className="text-white font-bold">
                  Ecrire l'établissement
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
      {/* ═══════════ EMERGENCY & OPTIONS DRAWER (SLIDE RIGHT-TO-LEFT) ═══════════ */}
      <Modal
        visible={isOptionsOpen}
        transparent
        animationType="none"
        onRequestClose={closeOptions}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalRoot}
        >
          {/* Backdrop with fade animation */}
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={closeOptions} />
          </Animated.View>

          {/* Slide-in Drawer from right to left */}
          <Animated.View
            style={[
              styles.drawer,
              {
                width: DRAWER_WIDTH,
                backgroundColor: isDark ? "#141A1A" : "#FFFFFF",
                paddingTop: Math.max(insets.top, 24),
                paddingBottom: Math.max(insets.bottom, 20),
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {/* Drawer Header */}
            <View className="px-5 pb-4 border-b border-black/5 dark:border-white/10 flex-row justify-between items-center">
              <View className="flex-row items-center gap-2.5">
                <View>
                  <Text className="text-[21px] font-bold dark:text-white text-blackBg">
                    Options du compte
                  </Text>
                  <Text className="text-xs text-[#9DA3AF]">
                    Sécurité & Préférences
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={closeOptions}
                activeOpacity={0.7}
                className="w-8 h-8 rounded-full items-center justify-center bg-black/5 dark:bg-white/10"
              >
                <Feather
                  name="x"
                  size={18}
                  color={isDark ? "#FFFFFF" : "#121818"}
                />
              </TouchableOpacity>
            </View>

            {/* Drawer Body */}
            <ScrollView
              className="flex-1 px-5 pt-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              {/* Estab Preview Mini Card */}
              <View className="p-3.5 rounded-full bg-black/5 dark:bg-white/5 flex-row items-center gap-3 mb-5">
                <Image
                  source={etab?.image}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text
                    numberOfLines={1}
                    className="font-bold text-base dark:text-white text-blackBg"
                  >
                    {etab?.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-xs text-[#9DA3AF] mt-0.5"
                  >
                    {etab?.location || "Kinshasa"}
                  </Text>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-[#007B7B]/15">
                  <Text className="text-[11px] font-semibold text-[#007B7B]">
                    {isFollowing ? "Abonné" : "Non suivi"}
                  </Text>
                </View>
              </View>

              {/* ── SECTION 1: NOTIFICATIONS ── */}
              <View className="mb-5">
                <Text className="text-[11px] font-bold tracking-wider text-[#9DA3AF] uppercase mb-2.5">
                  Notifications
                </Text>

                <View className="p-3.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1 mr-2">
                      <View className="w-9 h-9 rounded-full items-center justify-center bg-primary_color/15">
                        <Feather name="bell" size={17} color="#007B7B" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold dark:text-white text-blackBg">
                          Nouvelles publications
                        </Text>
                        <Text className="text-[11px] text-[#9DA3AF]">
                          Alerte dès qu'un post est publié
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={notifyNewPosts}
                      onValueChange={handleToggleNotify}
                      trackColor={{ false: "#767577", true: "#007B7B" }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>

              {/* ── SECTION 2: ABONNEMENT ── */}
              <View className="mb-5">
                <Text className="text-[11px] font-bold tracking-wider text-[#9DA3AF] uppercase mb-2.5">
                  Abonnement
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleUnsubscribe}
                  className="p-3.5 rounded-full flex-row items-center justify-between bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 active:opacity-70"
                >
                  <View className="flex-row items-center gap-3 flex-1 mr-2">
                    <View className="w-9 h-9 rounded-xl items-center justify-center bg-gray-500/15">
                      <Feather
                        name={isFollowing ? "user-minus" : "user-plus"}
                        size={17}
                        color={isDark ? "#FFFFFF" : "#121818"}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold dark:text-white text-blackBg">
                        {isFollowing
                          ? "Se désabonner"
                          : "S'abonner à l'établissement"}
                      </Text>
                      <Text className="text-[11px] text-[#9DA3AF]">
                        {isFollowing
                          ? "Ne plus recevoir les actualités"
                          : "Suivre cet établissement"}
                      </Text>
                    </View>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={isDark ? "#9DA3AF" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>

              {/* ── SECTION 3: URGENCE & SÉCURITÉ ── */}
              <View className="mb-2">
                <Text className="text-[11px] font-bold tracking-wider text-[#9DA3AF] uppercase mb-2.5">
                  Urgence & Sécurité
                </Text>

                {/* SIGNALER LE COMPTE */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleReport}
                  className="mb-3 p-3.5 rounded-full flex-row items-center justify-between bg-amber-500/10 border border-amber-500/30 active:opacity-80"
                >
                  <View className="flex-row items-center gap-3 flex-1 mr-2">
                    <View className="w-9 h-9 rounded-full items-center justify-center bg-amber-500/20">
                      <Feather
                        name="alert-triangle"
                        size={17}
                        color="#D97706"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-amber-600 dark:text-amber-400">
                        Signaler le compte
                      </Text>
                      <Text className="text-[11px] text-[#9DA3AF]">
                        Contenu suspect, abusif ou arnaque
                      </Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={18} color="#D97706" />
                </TouchableOpacity>

                {/* BLOQUER LE COMPTE */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleBlock}
                  className="p-3.5 rounded-full flex-row items-center justify-between bg-red-500/10 border border-red-500/30 active:opacity-80"
                >
                  <View className="flex-row items-center gap-3 flex-1 mr-2">
                    <View className="w-9 h-9 rounded-full items-center justify-center bg-red-500/20">
                      <Feather name="slash" size={17} color="#EF4444" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-red-600 dark:text-red-400">
                        Bloquer le compte
                      </Text>
                      <Text className="text-[11px] text-[#9DA3AF]">
                        Masquer définitivement cet établissement
                      </Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "visible",
  },
  modalRoot: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  drawer: {
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255, 255, 255, 0.08)",
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
  sheetHeader: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  sheetTitle: {
    fontFamily: "inter-bold",
    fontSize: 20,
    lineHeight: 25,
  },
  sheetSubtitle: {
    fontFamily: "inter",
    fontSize: 16,
    marginTop: 4,
  },
  sheetList: {
    padding: 24,
    paddingTop: 18,
  },
  listSeparator: {
    height: 12,
  },
});
