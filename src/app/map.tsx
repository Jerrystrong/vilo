import BarIcon from "@/assets/svg/barIcon";
import RestaurantIcon from "@/assets/svg/restaurantIcon";
import EstablishmentsMap from "@/components/establishments-map";
import MapEstablishmentCard from "@/components/map-establishment-card";
import BuildingIcon, { FireIcon } from "@/components/tab-icons";
import { establishments } from "@/data/establishments";
import Feather from "@expo/vector-icons/Feather";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
export default function MapScreen() {
  const colorScheme = useColorScheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "75%"], []);

  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);
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
              onPress={() => bottomSheetModalRef.current?.present()}
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
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
            height: 36,
          }}
        >
          <TouchableOpacity
            onPress={() => {}}
            className="bg-primary_color rounded-full px-5 py-2 w-fit h-fit "
          >
            <Text className="font-bold text-[16px] text-whiteBg">Tous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            className="bg-[#E5E7EB] dark:bg-[#7F8288] rounded-full px-3 py-2 w-fit h-fit flex flex-row items-center gap-2"
          >
            <RestaurantIcon
              fill={colorScheme === "dark" ? "#F3F4F6" : "rgba(17, 24, 39)"}
              width={16}
              height={16}
            />
            <Text className="text-[16px] text-[rgba(17, 24, 39)] opacity-70  dark:text-[#F3F4F6]">
              Restaurant
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            className="bg-[#E5E7EB] dark:bg-[#7F8288] rounded-full px-3 py-2 w-fit h-fit flex flex-row items-center gap-2"
          >
            <BarIcon
              fill={colorScheme === "dark" ? "#F3F4F6" : "rgba(17, 24, 39)"}
              width={16}
              height={16}
            />
            <Text className="text-[16px] text-[rgba(17, 24, 39)] opacity-70  dark:text-[#F3F4F6]">
              Bar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            className="bg-[#E5E7EB] dark:bg-[#7F8288] rounded-full px-3 py-2 w-fit h-fit flex flex-row items-center gap-2"
          >
            <BuildingIcon
              fill={colorScheme === "dark" ? "#F3F4F6" : "rgba(17, 24, 39)"}
              width={16}
              height={16}
            />
            <Text className="text-[16px] text-[rgba(17, 24, 39)] opacity-70 dark:text-[#F3F4F6]">
              Hôtel
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <BottomSheetFlatList
          data={establishments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sheetList}
          renderItem={({ item }) => <MapEstablishmentCard establishment={item} />}
          ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        />
      </BottomSheetModal>
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
    padding: 24,
    paddingTop: 18,
  },
  listSeparator: {
    height: 12,
  },
});
