import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

/* ─── Types ──────────────────────────────────────────────── */

interface SiteItem {
  id: string;
  name: string;
  image: ImageSourcePropType;
  location: string;
  category: string;
  isFollowing: boolean;
}

interface EventItem {
  id: string;
  image: ImageSourcePropType;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

interface FilterChip {
  id: string;
  label: string;
}

/* ─── Data ───────────────────────────────────────────────── */

const INITIAL_FILTERS: FilterChip[] = [
  { id: "resto", label: "Resto" },
  { id: "bar", label: "Bar" },
  { id: "parcs", label: "Parcs" },
];

const SITES: SiteItem[] = [
  {
    id: "1",
    name: "Centre culturel de Kinshasa",
    image: require("@/assets/images/leclub.png"),
    location: "Gombe, Kinshasa",
    category: "Culture",
    isFollowing: true,
  },
  {
    id: "2",
    name: "Parc de la Vallée de la N'sele",
    image: require("@/assets/images/bbmal.png"),
    location: "N'sele",
    category: "Nature & Eco",
    isFollowing: false,
  },
  {
    id: "3",
    name: "Musée National de la RDC",
    image: require("@/assets/images/bigbite.png"),
    location: "Lingwala",
    category: "Histoire",
    isFollowing: false,
  },
];

const MORE_SITES_AVATARS: ImageSourcePropType[] = [
  require("@/assets/images/leclub.png"),
  require("@/assets/images/bbmal.png"),
  require("@/assets/images/bigbite.png"),
];

const EVENTS: EventItem[] = [
  {
    id: "1",
    image: require("@/assets/images/party.jpg"),
    likes: 10,
    comments: 20,
    shares: 30,
    saves: 30,
  },
];

/* ─── Screen ─────────────────────────────────────────────── */

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>(
    INITIAL_FILTERS.map((f) => f.id)
  );
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>(
    Object.fromEntries(SITES.map((s) => [s.id, s.isFollowing]))
  );

  const colors = {
    bg: isDark ? "#121818" : "#F4F7F6",
    card: isDark ? "#1E2828" : "#FFFFFF",
    cardBorder: isDark ? "#2A3535" : "#E8EEEE",
    text: isDark ? "#F4F7F6" : "#121818",
    textSecondary: isDark ? "#8A9494" : "#6B7575",
    textMuted: isDark ? "#6B7575" : "#9BA5A5",
    searchBg: isDark ? "#1A2424" : "#FFFFFF",
    searchBorder: isDark ? "#2A3535" : "#DDE8E8",
    filterActiveBg: isDark ? "#2A3535" : "#1A2424",
    filterActiveText: isDark ? "#F4F7F6" : "#FFFFFF",
    filterInactiveBg: isDark ? "#1A2424" : "#F0F5F5",
    filterInactiveText: isDark ? "#8A9494" : "#6B7575",
    chipDeleteColor: isDark ? "#8A9494" : "#6B7575",
    sectionLabel: isDark ? "#6B7575" : "#9BA5A5",
    primaryTeal: "#007B7B",
    followBtnBg: isDark ? "#F4F7F6" : "#121818",
    followBtnText: isDark ? "#121818" : "#F4F7F6",
    filterIconBg: isDark ? "#1A2424" : "#FFFFFF",
    filterIconBorder: isDark ? "#2A3535" : "#DDE8E8",
    plusCircleBg: isDark ? "#1E2828" : "#FFFFFF",
    plusCircleBorder: isDark ? "#2A3535" : "#DDE8E8",
    eventOverlay: "rgba(0,0,0,0.45)",
    statColor: "#FFFFFF",
  };

  const toggleFilter = (id: string) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const toggleFollow = (id: string) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setFollowingMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMorePress = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    Alert.alert("Options", "Filtrer ou actualiser", [
      { text: "Actualiser", onPress: () => {} },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  const handleEventPress = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    Alert.alert("Événement", "Afficher les détails de l'événement");
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 32) }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Découvrir
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleMorePress}
          style={styles.moreButton}
        >
          <Feather name="more-vertical" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* ── Search row ── */}
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: colors.searchBg,
                borderColor: colors.searchBorder,
              },
            ]}
          >
            <Feather name="search" size={16} color={colors.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Rechercher un site, event..."
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.text }]}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterIconBtn,
              {
                backgroundColor: isDark ? colors.primaryTeal : colors.filterIconBg,
                borderColor: isDark ? colors.primaryTeal : colors.filterIconBorder,
              },
            ]}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={isDark ? "#FFF" : colors.primaryTeal}
            />
          </TouchableOpacity>
        </View>

        {/* ── Filter chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {INITIAL_FILTERS.map((chip) => {
            const isActive = activeFilters.includes(chip.id);
            return (
              <TouchableOpacity
                key={chip.id}
                onPress={() => toggleFilter(chip.id)}
                activeOpacity={0.75}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive
                      ? colors.filterActiveBg
                      : colors.filterInactiveBg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    {
                      color: isActive
                        ? colors.filterActiveText
                        : colors.filterInactiveText,
                    },
                  ]}
                >
                  {chip.label}
                </Text>
                {isActive && (
                  <Text
                    style={[styles.chipX, { color: colors.filterActiveText }]}
                  >
                    {" "}×
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── SITES ── */}
        <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>
          SITES
        </Text>

        <View style={styles.sitesList}>
          {SITES.map((site, index) => {
            const isFollowing = followingMap[site.id];
            return (
              <TouchableOpacity
                key={site.id}
                activeOpacity={0.8}
                style={[
                  styles.siteRow,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                    marginBottom: index < SITES.length - 1 ? 10 : 0,
                  },
                ]}
              >
                {/* Avatar */}
                <View style={styles.siteAvatarWrapper}>
                  <Image
                    source={site.image}
                    style={styles.siteAvatar}
                    resizeMode="cover"
                  />
                </View>

                {/* Text */}
                <View style={styles.siteInfo}>
                  <Text
                    style={[styles.siteName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {site.name}
                  </Text>
                  <Text
                    style={[styles.siteMeta, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {site.location} • {site.category}
                  </Text>
                </View>

                {/* Follow button (only if not following) */}
                {!isFollowing && (
                  <TouchableOpacity
                    onPress={() => toggleFollow(site.id)}
                    activeOpacity={0.85}
                    style={[
                      styles.followBtn,
                      { backgroundColor: colors.followBtnBg },
                    ]}
                  >
                    <Text
                      style={[styles.followBtnText, { color: colors.followBtnText }]}
                    >
                      Suivre
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── PLUS DES SITES ── */}
        <Text style={[styles.sectionLabel, { color: colors.sectionLabel, marginTop: 22 }]}>
          PLUS DES SITES
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moreSitesRow}
        >
          {/* + button */}
          <TouchableOpacity
            style={[
              styles.moreSiteCircle,
              {
                backgroundColor: colors.plusCircleBg,
                borderColor: colors.plusCircleBorder,
              },
            ]}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={22} color={colors.primaryTeal} />
          </TouchableOpacity>

          {/* Avatars */}
          {MORE_SITES_AVATARS.map((img, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              style={[
                styles.moreSiteCircle,
                {
                  backgroundColor: colors.plusCircleBg,
                  borderColor: colors.plusCircleBorder,
                },
              ]}
            >
              <Image source={img} style={styles.moreSiteAvatar} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── EVENEMENTS ── */}
        <Text style={[styles.sectionLabel, { color: colors.sectionLabel, marginTop: 22 }]}>
          EVENEMENTS
        </Text>

        {EVENTS.map((event) => (
          <TouchableOpacity
            key={event.id}
            activeOpacity={0.9}
            onPress={handleEventPress}
            style={[styles.eventCard, { marginHorizontal: 20 }]}
          >
            <Image
              source={event.image}
              style={styles.eventImage}
              resizeMode="cover"
            />

            {/* Overlay */}
            <View style={[styles.eventOverlay, { backgroundColor: colors.eventOverlay }]} />

            {/* Center label */}
            <View style={styles.eventCenterLabel}>
              <Text style={styles.eventCenterText}>Afficher Événement</Text>
            </View>

            {/* Stats row */}
            <View style={styles.eventStats}>
              <View style={styles.statItem}>
                <Ionicons name="heart" size={14} color="#E02424" />
                <Text style={[styles.statText, { color: colors.statColor }]}>
                  {event.likes}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble-outline" size={14} color="#FFF" />
                <Text style={[styles.statText, { color: colors.statColor }]}>
                  {event.comments}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="arrow-redo-outline" size={14} color="#FFF" />
                <Text style={[styles.statText, { color: colors.statColor }]}>
                  {event.shares}
                </Text>
              </View>
              <View style={[styles.statItem, styles.statRight]}>
                <Ionicons name="bookmark-outline" size={14} color="#FFF" />
                <Text style={[styles.statText, { color: colors.statColor }]}>
                  {event.saves}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  moreButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },

  /* Search */
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 14,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: 44,
  },
  filterIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Chips */
  chipsRow: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  chipX: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 16,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 10,
  },

  /* Sites list */
  sitesList: {
    paddingHorizontal: 20,
  },
  siteRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  siteAvatarWrapper: {
    width: 46,
    height: 46,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#E0E8E8",
  },
  siteAvatar: {
    width: "100%",
    height: "100%",
  },
  siteInfo: {
    flex: 1,
    marginLeft: 12,
  },
  siteName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  siteMeta: {
    fontSize: 12,
  },
  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    marginLeft: 10,
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },

  /* More sites */
  moreSitesRow: {
    paddingHorizontal: 20,
    gap: 12,
    alignItems: "center",
  },
  moreSiteCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  moreSiteAvatar: {
    width: "100%",
    height: "100%",
  },

  /* Events */
  eventCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 200,
    marginTop: 4,
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  eventOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  eventCenterLabel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  eventCenterText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  eventStats: {
    position: "absolute",
    bottom: 14,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statRight: {
    marginLeft: "auto",
  },
  statText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
