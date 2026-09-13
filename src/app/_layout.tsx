import "../global.css";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as splashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // personal font Opensans
  const [loaded, error] = useFonts({
    "open-sans": require("../../assets/fonts/OpenSans_Condensed-Regular.ttf"),
    "open-sans-bold": require("../../assets/fonts/OpenSans_Condensed-Bold.ttf"),
  });
  useEffect(() => {
    if (loaded || error) {
      splashScreen.hideAsync();
    }
  }, [loaded, error]);
  if (!loaded && !error) {
    return null;
  }
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
