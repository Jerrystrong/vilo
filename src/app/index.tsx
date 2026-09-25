import DarkHotBg from "@/assets/svg/darkHotBg";
import LandscapeIcon from "@/assets/svg/landScapeIcon";
import LightHotFont from "@/assets/svg/lightHotFont";
import BellNotificationIcon from "@/assets/svg/notificationIcon";
import HotEstablishments from "@/components/hotEstablishments";
import EstablishmentRadar from "@/components/radar/EstablishmentRadar";
import { RadarEstablishment } from "@/components/radar/radar.types";
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
cssInterop(LinearGradient, { className: "style" });
const establishments: RadarEstablishment[] = [
  {
    id: "1",
    type: "restaurant",
    name: "Big bite",
    orbit: 1,
    angle: 320,
    size: 34,
    image: require("@/assets/images/bigbite.png"),
    location: "Gombe",
  },

  {
    id: "2",
    type: "restaurant",
    name: "Big bite mall",
    orbit: 2,
    angle: 40,
    size: 34,
    image: require("@/assets/images/bbmal.png"),
    location: "kinshasa",
  },

  {
    id: "3",
    type: "bar",
    name: "Le club",
    orbit: 1,
    angle: 145,
    size: 34,
    image: require("@/assets/images/leclub.png"),
    location: "Lemba",
  },
  {
    id: "4",
    type: "bar",
    name: "Bibi bar",
    orbit: 1,
    angle: 101,
    size: 34,
    image: require("@/assets/images/bigbite.png"),
    location: "matonge",
  },

  {
    id: "6",
    type: "bar",
    name: "Les jeunes",
    orbit: 3,
    angle: 15,
    size: 34,
    image: require("@/assets/images/bbmal.png"),
    location: "Gombe",
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const progress = useSharedValue<number>(0);
  return (
    <ThemedView
      className="flex-1 bg-whiteBg dark:bg-blackBg"
      style={styles.container}
    >
      {colorScheme === "dark" ? <DarkHotBg /> : <LightHotFont />}

      {/* header of page */}
      <View className="mt-[50px] mx-4 flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-4">
          <Image
            source={require("@/assets/images/currentUser.png")}
            resizeMode="cover"
            width={50}
            height={50}
            className="w-[50px] h-[50px] rounded-full"
          />
          <View>
            <Text className="text-[#9DA3AF] text-[14px]">Bienvenu(e),</Text>
            <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg">
              Annette
            </Text>
          </View>
        </View>
        <View className="flex flex-row gap-2 items-center">
          <View className="w-[40px] h-[40px] border border-icon_tint rounded-full items-center justify-center relative">
            <View className="" style={styles.pulse} />
            <BellNotificationIcon stroke="#4B5563" width={18} height={18} />
          </View>
          <LandscapeIcon width={36} height={36} />
        </View>
      </View>
      {/* header end */}
      {/* establishment radar */}
      <View style={styles.radarContainer}>
        <EstablishmentRadar
          establishments={establishments}
          width={340}
          enableTilt
        />
      </View>
      {/* radar end */}
      {/* listed nearest etablishment */}
      <View className="mx-6">
        <Text className="font-bold text-[16px] font-inter-bold dark:text-whiteBg text-blackBg">
          Plus près de vous
        </Text>
        <View className="mt-3">
          {/* <Carousel
            width={330}
            height={140}
            data={establishments}
            renderItem={({ item }) => <HotCard card={item} />}
            mode="parallax"
            progress={progress}
            modeConfig={{
              parallaxScrollingScale: 0.92,
              parallaxScrollingOffset: 45,
              parallaxAdjacentItemScale: 0.85,
            }}
          /> */}
          <HotEstablishments establishments={establishments} />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "visible",
  },
  pulse: {
    position: "absolute",
    width: 7,
    height: 7,
    backgroundColor: "#80BDBD",
    borderColor: "white",
    zIndex: 50,
    top: 0,
    right: 4,
    borderRadius: 50,
  },

  radarContainer: {
    // position: "absolute",
    // top: 50,
    // left: 0,
    // right: 0,

    height: 550,

    alignItems: "center",
    justifyContent: "center",

    overflow: "visible",

    zIndex: 20,
  },
});
