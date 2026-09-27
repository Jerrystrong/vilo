import EstablishmentsMap from "@/components/establishments-map";
import { FireIcon } from "@/components/tab-icons";
import { establishments } from "@/data/establishments";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function MapScreen() {
  const colorScheme = useColorScheme();
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
              {/* <Text style={styles.subtitle}>
              {establishments.length} lieux sur la carte
            </Text> */}
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
});
