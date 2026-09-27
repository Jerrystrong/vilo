import BarIcon from "@/assets/svg/barIcon";
import RestaurantIcon from "@/assets/svg/restaurantIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";
import { RadarEstablishment } from "./radar/radar.types";

interface HotCardProps {
  card: RadarEstablishment;
  variant?: "compact" | "detailed";
}

export default function HotCard({ card, variant = "compact" }: HotCardProps) {
  const colorScheme = useColorScheme();
  const isDetailed = variant === "detailed";
  const textColor = colorScheme === "dark" ? "#F4F7F6" : "#121818";
  const secondaryTextColor = colorScheme === "dark" ? "#D0D7D7" : "#60646C";

  return (
    <View
      style={[
        styles.card,
        isDetailed && styles.detailedCard,
        {
          backgroundColor: colorScheme === "dark" ? "#121818" : "#FFFFFF",
          borderColor: colorScheme === "dark" ? "#3A5E5C" : "#E2E5EA",
        },
      ]}
    >
      <Image
        source={card.image}
        resizeMode="cover"
        style={[styles.image, isDetailed && styles.detailedImage]}
      />
      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={[styles.name, isDetailed && styles.detailedName, { color: textColor }]}
        >
          {card.name}
        </Text>
        <View style={styles.metadata}>
          {card.type === "restaurant" && (
            <View style={styles.metadataItem}>
              <RestaurantIcon fill={secondaryTextColor} width={14} height={14} />
              <Text style={[styles.metadataText, isDetailed && styles.detailedMetadataText, { color: secondaryTextColor }]}>Resto</Text>
            </View>
          )}
          {card.type === "bar" && (
            <View style={styles.metadataItem}>
              <BarIcon fill={secondaryTextColor} width={14} height={14} />
              <Text style={[styles.metadataText, isDetailed && styles.detailedMetadataText, { color: secondaryTextColor }]}>Bar</Text>
            </View>
          )}
          <View style={styles.metadataItem}>
            <Ionicons
              name="location-outline"
              size={14}
              color={secondaryTextColor}
            />
            <Text numberOfLines={1} style={[styles.metadataText, { color: secondaryTextColor }]}>
              {card.location}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 38,
    borderWidth: 2,
    flexDirection: "row",
    gap: 10,
    height: 70,
    overflow: "hidden",
    paddingHorizontal: 10,
    width: "100%",
  },
  detailedCard: {
    height: 88,
    paddingHorizontal: 14,
  },
  image: {
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  detailedImage: {
    borderRadius: 28,
    height: 56,
    width: 56,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: "inter-bold",
    fontSize: 16,
    lineHeight: 20,
  },
  detailedName: {
    fontSize: 18,
    lineHeight: 23,
  },
  metadata: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    marginTop: 5,
  },
  metadataItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    maxWidth: "100%",
  },
  metadataText: {
    fontFamily: "inter",
    fontSize: 10,
    lineHeight: 16,
  },
  detailedMetadataText:{
    fontFamily: "inter",
    fontSize: 12.,
    lineHeight: 16,
  }
});
