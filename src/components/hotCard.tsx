import BarIcon from "@/assets/svg/barIcon";
import RestaurantIcon from "@/assets/svg/restaurantIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Text, useColorScheme, View } from "react-native";
import { RadarEstablishment } from "./radar/radar.types";

interface HotCardProps {
  card: RadarEstablishment;
}

export default function HotCard({ card }: HotCardProps) {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        height: 60,
        borderRadius: 70,
        borderWidth: 1,
        borderColor: colorScheme === "dark" ? "#9CA3AF" : "#9CA3AF",
        paddingHorizontal: 25,
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 9,
        paddingLeft: 9,
        width: "100%",
        gap: 9,
        overflow: "hidden",
      }}
      className=" dark:bg-blackBg bg-whiteBg"
    >
      {/* image */}
      <Image
        source={card.image}
        width={32}
        height={32}
        resizeMode="cover"
        className="w-[32px] h-[32px]"
      />
      <View>
        {/* nom */}
        <Text className="font-bold dark:text-whiteBg text-blackBg">
          {card.name}
        </Text>
        <View className="flex flex-row gap-1 items-center justify-between mt-2">
          {/* catégorie */}
          {card.type === "restaurant" && (
            <View className="flex flex-row gap-1 items-center">
              <RestaurantIcon
                fill={colorScheme === "dark" ? "#fff" : "#121818"}
                width={12}
                height={12}
              />
              <Text className="dark:text-whiteBg text-blackBg text-[11px]">
                Resto
              </Text>
            </View>
          )}
          {card.type === "bar" && (
            <View className="flex flex-row gap-1 items-center">
              <BarIcon
                fill={colorScheme === "dark" ? "#fff" : "#121818"}
                width={12}
                height={12}
              />
              <Text className="dark:text-whiteBg text-blackBg text-[11px]">
                Bar
              </Text>
            </View>
          )}
          {/* localisation */}
          <View className="flex flex-row gap-1 items-center">
            <Ionicons
              name="location-outline"
              size={12}
              color={colorScheme === "dark" ? "#fff" : "#121818"}
            />
            <Text className="dark:text-whiteBg text-blackBg text-[11px]">
              {card.location}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
