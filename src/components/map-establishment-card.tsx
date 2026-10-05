import BarIcon from "@/assets/svg/barIcon";
import RestaurantIcon from "@/assets/svg/restaurantIcon";
import { MapEstablishment } from "@/data/establishments";
import Feather from "@expo/vector-icons/Feather";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

type MapEstablishmentCardProps = {
  establishment: MapEstablishment;
};

const typeLabels = {
  restaurant: "Resto",
  bar: "Bar",
  hotel: "Hotel",
  tourist: "A visiter",
} as const;

export default function MapEstablishmentCard({
  establishment,
}: MapEstablishmentCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const menuImages = establishment.menu?.length
    ? establishment.menu
    : establishment.image
      ? [establishment.image]
      : [];
  const label = typeLabels[establishment.type];

  return (
    <View
      style={styles.card}
      className="border-b-2 dark:border-[#1E2928] border-[#E5E7EB]"
    >
      <View style={styles.heading}>
        {establishment.image ? (
          <Image
            source={establishment.image}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : null}
        <View style={styles.headingContent}>
          {/* etablishment name and type */}
          <View style={styles.nameRow}>
            <Text
              numberOfLines={1}
              style={[styles.name, { color: isDark ? "#F4F7F6" : "#25292B" }]}
            >
              {establishment.name}
            </Text>
            <View
              style={[
                styles.typeBadge,
                {
                  backgroundColor:
                    establishment.type === "bar" ? "#5D3A9B" : "#D94A00",
                },
              ]}
            >
              {establishment.type === "restaurant" ? (
                <RestaurantIcon fill="#FFFFFF" width={16} height={16} />
              ) : (
                <BarIcon fill="#FFFFFF" width={16} height={16} />
              )}
              <Text style={styles.typeLabel}>{label}</Text>
            </View>
          </View>
          <View style={styles.locationRow}>
            <Feather
              name="map-pin"
              size={16}
              color={isDark ? "#C4CFCE" : "#6A7173"}
            />
            <Text
              numberOfLines={1}
              style={[
                styles.location,
                { color: isDark ? "#D7E0DF" : "#60686A" },
              ]}
            >
              {establishment.location ?? "Kinshasa"}
            </Text>
          </View>
        </View>
      </View>

      <Text
        style={[styles.menuTitle, { color: isDark ? "#E7EEEE" : "#535A5C" }]}
      >
        MENU
      </Text>
      {menuImages.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.menuList}
        >
          {menuImages.map((image, index) => (
            <Image
              key={`${establishment.id}-${index}`}
              source={image}
              resizeMode="cover"
              style={styles.menuImage}
            />
          ))}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.emptyMenu,
            { backgroundColor: isDark ? "#1E2928" : "#EEF3F2" },
          ]}
        >
          <Text
            style={[
              styles.emptyMenuText,
              { color: isDark ? "#C4CFCE" : "#6A7173" },
            ]}
          >
            Menu bientot disponible
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  logo: {
    height: 60,
    width: 60,
  },
  headingContent: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  name: {
    flexShrink: 1,
    fontFamily: "inter-bold",
    fontSize: 21,
    lineHeight: 36,
  },
  typeBadge: {
    alignItems: "center",
    borderRadius: 22,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  typeLabel: {
    color: "#FFFFFF",
    fontFamily: "inter-bold",
    fontSize: 15,
    lineHeight: 18,
  },
  locationRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    marginTop: 8,
  },
  location: {
    flex: 1,
    fontFamily: "inter",
    fontSize: 14,
    lineHeight: 23,
  },
  menuTitle: {
    fontFamily: "inter-bold",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 22,
  },
  menuList: {
    gap: 14,
    paddingTop: 14,
  },
  menuImage: {
    borderRadius: 8,
    height: 140,
    width: 140,
  },
  emptyMenu: {
    alignItems: "center",
    borderRadius: 8,
    height: 112,
    justifyContent: "center",
    marginTop: 14,
  },
  emptyMenuText: {
    fontFamily: "inter",
    fontSize: 14,
  },
});
