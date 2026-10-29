import SettingsIcon from "@/assets/svg/settingsIcon";
import EtabPostCard from "@/components/etab-post-card";
import { BookmarkIcon, HeartIcon } from "@/components/tab-icons";
import { ThemedView } from "@/components/themed-view";
import { establishments } from "@/data/establishments";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { cssInterop } from "nativewind";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
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
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";
<<<<<<< HEAD
=======
import MapView, { Marker } from "react-native-maps";
import EtabPostCard from "@/components/etab-post-card";
import TopBar from "@/components/topbar/topbar";
>>>>>>> 1bb734d9e9bda90c2b387d470fbde36de99b5de7

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
const TABS = ["posts", "gallery"] as const;
type TabKey = (typeof TABS)[number];
const TAB_BAR_WIDTH = SCREEN_WIDTH - 32;
const INDICATOR_WIDTH = 120;
const TAB_SLOT_WIDTH = TAB_BAR_WIDTH / TABS.length;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.95, 380);

const INITIAL_USER = {
  id: "1",
  name: "Annette MBELA",
  image: require("@/assets/images/currentUser.png"),
  location: "Kinshasa, Gombe",
  coordinates: { latitude: -4.325, longitude: 15.3222 },
  description: "Chill girl, aime s'ambiancer",
  email: "annette.mbela@gmail.com",
  phoneNumbers: ["+243 820 000 000"],
  sitesFollowed: 80,
};

export default function UserScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const etab = establishments;
  const [activeTab, setActiveTab] = useState<TabKey>("posts");

  /* ── User Profile State ── */
  const [user, setUser] = useState(INITIAL_USER);
  const [editName, setEditName] = useState(INITIAL_USER.name);
  const [editDescription, setEditDescription] = useState(
    INITIAL_USER.description,
  );
  const [editLocation, setEditLocation] = useState(INITIAL_USER.location);
  const [editEmail, setEditEmail] = useState(INITIAL_USER.email);
  const [newPhone, setNewPhone] = useState("");
  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const [phoneSuccess, setPhoneSuccess] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

  /* ── Slide-in Settings Drawer State & Animations ── */
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openSettings = () => {
    setEditName(user.name);
    setEditDescription(user.description);
    setEditLocation(user.location);
    setEditEmail(user.email);
    setNewPhone("");
    setIsAddingPhone(false);
    setPhoneSuccess(null);
    setSaveSuccess(false);
    setIsSettingsOpen(true);
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

  const closeSettings = () => {
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
      setIsSettingsOpen(false);
    });
  };

  const handleSaveProfile = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUser((prev) => ({
      ...prev,
      name: editName.trim() || prev.name,
      description: editDescription.trim() || prev.description,
      location: editLocation.trim() || prev.location,
      email: editEmail.trim() || prev.email,
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddPhoneNumber = () => {
    const trimmed = newPhone.trim();
    if (!trimmed) {
      Alert.alert(
        "Numéro invalide",
        "Veuillez entrer un numéro de téléphone valide.",
      );
      return;
    }
    if (user.phoneNumbers.includes(trimmed)) {
      Alert.alert(
        "Numéro déjà existant",
        "Ce numéro de téléphone est déjà associé à votre compte.",
      );
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUser((prev) => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, trimmed],
    }));
    setNewPhone("");
    setIsAddingPhone(false);
    setPhoneSuccess(`Numéro ${trimmed} ajouté avec succès !`);
    setTimeout(() => setPhoneSuccess(null), 3000);
  };

  const handleRemovePhoneNumber = (numToRemove: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Supprimer le numéro",
      `Voulez-vous retirer le numéro ${numToRemove} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            setUser((prev) => ({
              ...prev,
              phoneNumbers: prev.phoneNumbers.filter((n) => n !== numToRemove),
            }));
          },
        },
      ],
    );
  };

  const handleBlockAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Bloquer le compte",
      "Êtes-vous sûr de vouloir bloquer temporairement votre compte ? Vos publications et votre profil ne seront plus visibles aux autres utilisateurs.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Bloquer",
          style: "destructive",
          onPress: () => {
            closeSettings();
            Alert.alert(
              "Compte bloqué",
              "Votre compte a été bloqué avec succès. Vous pouvez le réactiver à tout moment en vous reconnectant.",
            );
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Se déconnecter",
      "Êtes-vous sûr de vouloir vous déconnecter de votre compte ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se déconnecter",
          style: "destructive",
          onPress: () => {
            closeSettings();
            router.replace("/");
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

  return (
    <ThemedView
      className="flex-1 bg-whiteBg dark:bg-blackBg"
      style={styles.container}
<<<<<<< HEAD
    >
      {/* Header of page */}
      <View className="mt-[50px] mx-4 flex flex-row justify-between items-center">
        <View className="flex flex-row items-center justify-center">
          <TouchableOpacity
            accessibilityLabel="Retour"
            onPress={() => router.back()}
            className="mr-2 p-1 rounded-full active:opacity-70"
          >
            <Feather
              name="chevron-left"
              size={26}
              color={isDark ? "#FFFFFF" : "#121818"}
            />
          </TouchableOpacity>
          <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg">
            Profil
          </Text>
        </View>

        {/* Settings button that opens the drawer */}
        <View className="flex flex-row gap-2 items-center">
          <TouchableOpacity
            accessibilityLabel="Paramètres du compte"
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={openSettings}
            className="p-2.5 rounded-full dark:bg-white/10 bg-black/5 active:scale-95 transition-transform"
          >
            <SettingsIcon
              width={22}
              height={22}
              color={colorScheme === "dark" ? "#FFFFFF" : "#292D32"}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Header end */}

=======
    > 

      {/* header of page */}
      <TopBar 
      title={"Profil"}
      handleMorePress={() => router.push("/")}
      iconName="settings"
      iconSize={24} 
      /> 
      {/* header end */} 
>>>>>>> 1bb734d9e9bda90c2b387d470fbde36de99b5de7
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
            <View className="flex-1">
              <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg">
                {user?.name}
              </Text>
              <Text className="text-[#9DA3AF] text-[14px]">
                {user?.description}
              </Text>
              {user?.location ? (
                <View className="flex flex-row items-center gap-1 mt-1">
                  <Feather name="map-pin" size={12} color="#9DA3AF" />
                  <Text className="text-[#9DA3AF] text-[12px]">
                    {user?.location}
                  </Text>
                </View>
              ) : null}
              <View className="flex flex-row items-center gap-2 mt-1">
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      colorScheme === "dark" ? "#80BDBD70" : "#80BDBD",
                  }}
                  className="mt-2 px-3 w-fit rounded-full py-1"
                >
                  <Text className="text-[14px] mt-[-1] dark:text-whiteBg text-blackBg">
                    Suit {user?.sitesFollowed ?? 80} sites
                  </Text>
                </TouchableOpacity>
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
                          TAB_SLOT_WIDTH +
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
            contentContainerStyle={{ width: TAB_CONTENT_WIDTH * TABS.length }}
          >
            {/* ── Page 1: Posts favorite ── */}
            <EtabPostCard width={TAB_CONTENT_WIDTH} etab={etab[0]} />

            {/* ── Page 2: posts liked ── */}
            <EtabPostCard width={TAB_CONTENT_WIDTH} etab={etab[1]} />
          </Animated.ScrollView>
        </ScrollView>
      </View>

      {/* ═══════════ MODERN RIGHT-TO-LEFT SETTINGS DRAWER ═══════════ */}
      <Modal
        visible={isSettingsOpen}
        transparent
        animationType="none"
        onRequestClose={closeSettings}
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
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeSettings}
            />
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
                    Paramètres
                  </Text>
                  <Text className="text-xs text-[#9DA3AF]">
                    Compte & Préférences
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={closeSettings}
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

            {/* Drawer Content */}
            <ScrollView
              className="flex-1 px-5 pt-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              {/* User badge preview */}
              <View className="p-3.5 rounded-full bg-black/5 dark:bg-white/5 flex-row items-center gap-3 mb-5">
                <Image
                  source={user.image}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text
                    numberOfLines={1}
                    className="font-bold text-base dark:text-white text-blackBg"
                  >
                    {user.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-xs text-[#9DA3AF] mt-0.5"
                  >
                    {user.email}
                  </Text>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-[#007B7B]/15">
                  <Text className="text-[11px] font-semibold text-[#007B7B]">
                    Actif
                  </Text>
                </View>
              </View>

              {/* Success Notification */}
              {saveSuccess ? (
                <View className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex-row items-center gap-2">
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  <Text className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Informations mises à jour avec succès !
                  </Text>
                </View>
              ) : null}

              {/* ── SECTION 1: MODIFIER LES INFORMATIONS DU PROFIL ── */}
              <View className="mb-6">
                <Text className="text-[11px] font-bold tracking-wider text-[#9DA3AF] uppercase mb-3">
                  Modifier mes informations
                </Text>

                {/* Nom */}
                <View className="mb-3">
                  <Text className="text-xs font-medium dark:text-white/80 text-blackBg/80 mb-1.5">
                    Nom complet
                  </Text>
                  <View className="flex-row items-center px-3.5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                    <Feather
                      name="user"
                      size={16}
                      color={isDark ? "#9DA3AF" : "#6B7280"}
                    />
                    <TextInput
                      value={editName}
                      onChangeText={setEditName}
                      placeholder="Votre nom"
                      placeholderTextColor="#9DA3AF"
                      className="flex-1 ml-2.5 text-sm dark:text-white text-blackBg p-0"
                    />
                  </View>
                </View>

                {/* Bio / Description */}
                <View className="mb-3">
                  <Text className="text-xs font-medium dark:text-white/80 text-blackBg/80 mb-1.5">
                    Bio / Description
                  </Text>
                  <View className="flex-row items-start px-3.5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                    <Feather
                      name="edit-3"
                      size={16}
                      color={isDark ? "#9DA3AF" : "#6B7280"}
                      style={{ marginTop: 2 }}
                    />
                    <TextInput
                      value={editDescription}
                      onChangeText={setEditDescription}
                      placeholder="Parlez-nous de vous"
                      placeholderTextColor="#9DA3AF"
                      multiline
                      numberOfLines={2}
                      className="flex-1 ml-2.5 text-sm dark:text-white text-blackBg p-0"
                    />
                  </View>
                </View>

                {/* Localisation */}
                <View className="mb-3">
                  <Text className="text-xs font-medium dark:text-white/80 text-blackBg/80 mb-1.5">
                    Localisation
                  </Text>
                  <View className="flex-row items-center px-3.5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                    <Feather
                      name="map-pin"
                      size={16}
                      color={isDark ? "#9DA3AF" : "#6B7280"}
                    />
                    <TextInput
                      value={editLocation}
                      onChangeText={setEditLocation}
                      placeholder="Ex: Kinshasa, Gombe"
                      placeholderTextColor="#9DA3AF"
                      className="flex-1 ml-2.5 text-sm dark:text-white text-blackBg p-0"
                    />
                  </View>
                </View>

                {/* Email */}
                <View className="mb-3">
                  <Text className="text-xs font-medium dark:text-white/80 text-blackBg/80 mb-1.5">
                    Adresse Email
                  </Text>
                  <View className="flex-row items-center px-3.5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                    <Feather
                      name="mail"
                      size={16}
                      color={isDark ? "#9DA3AF" : "#6B7280"}
                    />
                    <TextInput
                      value={editEmail}
                      onChangeText={setEditEmail}
                      placeholder="exemple@email.com"
                      placeholderTextColor="#9DA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="flex-1 ml-2.5 text-sm dark:text-white text-blackBg p-0"
                    />
                  </View>
                </View>

                {/* Téléphone (Non modifiable directement pour la logique backend, possibilité d'ajouter) */}
                <View className="mb-4">
                  <View className="flex-row items-center justify-between mb-1.5">
                    <Text className="text-xs font-medium dark:text-white/80 text-blackBg/80">
                      Numéro(s) de Téléphone
                    </Text>
                  </View>

                  {/* Numéros enregistrés */}
                  <View className="gap-2 mb-2.5">
                    {user.phoneNumbers.map((phoneNum, index) => {
                      const isPrimary = index === 0;
                      return (
                        <View
                          key={phoneNum}
                          className="flex-row items-center justify-between px-3.5 py-2.5 rounded-full
                           bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10"
                        >
                          <View className="flex-row items-center gap-2.5 flex-1 mr-2">
                            <Feather
                              name="phone"
                              size={15}
                              color={isDark ? "#9DA3AF" : "#6B7280"}
                            />
                            <Text className="text-sm font-medium dark:text-white text-blackBg">
                              {phoneNum}
                            </Text>
                          </View>
                          {isPrimary ? (
                            <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15">
                              <Feather name="lock" size={10} color="#10B981" />
                              <Text className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                Principal
                              </Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={() => handleRemovePhoneNumber(phoneNum)}
                              className="p-1 rounded-full active:opacity-60"
                            >
                              <Feather
                                name="trash-2"
                                size={14}
                                color="#EF4444"
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })}
                  </View>

                  {/* Notification de succès pour l'ajout de numéro */}
                  {phoneSuccess ? (
                    <View className="mb-2.5 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex-row items-center gap-2">
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10B981"
                      />
                      <Text className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {phoneSuccess}
                      </Text>
                    </View>
                  ) : null}

                  {/* Interface pour ajouter un nouveau numéro */}
                  {isAddingPhone ? (
                    <View className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-primary_color/40 gap-2.5">
                      <Text className="text-[11px] font-semibold text-primary_color">
                        Ajouter un nouveau numéro
                      </Text>
                      <View className="flex-row items-center px-3 py-2 rounded-lg bg-white dark:bg-[#1C2424] border border-black/10 dark:border-white/10">
                        <TextInput
                          value={newPhone}
                          onChangeText={setNewPhone}
                          placeholder="+243 ..."
                          placeholderTextColor="#9DA3AF"
                          keyboardType="phone-pad"
                          autoFocus
                          className="flex-1 ml-2 text-sm dark:text-white text-blackBg p-0"
                        />
                      </View>
                      <View className="flex-row items-center justify-end gap-2 mt-1">
                        <TouchableOpacity
                          onPress={() => {
                            setIsAddingPhone(false);
                            setNewPhone("");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/10"
                        >
                          <Text className="text-xs font-medium dark:text-white/80 text-blackBg/80">
                            Annuler
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleAddPhoneNumber}
                          className="px-3.5 py-1.5 rounded-lg bg-primary_color flex-row items-center gap-1.5 active:opacity-90"
                        >
                          <Feather name="plus" size={14} color="#FFFFFF" />
                          <Text className="text-xs font-bold text-white">
                            Ajouter
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setIsAddingPhone(true)}
                      className="flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-primary_color/50 bg-primary_color/5 active:bg-primary_color/10"
                    >
                      <Feather name="plus-circle" size={15} color="#007B7B" />
                      <Text className="text-xs font-semibold text-primary_color">
                        Ajouter un numéro de téléphone
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Save button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSaveProfile}
                  className="mt-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-primary_color active:opacity-90"
                >
                  <Feather name="check" size={17} color="#FFFFFF" />
                  <Text className="text-white font-bold text-sm">
                    Enregistrer les modifications
                  </Text>
                </TouchableOpacity>
              </View>

              {/* ── SECTION 2: PRÉFÉRENCES ── */}
              <View className="mb-6">
                <Text className="text-[11px] font-bold tracking-wider text-[#9DA3AF] uppercase mb-3">
                  Préférences
                </Text>

                <View className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 gap-3.5">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2.5 flex-1">
                      <Feather
                        name="bell"
                        size={17}
                        color={isDark ? "#FFFFFF" : "#121818"}
                      />
                      <View className="flex-1">
                        <Text className="text-xs font-semibold dark:text-white text-blackBg">
                          Notifications push
                        </Text>
                        <Text className="text-[11px] text-[#9DA3AF]">
                          Activités et nouveautés
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={notificationsEnabled}
                      onValueChange={setNotificationsEnabled}
                      trackColor={{ false: "#767577", true: "#007B7B" }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  <View className="h-[1px] bg-black/5 dark:bg-white/10" />

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2.5 flex-1">
                      <Feather
                        name="lock"
                        size={17}
                        color={isDark ? "#FFFFFF" : "#121818"}
                      />
                      <View className="flex-1">
                        <Text className="text-xs font-semibold dark:text-white text-blackBg">
                          Compte privé
                        </Text>
                        <Text className="text-[11px] text-[#9DA3AF]">
                          Seuls vos abonnés voient vos posts
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={privateAccount}
                      onValueChange={setPrivateAccount}
                      trackColor={{ false: "#767577", true: "#007B7B" }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>

              {/* ── SECTION 3: SÉCURITÉ & ACTIONS ── */}
              <View className="mb-2">
                <Text className="text-[11px] font-bold tracking-wider text-[#9DA3AF] uppercase mb-3">
                  Gestion du compte
                </Text>

                {/* AVANT-DERNIER BOUTON: Bloquer le compte */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleBlockAccount}
                  className="mb-3 p-3.5 rounded-2xl flex-row items-center justify-between bg-amber-500/10 border border-amber-500/30 active:opacity-80"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-9 h-9 rounded-xl items-center justify-center bg-amber-500/20">
                      <Feather name="slash" size={18} color="#D97706" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-amber-600 dark:text-amber-400">
                        Bloquer le compte
                      </Text>
                      <Text className="text-[11px] text-[#9DA3AF]">
                        Désactiver temporairement l'accès
                      </Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={18} color="#D97706" />
                </TouchableOpacity>

                {/* DERNIER BOUTON: Se déconnecter */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleLogout}
                  className="p-3.5 rounded-2xl flex-row items-center justify-between bg-red-500/10 border border-red-500/30 active:opacity-80"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-9 h-9 rounded-xl items-center justify-center bg-red-500/20">
                      <Feather name="log-out" size={18} color="#EF4444" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-red-600 dark:text-red-400">
                        Se déconnecter
                      </Text>
                      <Text className="text-[11px] text-[#9DA3AF]">
                        Fermer votre session actuelle
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
