import Feather from "@expo/vector-icons/Feather";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
 import SettingsIcon from "@/assets/svg/settingsIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
 
export interface TopBarProps {
    title: string;
    handleMorePress: () => void;
    iconName: "more-vertical" | "settings" | "info" | "help";
    iconSize: number; 
    
}

export default function TopBar ({
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
          className="px-4 pb-3 flex-row justify-between items-center"
        >
          <Text  className="text-2xl font-bold dark:text-whiteBg text-blackBg">
            {title}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleMorePress}
            className=""
          >
            {iconName === "more-vertical" && <Feather name="more-vertical" size={iconSize}
             color={colorScheme === "dark" ? "#FFFFFF" : "#292D32"} />}
            {iconName === "settings" && <SettingsIcon
                         width={24}
                         height={24}
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