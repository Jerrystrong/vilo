import DarkHotBg from "@/assets/svg/darkHotBg";
import LightHotFont from "@/assets/svg/lightHotFont";
import EstablishmentRadar from "@/components/radar/EstablishmentRadar";
import { RadarEstablishment } from "@/components/radar/radar.types";
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import { StyleSheet, useColorScheme, View } from "react-native";

cssInterop(LinearGradient, { className: "style" });
const establishments: RadarEstablishment[] = [
  {
    id: "1",
    type: "restaurant",
    orbit: 1,
    angle: 320,
    size: 34,
  },

  {
    id: "2",
    type: "restaurant",
    orbit: 2,
    angle: 40,
    size: 34,
  },

  {
    id: "3",
    type: "bar",
    orbit: 1,
    angle: 145,
    size: 34,
  },

  {
    id: "4",
    type: "tourist",
    orbit: 1,
    angle: 220,
    size: 34,
  },
  {
    id: "5",
    type: "bar",
    orbit: 3,
    angle: 205,
    size: 34,
  },
  {
    id: "6",
    type: "bar",
    orbit: 3,
    angle: 15,
    size: 34,
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  return (
    <ThemedView
      className="flex-1 bg-whiteBg dark:bg-blackBg"
      style={styles.container}
    >
      {colorScheme === "dark" ? <DarkHotBg /> : <LightHotFont />}

      <View style={styles.radarContainer}>
        <EstablishmentRadar
          establishments={establishments}
          width={340}
          enableTilt
        />
      </View>

      {/* tes autres composants */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "visible",
  },

  radarContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,

    height: 700,

    alignItems: "center",
    justifyContent: "center",

    overflow: "visible",

    zIndex: 20,
  },
});
