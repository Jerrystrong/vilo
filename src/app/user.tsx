import DarkHotBg from "@/assets/svg/darkHotBg";
import LandscapeIcon from "@/assets/svg/landScapeIcon";
import LightHotFont from "@/assets/svg/lightHotFont"; 
import BellNotificationIcon from "@/assets/svg/notificationIcon"; 
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind"; 
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text, 
  useColorScheme,
  View,
} from "react-native"; 
cssInterop(LinearGradient, { className: "style" }); 

const dimension = Dimensions.get("window");
const height = dimension.height;
export default function UserScreen() {
  const colorScheme = useColorScheme(); 

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
});
