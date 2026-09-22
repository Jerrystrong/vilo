import React from "react";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useUserRole } from "@/context/role-context";
import { useActiveTab } from "@/context/tab-context";

export default function HomeScreen() {
  const { role, setRole } = useUserRole();
  const { setActiveTab } = useActiveTab();

  const handleRoleChange = (newRole: "user" | "etab") => {
    setRole(newRole);
    // Reset active tab to the default of the new role
    setActiveTab(newRole === "user" ? "flame" : "stats");
  };

  return (
    <ThemedView className="bg-whiteBg dark:bg-blackBg" style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {/* Role Switcher */}
          <View style={styles.header}>
            <View style={styles.roleSwitcherContainer}>
              <Pressable
                onPress={() => handleRoleChange("user")}
                style={[
                  styles.rolePill,
                  role === "user" && styles.rolePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.rolePillText,
                    role === "user" && styles.rolePillTextActive,
                  ]}
                >
                  👤 Utilisateur (Normal)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleRoleChange("etab")}
                style={[
                  styles.rolePill,
                  role === "etab" && styles.rolePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.rolePillText,
                    role === "etab" && styles.rolePillTextActive,
                  ]}
                >
                  🏢 Établissement (etab)
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: 120,
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    width: "100%",
    gap: Spacing.four,
  },
  header: {
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  roleSwitcherContainer: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 30,
    padding: 4,
    marginTop: 12,
    gap: 4,
  },
  rolePill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  rolePillActive: {
    backgroundColor: "#007B7B",
    shadowColor: "#007B7B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  rolePillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A5568",
  },
  rolePillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
