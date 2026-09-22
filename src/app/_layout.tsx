import "../global.css";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  // personal font Opensans
  const [loaded, error] = useFonts({
    "open-sans": require("../../assets/fonts/OpenSans_Condensed-Regular.ttf"),
    "open-sans-bold": require("../../assets/fonts/OpenSans_Condensed-Bold.ttf"),
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
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      {showAnimatedSplash && (
        <AnimatedSplashOverlay
          onFinish={() => setShowAnimatedSplash(false)}
        />
      )}
    </ThemeProvider>
  );
}
