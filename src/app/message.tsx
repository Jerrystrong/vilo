import BarIcon from "@/assets/svg/barIcon";
import BellNotificationIcon from "@/assets/svg/notificationIcon";
import { ThemedView } from "@/components/themed-view";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MessageItem {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  lastMessage: string;
  isSenderUser?: boolean;
  time: string;
  unreadCount?: number;
  hasCategoryIcon?: boolean;
}

export default function MessageScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";

  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [notifBadgeCount, setNotifBadgeCount] = useState<number>(8);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "1",
      name: "Centre culturel de Kinshasa",
      avatar: require("@/assets/images/ccapac.png"),
      lastMessage: "Bonjour, puis je savoir plus sur la ...",
      isSenderUser: true,
      time: "14:21",
    },
    {
      id: "2",
      name: "Mafialand Park",
      avatar: require("@/assets/images/avatar_mafialand.png"),
      lastMessage: "Oui, merci bcp",
      isSenderUser: false,
      time: "11:21",
      unreadCount: 8,
    },
    {
      id: "3",
      name: "Le Klub",
      avatar: require("@/assets/images/leclub.png"),
      lastMessage: "Bonjour, puis je savoir plus sur la ...",
      isSenderUser: true,
      time: "24/08/2026",
      hasCategoryIcon: true,
    },
    {
      id: "4",
      name: "Big Bite",
      avatar: require("@/assets/images/bigbite.png"),
      lastMessage: "Oui nous sommes disponible",
      isSenderUser: false,
      time: "17/08/2026",
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      setRefreshing(false);
    }, 900);
  };

  const handleMessagePress = (item: MessageItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Mark as read if it had unread count
    if (item.unreadCount) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === item.id ? { ...msg, unreadCount: undefined } : msg,
        ),
      );
    }
    Alert.alert(
      item.name,
      `Dernier message : "${item.lastMessage}"\n\nDiscussion prête à être ouverte.`,
    );
  };

  const handleNotificationsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Autres notifications",
      "8 nouvelles notifications : réservations approuvées, promotions et confirmations de statut.",
    );
  };

  const handleMarkAllRead = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNotifBadgeCount(0);
    setMessages((prev) =>
      prev.map((msg) => ({ ...msg, unreadCount: undefined })),
    );
    setShowMenu(false);
  };

  return (
    <ThemedView
      className="flex-1 bg-whiteBg dark:bg-blackBg"
      style={{
        paddingTop: Math.max(insets.top, Platform.OS === "android" ? 24 : 12),
      }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Main Scroll Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 120, // space for persistent bottom navigation tab bar
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? "#2DD4BF" : "#007B7B"}
            colors={["#007B7B"]}
          />
        }
      >
        {/* Header bar */}
        <View className="flex-row items-center justify-between mt-2 mb-6">
          <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg px-3 tracking-tight">
            Activités
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowMenu(true);
            }}
            className=""
          >
            <Feather
              name="more-vertical"
              size={22}
              color={isDark ? "#E5E7EB" : "#1F2937"}
            />
          </TouchableOpacity>
        </View>

        {/* Section: Autres notifs */}
        <View className="flex-row flex items-center justify-between py-2.5 mb-6">
          <View className="flex-row items-center flex px-3 gap-3 justify-between">
            {/* Round Bell Icon Container */}
            <View
              className="w-[52px] h-[52px] rounded-full items-center justify-center bg-white dark:bg-[#1C2424] border border-[#E5E7EB] dark:border-[#2A3535] p-3"
              style={styles.bellShadow}
            >
              <BellNotificationIcon stroke="#007B7B" width={18} height={18} />
            </View>

            {/* Notification Text */}
            <View className="ml-2 flex ">
              <Text className="text-[21px] font-bold text-[#505C5C] dark:text-whiteBg">
                Autres notifs
              </Text>
              <Text
                className="text-[14px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5"
                numberOfLines={1}
              >
                Réservation approuvé par ...
              </Text>
            </View>
          </View>
          {/* Right Badge */}
          {notifBadgeCount > 0 && (
            <View className="w-[18px] h-[18px] rounded-full bg-primary_color flex items-center justify-center">
              <Text className="text-white text-[11px] font-bold">
                {notifBadgeCount}
              </Text>
            </View>
          )}
        </View>

        {/* Section title: MES MESSAGES */}
        <View className="mb-4 mt-5">
          <Text className="text-[#6B7280] dark:text-[#D1D5DB] font-bold text-[16px]">
            MES MESSAGES
          </Text>
        </View>

        {/* Messages List */}
        <View className="gap-y-4">
          {messages.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => handleMessagePress(item)}
              className="flex-row items-center py-2 gap-3"
            >
              {/* Avatar with optional badge */}
              <View className="relative">
                <Image
                  source={item.avatar}
                  style={styles.avatarImage}
                  className="rounded-full bg-white dark:bg-[#1E2626]"
                  resizeMode="contain"
                />

                {/* Cocktail badge for Le Klub */}
                {item.hasCategoryIcon && (
                  <View className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black border border-white dark:border-[#1E2626] items-center justify-center">
                    <BarIcon width={12} height={12} color="#fefefe" />
                  </View>
                )}
              </View>

              {/* Message Details */}
              <View className="flex-1 ml-3.5 justify-center">
                <View className="flex-row items-center justify-between mb-1">
                  <Text
                    className="text-[15.5px] font-bold text-[#111827] dark:text-white flex-1 mr-2"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-[12px] text-[#9CA3AF] dark:text-[#6B7280]">
                    {item.time}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-[13.5px] text-[#6B7280] dark:text-[#9CA3AF] flex-1 mr-2"
                    numberOfLines={1}
                  >
                    {item.isSenderUser && (
                      <Text className="text-[#6B7280] dark:text-[#9CA3AF]">
                        Vous .{" "}
                      </Text>
                    )}
                    {item.lastMessage}
                  </Text>

                  {/* Unread Message Badge */}
                  {item.unreadCount !== undefined && item.unreadCount > 0 && (
                    <View className="w-5 h-5 rounded-full bg-[#007B7B] items-center justify-center ml-2">
                      <Text className="text-white text-[11px] font-bold">
                        {item.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Options Popup Modal for 3-dots */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-start items-end pt-20 pr-5"
          onPress={() => setShowMenu(false)}
        >
          <View
            className="w-56 bg-white dark:bg-[#1E2626] rounded-2xl p-2 border border-gray-100 dark:border-[#2C3838]"
            style={styles.modalShadow}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleMarkAllRead}
              className="flex-row items-center py-3 px-3.5 rounded-xl active:bg-gray-100 dark:active:bg-[#2A3434]"
            >
              <Ionicons
                name="checkmark-done-outline"
                size={18}
                color={isDark ? "#2DD4BF" : "#007B7B"}
              />
              <Text className="text-[14px] font-semibold text-[#111827] dark:text-white ml-3">
                Tout marquer comme lu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowMenu(false);
                Alert.alert("Recherche", "Recherche dans les discussions");
              }}
              className="flex-row items-center py-3 px-3.5 rounded-xl active:bg-gray-100 dark:active:bg-[#2A3434]"
            >
              <Feather
                name="search"
                size={17}
                color={isDark ? "#9CA3AF" : "#4B5563"}
              />
              <Text className="text-[14px] font-semibold text-[#111827] dark:text-white ml-3">
                Rechercher
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowMenu(false);
                Alert.alert(
                  "Paramètres",
                  "Paramètres des notifications et messages",
                );
              }}
              className="flex-row items-center py-3 px-3.5 rounded-xl active:bg-gray-100 dark:active:bg-[#2A3434]"
            >
              <Feather
                name="settings"
                size={17}
                color={isDark ? "#9CA3AF" : "#4B5563"}
              />
              <Text className="text-[14px] font-semibold text-[#111827] dark:text-white ml-3">
                Paramètres
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  avatarImage: {
    width: 48,
    height: 48,
  },
  bellShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  modalShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
});
