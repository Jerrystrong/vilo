import "../global.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { RoleProvider, useUserRole } from "@/context/role-context";
import { TabProvider, useActiveTab } from "@/context/tab-context";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

/**
 * The persistent bottom navigation bar, reads role + activeTab from context.
 * Extracted as its own component so hooks are always called at the top level.
 */
function PersistentTabs() {
  const { role } = useUserRole();
  const { activeTab, setActiveTab } = useActiveTab();

  return (
    <AppTabs
      role={role}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      favoritesBadgeCount={8}
    />
  );
}

/**
 * Inner layout — has access to all providers.
 * AppTabs is rendered here so it floats over all screens.
 */
function AppLayout() {
  const colorScheme = useColorScheme();
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

  const [loaded, error] = useFonts({
    "open-sans": require("../../assets/fonts/OpenSans_Condensed-Regular.ttf"),
    "open-sans-bold": require("../../assets/fonts/OpenSans_Condensed-Bold.ttf"),
    "inter": require("../../assets/fonts/Inter_28pt-Regular.ttf"),
    "inter-bold": require("../../assets/fonts/Inter_24pt-Bold.ttf")
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* Main screen stack */}
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      {/* Floating bottom tab bar — persists across ALL routes */}
      <PersistentTabs />

      {showAnimatedSplash && (
        <AnimatedSplashOverlay
          onFinish={() => setShowAnimatedSplash(false)}
        />
      )}
    </ThemeProvider>
  );
}

/**
 * Root layout — wraps everything with global providers.
 * RoleProvider must wrap TabProvider so TabProvider can read the role.
 */
export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RoleProvider>
        <TabProvider>
          <AppLayout />
        </TabProvider>
      </RoleProvider>
    </GestureHandlerRootView>
  );
}
