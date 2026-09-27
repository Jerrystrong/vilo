import EstablishmentsMap from "@/components/establishments-map";
import { establishments } from "@/data/establishments";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function MapScreen() {
  return (
    <View style={styles.container}>
      <EstablishmentsMap establishments={establishments} />

      <SafeAreaView pointerEvents="box-none" style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityLabel="Retour"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Établissements</Text>
            <Text style={styles.subtitle}>
              {establishments.length} lieux sur la carte
            </Text>
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
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
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
