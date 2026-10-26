import Feather from "@expo/vector-icons/Feather";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
 import SettingsIcon from "@/assets/svg/settingsIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
 
export interface TopBarProps {
    title: string;
    handleMorePress: () => void;
    iconName: "more-vertical" | "settings" | "info" | "help";
    iconSize: number; 
    
}

export default function TopBarBack ({
    title,
    handleMorePress,
    iconName,
    iconSize, 
} : TopBarProps ) {
    const colorScheme = useColorScheme(); 
      const insets = useSafeAreaInsets();
    return (
         <View
          style={{
            paddingTop: Math.max(insets.top, 40),
          }}
          className="px-2 pb-3 flex-row justify-between items-center"
        >
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
                  <Text className="text-2xl font-bold dark:text-whiteBg text-blackBg">{title}</Text>
                 </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleMorePress}
            className=""
          >
            {iconName === "more-vertical" && <Feather name="more-vertical" size={iconSize}
             color={colorScheme === "dark" ? "#FFFFFF" : "#292D32"} />}
            {iconName === "settings" && <SettingsIcon
                         width={22}
                         height={22}
                         color={colorScheme === "dark" ? "#FFFFFF" : "#292D32"}
                       />}
            {iconName === "info" && <Feather name="info"  size={iconSize}
             color={colorScheme === "dark" ? "#FFFFFF" : "#292D32"} />}
            {iconName === "help" && <Ionicons name="help-circle-outline" size={iconSize}
             color={colorScheme === "dark" ? "#FFFFFF" : "#292D32"}  />}
          </TouchableOpacity>
        </View>
    )
}