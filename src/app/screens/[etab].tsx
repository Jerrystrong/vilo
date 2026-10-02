import DarkHotBg from "@/assets/svg/darkHotBg";
import DotIcon from "@/assets/svg/dotIcon";
import LightHotFont from "@/assets/svg/lightHotFont";  
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { cssInterop } from "nativewind"; 
import { establishments } from "@/data/establishments";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text, 
  TouchableOpacity, 
  useColorScheme,
  View,
} from "react-native"; 
import { Colors } from "@/constants/theme";
import Feather from "@expo/vector-icons/Feather";
cssInterop(LinearGradient, { className: "style" }); 



const dimension = Dimensions.get("window");
const height = dimension.height;
export default function EtabScreen() {
  const colorScheme = useColorScheme(); 
  const { id } = useLocalSearchParams<{ id : string }>(); 
  const etab = establishments.find((etab) => etab.id === id); 
  return (
    <ThemedView
      className="flex-1 bg-whiteBg dark:bg-blackBg"
      style={styles.container}
    > 

      {/* header of page */}
      <View className="mt-[50px] mx-4 flex flex-row justify-between items-center">
       <View className="flex flex-row items-center justify-center ">
        <TouchableOpacity
              accessibilityLabel="Retour"
              onPress={() => router.back()}
            >
              <Feather
                name="chevron-left"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </TouchableOpacity>
        <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg">{etab?.name}</Text>
       </View>
        <View className="flex flex-row gap-2 items-center">
           <DotIcon
        style={{ width: 20, height: 20 }} width={24} height={24} // Ajusta el tamaño según tu necesidad
        fill={colorScheme === "dark" ? Colors.light.background : Colors.dark.background} // O el color que desees
        
      />
        </View>
      </View>
      {/* header end */} 
      <View className="flex-1">
        <ScrollView className="px-4">
           <View className="flex flex-row mt-[20px]  items-center gap-4">
          <Image
            source={etab?.image}
            resizeMode="cover"
            width={100}
            height={100}
            className="w-[100px] h-[100px] rounded-full"
          />
          <View>
            <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg">
              {etab?.name} 
            </Text>
            <Text className="text-[#9DA3AF] text-[14px]">{etab?.location} Gombe Righini n 109</Text>
              <View className="flex flex-row items-center gap-2 mt-1">
                <TouchableOpacity><Text className="text-[#9DA3AF] text-[14px] py-1">1k abonnés</Text></TouchableOpacity>
                <TouchableOpacity><Text className="text-primary_color text-[14px] py-1 pl-2">Plus d'info</Text></TouchableOpacity>
        </View>
          </View>
        </View>
        </ScrollView>
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
});
