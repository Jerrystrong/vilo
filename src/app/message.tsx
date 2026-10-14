import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BellNotificationIcon from "@/assets/svg/notificationIcon";
import { ThemedView } from "@/components/themed-view";

interface MessageItem {
  id: string;
  name: string;
  image: ImageSourcePropType;
  lastMessage: string;
  lastMessageTime: string;
  lastPerson: string;
  unreadCount: number;
  isOwnMessage: boolean;
}

const Messages: MessageItem[] = [
  {
    id: "1",
    name: "Centre culturel de Kinshasa",
    image: require("@/assets/images/leclub.png"),
    lastMessage: "Bonjour, puis-je savoir plus sur la ...",
    lastMessageTime: "14:21",
    lastPerson: "Vous",
    unreadCount: 0,
    isOwnMessage: true,
  },
  {
    id: "2",
    name: "Mafialand Park",
    image: require("@/assets/images/bbmal.png"),
    lastMessage: "Oui, merci bcp",
    lastMessageTime: "11:21",
    lastPerson: "Mafialand Park",
    unreadCount: 2,
    isOwnMessage: false,
  },
  {
    id: "3",
    name: "Le Klub",
    image: require("@/assets/images/leclub.png"),
    lastMessage: "Bonjour, puis-je savoir plus sur la ...",
    lastMessageTime: "24/08/2026",
    lastPerson: "Vous",
    unreadCount: 0,
    isOwnMessage: true,
  },
  {
    id: "4",
    name: "Big Bite",
    image: require("@/assets/images/bigbite.png"),
    lastMessage: "Oui nous sommes disponible",
    lastMessageTime: "17/08/2026",
    lastPerson: "Big Bite",
    unreadCount: 0,
    isOwnMessage: false,
  },
];

export default function MessageScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const handleMorePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    Alert.alert("Options", "Options des activités", [
      { text: "Actualiser", onPress: () => {} },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  const handleMessagePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
  };

  const colors = {
    bg: isDark ? "#121818" : "#F4F7F6",
    card: isDark ? "#1A2020" : "#FFFFFF",
    separator: isDark ? "#1E2828" : "#EFEFEF",
    text: isDark ? "#F4F7F6" : "#121818",
    textSecondary: isDark ? "#8A9494" : "#6B7575",
    textMuted: isDark ? "#6B7575" : "#9BA5A5",
    notifBg: isDark ? "rgba(255,255,255,0.08)" : "#FFFFFF",
    notifBorder: isDark ? "rgba(0,123,123,0.3)" : "#D4ECEC",
    primaryTeal: "#007B7B",
    badgeBg: "#007B7B",
    sectionLabel: isDark ? "#6B7575" : "#9BA5A5",
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 32) }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Activités
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
        {/* ── Autres notifs ── */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleMessagePress}
          style={[styles.notifRow, { borderBottomColor: colors.separator }]}
        >
          {/* Bell icon circle */}
          <View
            style={[
              styles.bellCircle,
              {
                backgroundColor: colors.notifBg,
                borderColor: colors.notifBorder,
              },
            ]}
          >
            <BellNotificationIcon
              width={22}
              height={22}
              stroke={colors.primaryTeal}
            />
          </View>

          {/* Text */}
          <View style={styles.notifText}>
            <Text style={[styles.notifTitle, { color: colors.text }]}>
              Autres notifs
            </Text>
            <Text style={[styles.notifSub, { color: colors.textSecondary }]}>
              Réservation approuvé par ...
            </Text>
          </View>

          {/* Badge count */}
          <View style={[styles.badge, { backgroundColor: colors.badgeBg }]}>
            <Text style={styles.badgeText}>8</Text>
          </View>
        </TouchableOpacity>

        {/* ── MES MESSAGES label ── */}
        <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>
          MES MESSAGES
        </Text>

        {/* ── Message list ── */}
        {Messages.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.75}
            onPress={handleMessagePress}
            style={[
              styles.messageRow,
              {
                borderBottomColor: colors.separator,
                borderBottomWidth: index < Messages.length - 1 ? 1 : 0,
              },
            ]}
          >
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              <Image
                source={item.image}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>

            {/* Content */}
            <View style={styles.messageContent}>
              <View style={styles.messageTopRow}>
                <Text
                  style={[styles.messageName, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text style={[styles.messageTime, { color: colors.textMuted }]}>
                  {item.lastMessageTime}
                </Text>
              </View>
              <View style={styles.messageBottomRow}>
                <Text
                  style={[
                    styles.messagePreview,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {item.isOwnMessage ? (
                    <Text style={{ color: colors.textMuted }}>Vous . </Text>
                  ) : null}
                  {item.lastMessage}
                </Text>
                {item.unreadCount > 0 && (
                  <View
                    style={[styles.badge, { backgroundColor: colors.badgeBg }]}
                  >
                    <Text style={styles.badgeText}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  /* Notif row */
  notifRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  bellCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  notifText: {
    flex: 1,
    marginLeft: 14,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  notifSub: {
    fontSize: 13,
  },
  /* Section label */
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 6,
  },
  /* Message rows */
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#E0E0E0",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  messageContent: {
    flex: 1,
    marginLeft: 14,
  },
  messageTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  messageName: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    flexShrink: 0,
  },
  messageBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messagePreview: {
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  /* Badge */
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
