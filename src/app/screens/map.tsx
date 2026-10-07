import BarIcon from "@/assets/svg/barIcon";
import RestaurantIcon from "@/assets/svg/restaurantIcon";
import EstablishmentsMap from "@/components/establishments-map";
import MapEstablishmentCard from "@/components/map-establishment-card";
import BuildingIcon, { FireIcon } from "@/components/tab-icons";
import { establishments } from "@/data/establishments";
import Feather from "@expo/vector-icons/Feather";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
type FilterType = "tous" | "restaurant" | "bar" | "hotel";

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const snapPoints = useMemo(() => ["25%", "85%"], []);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("tous");

  const filteredEstablishments = useMemo(() => {
    if (selectedFilter === "tous") return establishments;
    return establishments.filter((e) => e.type === selectedFilter);
  }, [selectedFilter]);
  return (
    <View style={styles.container}>
      <EstablishmentsMap establishments={establishments} />

      <SafeAreaView pointerEvents="box-none" style={styles.overlay}>
        <View className="flex flex-row items-center justify-between px-5">
          <View style={styles.header}>
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
            <View>
              <Text className="font-bold text-[21px] dark:text-whiteBg text-darkBg">
                Map
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {}}
              className="bg-whiteBg dark:blackBg p-2 rounded-full flex items-center justify-center"
              style={{
                boxShadow: `0px 4px 4px ${colorScheme === "dark" ? "#25272D" : "#D1D5DB"}`,
                backgroundColor: `${colorScheme === "dark" ? "#111827" : "#F4F7F6"}`,
              }}
            >
              <FireIcon color="#E81515" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <BottomSheet
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#121818" : "#FFFFFF",
        }}
        handleIndicatorStyle={{
          backgroundColor: colorScheme === "dark" ? "#769E9B" : "#A8C0C0",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            gap: 12,
            height: 42,
          }}
        >
          {/* Tous */}
          <TouchableOpacity
            onPress={() => setSelectedFilter("tous")}
            className={`rounded-full px-5 py-2 w-fit h-[36px] justify-center transition duration-300 ${
              selectedFilter === "tous"
                ? "bg-primary_color"
                : "bg-[#E5E7EB] dark:bg-[#7F8288]"
            }`}
          >
            <Text
              className={`font-bold text-[16px] ${
                selectedFilter === "tous"
                  ? "text-whiteBg"
                  : "text-[rgba(17,24,39)] opacity-70 dark:text-[#F3F4F6]"
              }`}
            >
              Tous
            </Text>
          </TouchableOpacity>

          {/* Restaurant */}
          <TouchableOpacity
            onPress={() => setSelectedFilter("restaurant")}
            className={`rounded-full px-3 py-2 w-fit h-[36px] flex flex-row items-center transition duration-300 gap-2 ${
              selectedFilter === "restaurant"
                ? "bg-primary_color"
                : "bg-[#E5E7EB] dark:bg-[#7F8288]"
            }`}
          >
            <RestaurantIcon
              fill={
                selectedFilter === "restaurant"
                  ? "#FFFFFF"
                  : colorScheme === "dark"
                    ? "#F3F4F6"
                    : "rgba(17, 24, 39)"
              }
              width={16}
              height={16}
            />
            <Text
              className={`text-[16px] ${
                selectedFilter === "restaurant"
                  ? "text-whiteBg font-bold"
                  : "text-[rgba(17,24,39)] opacity-70 dark:text-[#F3F4F6]"
              }`}
            >
              Restaurant
            </Text>
          </TouchableOpacity>

          {/* Bar */}
          <TouchableOpacity
            onPress={() => setSelectedFilter("bar")}
            className={`rounded-full px-3 py-2 w-fit h-[36px] flex transition duration-300 flex-row items-center gap-2 ${
              selectedFilter === "bar"
                ? "bg-primary_color"
                : "bg-[#E5E7EB] dark:bg-[#7F8288]"
            }`}
          >
            <BarIcon
              fill={
                selectedFilter === "bar"
                  ? "#FFFFFF"
                  : colorScheme === "dark"
                    ? "#F3F4F6"
                    : "rgba(17, 24, 39)"
              }
              width={16}
              height={16}
            />
            <Text
              className={`text-[16px] ${
                selectedFilter === "bar"
                  ? "text-whiteBg font-bold"
                  : "text-[rgba(17,24,39)] opacity-70 dark:text-[#F3F4F6]"
              }`}
            >
              Bar
            </Text>
          </TouchableOpacity>

          {/* Hôtel */}
          <TouchableOpacity
            onPress={() => setSelectedFilter("hotel")}
            className={`rounded-full px-3 py-2 w-fit h-[36px] flex flex-row transition duration-300 items-center gap-2 ${
              selectedFilter === "hotel"
                ? "bg-primary_color"
                : "bg-[#E5E7EB] dark:bg-[#7F8288]"
            }`}
          >
            <BuildingIcon
              fill={
                selectedFilter === "hotel"
                  ? "#FFFFFF"
                  : colorScheme === "dark"
                    ? "#F3F4F6"
                    : "rgba(17, 24, 39)"
              }
              width={16}
              height={16}
            />
            <Text
              className={`text-[16px] ${
                selectedFilter === "hotel"
                  ? "text-whiteBg font-bold"
                  : "text-[rgba(17,24,39)] opacity-70 dark:text-[#F3F4F6]"
              }`}
            >
              Hôtel
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {filteredEstablishments.length > 0 ? (  
        <BottomSheetFlatList
          data={filteredEstablishments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sheetList}
          renderItem={({ item }) => (
            <MapEstablishmentCard establishment={item} />
          )}
          ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        />
        ) : (
          <View>
            <Text className="dark:text-whiteBg text-darkBg">Aucun etablissement trouvé</Text>
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  header: {
    alignItems: "center",
    // backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 18,
    flexDirection: "row",
    gap: 1,
    marginTop: 8,
    // padding: 12,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#007B7B",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  backText: {
    color: "white",
    fontSize: 30,
    lineHeight: 32,
    marginTop: -3,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 2,
  },
  title: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "700",
  },
  // bottomsheet style
  sheetHeader: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  sheetTitle: {
    fontFamily: "inter-bold",
    fontSize: 20,
    lineHeight: 25,
  },
  sheetSubtitle: {
    fontFamily: "inter",
    fontSize: 14,
    marginTop: 4,
  },
  sheetList: {
    padding: 18,
  },
  listSeparator: {
    height: 12,
  },
});
