import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserRole, useUserRole } from '@/context/role-context';
import {
    CalendarCheckIcon,
    FireIcon,
    HeartIcon,
    MapPinCenterIcon,
    PlusCenterIcon,
    ProfileIcon,
    SearchIcon,
    StatsIcon,
} from './tab-icons';

export type UserTabKey = 'flame' | 'search' | 'map' | 'favorites' | 'profile';
export type EtabTabKey = 'stats' | 'calendar' | 'create' | 'favorites' | 'profile';
export type TabKey = UserTabKey | EtabTabKey;

export interface AppTabsProps {
  /**
   * User role: 'user' for client/normal user, 'etab' for establishment
   * If not provided, will read from RoleContext
   */
  role?: UserRole;
  /**
   * Currently active tab key
   */
  activeTab?: string;
  /**
   * Callback fired when a tab is pressed
   */
  onTabChange?: (tabKey: string) => void;
  /**
   * Unread notification count for the heart badge (defaults to 8 for user role)
   */
  favoritesBadgeCount?: number;
}

export default function AppTabs({
  role: propRole,
  activeTab: controlledActiveTab,
  onTabChange,
  favoritesBadgeCount = 8,
}: AppTabsProps) {
  const context = useUserRole();
  const currentRole: UserRole = propRole ?? context.role ?? 'user';
  const insets = useSafeAreaInsets();

  // Default active tabs matching the user's screenshots:
  // User normal: 'map' (center icon active)
  // Etab: 'stats' (first icon active)
  const defaultTab = currentRole === 'user' ? 'map' : 'stats';
  const [internalActiveTab, setInternalActiveTab] = React.useState<string>(defaultTab);

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  // Sync default if role switches and controlled prop is not used
  React.useEffect(() => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(currentRole === 'user' ? 'map' : 'stats');
    }
  }, [currentRole, controlledActiveTab]);

  const handleTabPress = (tabKey: string) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Safe fallback
      }
    }
    if (onTabChange) {
      onTabChange(tabKey);
    } else {
      setInternalActiveTab(tabKey);
    }
  };

  const bottomOffset = Platform.select({
    web: 24,
    ios: Math.max(insets.bottom, 12) + 8,
    android: Math.max(insets.bottom, 12) + 12,
    default: 20,
  });

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: bottomOffset }]}
    >
      <View style={styles.pillContainer}>
        {currentRole === 'user' ? (
          /* ==================================================== */
          /* MENU 1 : USER NORMAL                                  */
          /* ==================================================== */
          <>
            {/* 1. Flame */}
            <TabItem
              isActive={activeTab === 'flame'}
              onPress={() => handleTabPress('flame')}
            >
              <FireIcon
                size={26}
                color={activeTab === 'flame' ? '#FFFFFF' : '#D0D7D7'}
              />
            </TabItem>

            {/* 2. Search */}
            <TabItem
              isActive={activeTab === 'search'}
              onPress={() => handleTabPress('search')}
            >
              <SearchIcon
                size={23}
                color={activeTab === 'search' ? '#FFFFFF' : '#D0D7D7'}
              />
            </TabItem>

            {/* 3. Center Map Pin (Featured) */}
            <TabItem
              isActive={activeTab === 'map'}
              onPress={() => handleTabPress('map')}
              isCenter
            >
              <View style={{ marginTop: 10 }}>
                <MapPinCenterIcon size={52} active={activeTab === 'map'} />
              </View>
            </TabItem>

            {/* 4. Heart with Badge */}
            <TabItem
              isActive={activeTab === 'favorites'}
              onPress={() => handleTabPress('favorites')}
            >
              <View style={styles.iconWithBadge}>
                <HeartIcon
                  size={26}
                  color={activeTab === 'favorites' ? '#FFFFFF' : '#D0D7D7'}
                />
                {favoritesBadgeCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {favoritesBadgeCount > 99 ? '99+' : favoritesBadgeCount}
                    </Text>
                  </View>
                )}
              </View>
            </TabItem>

            {/* 5. Profile */}
            <TabItem
              isActive={activeTab === 'profile'}
              onPress={() => handleTabPress('profile')}
            >
              <ProfileIcon
                size={25}
                color={activeTab === 'profile' ? '#FFFFFF' : '#D0D7D7'}
              />
            </TabItem>
          </>
        ) : (
          /* ==================================================== */
          /* MENU 2 : ETABLISSEMENT (ETAB)                        */
          /* ==================================================== */
          <>
            {/* 1. Stats / Dashboard */}
            <TabItem
              isActive={activeTab === 'stats'}
              onPress={() => handleTabPress('stats')}
            >
              <StatsIcon
                size={24}
                color={activeTab === 'stats' ? '#FFFFFF' : '#D0D7D7'}
              />
            </TabItem>

            {/* 2. Calendar / Agenda */}
            <TabItem
              isActive={activeTab === 'calendar'}
              onPress={() => handleTabPress('calendar')}
            >
              <CalendarCheckIcon
                size={25}
                color={activeTab === 'calendar' ? '#FFFFFF' : '#D0D7D7'}
              />
            </TabItem>

            {/* 3. Center Plus (Featured Create) */}
            <TabItem
              isActive={activeTab === 'create'}
              onPress={() => handleTabPress('create')}
              isCenter
            >
              <PlusCenterIcon size={56} />
            </TabItem>

            {/* 4. Favorites / Activity */}
            <TabItem
              isActive={activeTab === 'favorites'}
              onPress={() => handleTabPress('favorites')}
            >
              <HeartIcon
                size={26}
                color={activeTab === 'favorites' ? '#FFFFFF' : '#D0D7D7'}
              />
            </TabItem>

            {/* 5. Profile / Account */}
            <TabItem
              isActive={activeTab === 'profile'}
              onPress={() => handleTabPress('profile')}
            >
              <ProfileIcon
                size={25}
                color={activeTab === 'profile' ? '#FFFFFF' : '#D0D7D7'}
              />
            </TabItem>
          </>
        )}
      </View>
    </View>
  );
}

interface TabItemProps {
  children: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
  isCenter?: boolean;
}

function TabItem({ children, isActive, onPress, isCenter }: TabItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabItem,
        isCenter && styles.tabItemCenter,
        pressed && styles.tabItemPressed,
      ]}
      hitSlop={{ top: isCenter ? 28 : 10, bottom: 10, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      {/* Icon — center icons float above the pill via negative marginTop */}
      <View style={[styles.iconWrapper, isCenter && styles.centerIconWrapper]}>
        {children}
      </View>

      {/* Active teal underline bar */}
      <View
        style={[
          styles.indicator,
          isCenter && styles.indicatorCenter,
          isActive ? styles.indicatorActive : styles.indicatorInactive,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A1414',
    width: '76%',
    maxWidth: 410,
    height: 66,
    borderRadius: 35,
    paddingHorizontal: 20,
    // Shadow dark mode — halo blanc subtil
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    // Web fallback — boxShadow CSS
    ...Platform.select({
      web: {
        boxShadow: '0 0 24px 0 rgba(255, 255, 255, 0.10)',
      },
    }),
    // overflow visible so center circle can bubble above the pill
    overflow: 'visible',
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabItemCenter: {
    // allow the center button to extend above the pill
    overflow: 'visible',
    justifyContent: 'flex-end',
    paddingBottom: 6,
    zIndex: 10,
  },
  tabItemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  iconWrapper: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIconWrapper: {
    // Negative marginTop makes the circle pop above the pill top edge
    marginTop: -26,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWithBadge: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#007B7B',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#0A1414',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 12,
  },
  indicator: {
    width: 15,
    marginLeft: 6,
    height: 3.2,
    borderRadius: 2,
    marginTop: 2,
  },
  indicatorCenter: {
    // Indicateur doublé pour les tabs centraux (map / plus)
    width: 30,
    marginLeft: 13,
    height: 3.4,
    borderRadius: 3.2,
    marginTop: 3,
  },
  indicatorActive: {
    backgroundColor: '#007B7B',
  },
  indicatorInactive: {
    backgroundColor: 'transparent',
  },
});
