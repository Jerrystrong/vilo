import DarkHotBg from "@/assets/svg/darkHotBg";
import LightHotFont from "@/assets/svg/lightHotFont";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import { StyleSheet, useColorScheme } from "react-native";

cssInterop(LinearGradient, { className: "style" });

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  return (
    <ThemedView className="bg-whiteBg dark:bg-blackBg" style={styles.container}>
      {/* <WhiteHotFont style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={[
          "rgba(251, 244, 214, 0)",
          "rgba(251, 244, 214, 0.35)",
          "rgba(251, 244, 214, 0.89)",
          "#F4F7F6",
        ]}
        locations={[0, 0.1, 0.25, 0.4]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.bottomGradient}
      /> */}
      {colorScheme === "dark" ? <DarkHotBg /> : <LightHotFont />}

      {/* <SafeAreaView style={styles.safeArea}>
        
      </SafeAreaView> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 190,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
