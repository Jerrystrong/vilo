import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import {
  FireIcon,
  SearchIcon,
  MapPinCenterIcon,
  HeartIcon,
  ProfileIcon,
  StatsIcon,
  CalendarCheckIcon,
  PlusCenterIcon,
} from "./tab-icons";
import { UserRole, useUserRole } from "@/context/role-context";

export type UserTabKey =
  | "flame"
  | "search"
  | "map"
  | "favorites"
  | "profile";

export type EtabTabKey =
  | "stats"
  | "calendar"
  | "create"
  | "favorites"
  | "profile";

export type TabKey = UserTabKey | EtabTabKey;

export interface AppTabsProps {
  role?: UserRole;
  activeTab?: string;
  onTabChange?: (tabKey: string) => void;
  favoritesBadgeCount?: number;
}

interface IndicatorMetrics {
  x: number;
  y: number;
  width: number;
  height: number;
}

const SLIDE_DURATION = 260;
const SLIDE_EASING = Easing.out(Easing.cubic);

export default function AppTabs({
  role: propRole,
  activeTab: controlledActiveTab,
  onTabChange,
  favoritesBadgeCount = 8,
}: AppTabsProps) {
  const context = useUserRole();
  const currentRole: UserRole = propRole ?? context.role ?? "user";
  const insets = useSafeAreaInsets();

  // ------------------------------------------------------------
  // ACTIVE TAB
  // ------------------------------------------------------------

  const defaultTab = currentRole === "user" ? "map" : "stats";

  const [internalActiveTab, setInternalActiveTab] =
    React.useState<string>(defaultTab);

  const activeTab =
    controlledActiveTab !== undefined
      ? controlledActiveTab
      : internalActiveTab;

  // ------------------------------------------------------------
  // SYNC ROLE
  // ------------------------------------------------------------

  React.useEffect(() => {
    if (controlledActiveTab === undefined) {
      const nextTab = currentRole === "user" ? "map" : "stats";

      setInternalActiveTab(nextTab);
      activeTabRef.current = nextTab;
    }
  }, [currentRole, controlledActiveTab]);

  // ------------------------------------------------------------
  // INDICATOR REFS
  // ------------------------------------------------------------

  const pillRef = React.useRef<View>(null);

  const indicatorNodes = React.useRef<
    Partial<Record<TabKey, View | null>>
  >({});

  const indicatorMetrics = React.useRef<
    Partial<Record<TabKey, IndicatorMetrics>>
  >({});

  const activeTabRef = React.useRef(activeTab);

  const [isIndicatorReady, setIndicatorReady] = React.useState(false);

  // ------------------------------------------------------------
  // ANIMATED VALUES
  // ------------------------------------------------------------

  const translateX = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  const indicatorWidth = React.useRef(new Animated.Value(0)).current;
  const indicatorHeight = React.useRef(new Animated.Value(0)).current;

  // ------------------------------------------------------------
  // KEEP ACTIVE TAB REF IN SYNC
  // ------------------------------------------------------------

  React.useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // ------------------------------------------------------------
  // RESET INDICATOR WHEN ROLE CHANGES
  // ------------------------------------------------------------

  React.useEffect(() => {
    indicatorMetrics.current = {};

    setIndicatorReady(false);

    // Reset animated values so we never display
    // an old indicator position while changing role.
    translateX.setValue(0);
    translateY.setValue(0);
    indicatorWidth.setValue(0);
    indicatorHeight.setValue(0);
  }, [
    currentRole,
    translateX,
    translateY,
    indicatorWidth,
    indicatorHeight,
  ]);

  // ------------------------------------------------------------
  // REGISTER TAB ANCHOR
  // ------------------------------------------------------------

  const registerIndicatorRef = React.useCallback(
    (key: TabKey, node: View | null) => {
      indicatorNodes.current[key] = node;
    },
    []
  );

  // ------------------------------------------------------------
  // ANIMATE INDICATOR
  // ------------------------------------------------------------

  const animateIndicator = React.useCallback(
    (metrics: IndicatorMetrics, immediate = false) => {
      if (immediate) {
        translateX.setValue(metrics.x);
        translateY.setValue(metrics.y);
        indicatorWidth.setValue(metrics.width);
        indicatorHeight.setValue(metrics.height);
        return;
      }

      // Stop previous animation before starting another one.
      translateX.stopAnimation();
      translateY.stopAnimation();
      indicatorWidth.stopAnimation();
      indicatorHeight.stopAnimation();

      Animated.parallel([
        Animated.timing(translateX, {
          toValue: metrics.x,
          duration: SLIDE_DURATION,
          easing: SLIDE_EASING,
          useNativeDriver: true,
        }),

        Animated.timing(translateY, {
          toValue: metrics.y,
          duration: SLIDE_DURATION,
          easing: SLIDE_EASING,
          useNativeDriver: true,
        }),

        Animated.timing(indicatorWidth, {
          toValue: metrics.width,
          duration: SLIDE_DURATION,
          easing: SLIDE_EASING,
          useNativeDriver: false,
        }),

        Animated.timing(indicatorHeight, {
          toValue: metrics.height,
          duration: SLIDE_DURATION,
          easing: SLIDE_EASING,
          useNativeDriver: false,
        }),
      ]).start();
    },
    [
      translateX,
      translateY,
      indicatorWidth,
      indicatorHeight,
    ]
  );

  // ------------------------------------------------------------
  // MEASURE TAB
  // ------------------------------------------------------------

  const measureIndicator = React.useCallback(
    (key: TabKey) => {
      const node = indicatorNodes.current[key];
      const container = pillRef.current;

      if (!node || !container) {
        return;
      }

      requestAnimationFrame(() => {
        node.measureLayout(
          container,

          (x, y, width, height) => {
            const metrics: IndicatorMetrics = {
              x,
              y,
              width,
              height,
            };

            // Always keep latest measurements.
            indicatorMetrics.current[key] = metrics;

            // Only the active tab controls the visible indicator.
            if (key !== activeTabRef.current) {
              return;
            }

            // First measurement:
            // place indicator immediately without animation.
            if (!isIndicatorReady) {
              animateIndicator(metrics, true);

              setIndicatorReady(true);

              return;
            }

            // Subsequent measurements:
            // animate normally.
            animateIndicator(metrics);
          },

          () => {
            // Layout not ready yet.
            // onLayout will trigger another measurement.
          }
        );
      });
    },
    [animateIndicator, isIndicatorReady]
  );

  // ------------------------------------------------------------
  // PILL LAYOUT
  // ------------------------------------------------------------

  const handlePillLayout = React.useCallback(() => {
    requestAnimationFrame(() => {
      const keys = Object.keys(
        indicatorNodes.current
      ) as TabKey[];

      keys.forEach((key) => {
        measureIndicator(key);
      });
    });
  }, [measureIndicator]);

  // ------------------------------------------------------------
  // ACTIVE TAB CHANGE
  // ------------------------------------------------------------

  React.useEffect(() => {
    activeTabRef.current = activeTab;

    const metrics =
      indicatorMetrics.current[activeTab as TabKey];

    // If the tab was already measured,
    // move indicator immediately through animation.
    if (metrics && isIndicatorReady) {
      animateIndicator(metrics);
    }
  }, [
    activeTab,
    isIndicatorReady,
    animateIndicator,
  ]);

  // ------------------------------------------------------------
  // TAB PRESS
  // ------------------------------------------------------------

  const handleTabPress = (tabKey: string) => {
    if (Platform.OS !== "web") {
      try {
        Haptics.impactAsync(
          Haptics.ImpactFeedbackStyle.Light
        );
      } catch {
        // Safe fallback
      }
    }

    // IMPORTANT:
    // Update immediately so measureIndicator()
    // always knows which tab is active.
    activeTabRef.current = tabKey;

    if (onTabChange) {
      onTabChange(tabKey);
    } else {
      setInternalActiveTab(tabKey);
    }
  };

  // ------------------------------------------------------------
  // BOTTOM OFFSET
  // ------------------------------------------------------------

  const bottomOffset = Platform.select({
    web: 24,
    ios: Math.max(insets.bottom, 12) + 8,
    android: Math.max(insets.bottom, 12) + 12,
    default: 20,
  });

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          bottom: bottomOffset,
        },
      ]}
    >
      <View
        ref={pillRef}
        onLayout={handlePillLayout}
        style={styles.pillContainer}
      >
        {currentRole === "user" ? (
          <>
            {/* 1. Flame */}
            <TabItem
              tabKey="flame"
              isActive={activeTab === "flame"}
              onPress={() => handleTabPress("flame")}
              registerIndicatorRef={registerIndicatorRef}
              onIndicatorLayout={measureIndicator}
            >
              <FireIcon
                size={26}
                color={
                  activeTab === "flame"
                    ? "#FFFFFF"
                    : "#D0D7D7"
                }
              />
            </TabItem>

            {/* 2. Search */}
            <TabItem
              tabKey="search"
              isActive={activeTab === "search"}
              onPress={() => handleTabPress("search")}
              registerIndicatorRef={registerIndicatorRef}
              onIndicatorLayout={measureIndicator}
            >
              <SearchIcon
                size={23}
                color={
                  activeTab === "search"
                    ? "#FFFFFF"
                    : "#D0D7D7"
                }
              />
            </TabItem>

            {/* 3. Center Map */}
            <TabItem
              tabKey="map"
              isActive={activeTab === "map"}
              onPress={() => handleTabPress("map")}
              isCenter
              registerIndicatorRef={registerIndicatorRef}
              onIndicatorLayout={measureIndicator}
            >
              <View style={{ marginTop: 10 }}>
                <MapPinCenterIcon
                  size={52}
                  active={activeTab === "map"}
                />
              </View>
            </TabItem>

            {/* 4. Favorites */}
            <TabItem
              tabKey="favorites"
              isActive={activeTab === "favorites"}
              onPress={() => handleTabPress("favorites")}
              registerIndicatorRef={registerIndicatorRef}
              onIndicatorLayout={measureIndicator}
            >
              <View style={styles.iconWithBadge}>
                <HeartIcon
                  size={26}
                  color={
                    activeTab === "favorites"
                      ? "#FFFFFF"
                      : "#D0D7D7"
                  }
                />

                {favoritesBadgeCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {favoritesBadgeCount > 99
                        ? "99+"
                        : favoritesBadgeCount}
                    </Text>
                  </View>
                )}
              </View>
            </TabItem>

            {/* 5. Profile */}
            <TabItem
              tabKey="profile"
              isActive={activeTab === "profile"}
              onPress={() => handleTabPress("profile")}
              registerIndicatorRef={registerIndicatorRef}
              onIndicatorLayout={measureIndicator}
            >
              <ProfileIcon
                size={25}
                color={
                  activeTab === "profile"
                    ? "#FFFFFF"
                    : "#D0D7D7"
                }
              />
            </TabItem>
          </>
        ) : (
          <>
            {/* 1. Stats */}
            <TabItem
              tabKey="stats"
              isActive={activeTab === "stats"}
              onPress={() => handleTabPress("stats")}
              registerIndicatorRef={registerIndicatorRef}
              onIndicatorLayout={measureIndicator}
            >
              <StatsIcon
                size={24}
                color={
                  activeTab === "stats"
                    ? "#FFFFFF"
                    : "#D0D7D7"
                }
              />
            </TabItem>

            {/* 2. Calendar */}
            <TabItem
              tabKey="calendar"
              isActive={activeTab === "calendar"}
              onPress={() => handleTabPress("calendar")}
              registerIndicatorRef={registerIndicatorRef}
              onIndicatorLayout={measureIndicator}
            >
              <CalendarCheckIcon
                size={25}
                color={
                  activeTab === "calendar"
                    ? "#FFFFFF"
                    : "#D0D7D7"
                }
              />
            </TabItem>

            {/* 3. Center Create */}
            <TabItem
              tabKey="create"
              isActive={activeTab === "create"}
              onPress={() => handleTabPress("create")}
              isCenter
              registerIndicatorRef={registerIndicatorRef}
              onIndicatorLayout={measureIndicator}
            >
              <PlusCenterIcon size={56} />
            </TabItem>

            {/* 4. Favorites */}
            <TabItem
              tabKey="favorites"
              isActive={activeTab === "favorites"}
              onPress={() => handleTabPress("favorites")}
              registerIndicatorRef={registerIndicatorRef}
              onIndicatorLayout={measureIndicator}
            >
              <HeartIcon
                size={26}
                color={
                  activeTab === "favorites"
                    ? "#FFFFFF"
                    : "#D0D7D7"
                }
              />
            </TabItem>

            {/* 5. Profile */}
            <TabItem
              tabKey="profile"
              isActive={activeTab === "profile"}
              onPress={() => handleTabPress("profile")}
              registerIndicatorRef={registerIndicatorRef}
              onIndicatorLayout={measureIndicator}
            >
              <ProfileIcon
                size={25}
                color={
                  activeTab === "profile"
                    ? "#FFFFFF"
                    : "#D0D7D7"
                }
              />
            </TabItem>
          </>
        )}

        {/* =====================================================
            SLIDING INDICATOR
        ====================================================== */}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.slidingIndicatorWrapper,
            {
              opacity: isIndicatorReady ? 1 : 0,
              transform: [
                { translateX },
                { translateY },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.slidingIndicator,
              {
                width: indicatorWidth,
                height: indicatorHeight,
              },
            ]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

// ============================================================
// TAB ITEM
// ============================================================

interface TabItemProps {
  children: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
  isCenter?: boolean;
  tabKey: TabKey;
  registerIndicatorRef: (
    key: TabKey,
    node: View | null
  ) => void;
  onIndicatorLayout: (key: TabKey) => void;
}

function TabItem({
  children,
  isActive,
  onPress,
  isCenter,
  tabKey,
  registerIndicatorRef,
  onIndicatorLayout,
}: TabItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabItem,
        isCenter && styles.tabItemCenter,
        pressed && styles.tabItemPressed,
      ]}
      hitSlop={{
        top: isCenter ? 28 : 10,
        bottom: 10,
        left: 8,
        right: 8,
      }}
      accessibilityRole="button"
      accessibilityState={{
        selected: isActive,
      }}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconWrapper,
          isCenter && styles.centerIconWrapper,
        ]}
      >
        {children}
      </View>

      {/* Invisible measurement anchor */}
      <View
        ref={(node) =>
          registerIndicatorRef(tabKey, node)
        }
        onLayout={() =>
          onIndicatorLayout(tabKey)
        }
        style={[
          styles.indicator,
          isCenter && styles.indicatorCenter,
        ]}
      />
    </Pressable>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  pillContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#0A1414",

    width: "76%",
    maxWidth: 410,
    height: 66,

    borderRadius: 35,

    paddingHorizontal: 20,

    shadowColor: "#FFFFFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,

    elevation: 10,

    ...Platform.select({
      web: {
        boxShadow:
          "0 0 24px 0 rgba(255, 255, 255, 0.10)",
      },
    }),

    overflow: "visible",
  },

  tabItem: {
    flex: 1,
    height: "100%",

    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 4,
  },

  tabItemCenter: {
    overflow: "visible",
    justifyContent: "flex-end",
    paddingBottom: 6,
    zIndex: 10,
  },

  tabItemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },

  iconWrapper: {
    height: 42,

    alignItems: "center",
    justifyContent: "center",
  },

  centerIconWrapper: {
    marginTop: -26,
    height: 62,

    alignItems: "center",
    justifyContent: "center",
  },

  iconWithBadge: {
    position: "relative",

    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    position: "absolute",

    top: -5,
    right: -8,

    backgroundColor: "#007B7B",

    minWidth: 18,
    height: 18,

    borderRadius: 9,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 3,

    borderWidth: 1.5,
    borderColor: "#0A1414",
  },

  badgeText: {
    color: "#FFFFFF",

    fontSize: 10.5,
    fontWeight: "800",

    textAlign: "center",

    includeFontPadding: false,
    lineHeight: 12,
  },

  // Invisible anchor used ONLY for measurement
  indicator: {
    width: 15,
    marginLeft: 6,

    height: 3.2,

    borderRadius: 2,

    marginTop: 2,

    opacity: 0,
  },

  indicatorCenter: {
    width: 30,
    marginLeft: 13,

    height: 3.4,

    borderRadius: 3.2,

    marginTop: 3,
  },

  slidingIndicatorWrapper: {
    position: "absolute",

    left: 0,
    top: 0,

    zIndex: 5,
  },

  slidingIndicator: {
    backgroundColor: "#007B7B",
    borderRadius: 3,
  },
});