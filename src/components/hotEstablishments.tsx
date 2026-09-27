import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text, useColorScheme, useWindowDimensions, View } from "react-native";
import { Carousel } from "react-native-reanimated-carousel";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import HotCard from "./hotCard";
import PaginationDot from "./PaginationDot";
import { RadarEstablishment } from "./radar/radar.types";

const GAP = 6;
const HORIZONTAL_PADDING = 16 * 2; // correspond au mx-6 dans index.tsx (24px de chaque côté)
const LIST_BUTTON_SIZE = 32;

function AnimatedCardPage({
  page,
  cardWidth,
  pageWidth,
  relativeProgress,
}: {
  page: RadarEstablishment[];
  cardWidth: number;
  pageWidth: number;
  relativeProgress: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Math.abs(relativeProgress.value),
      [0, 1],
      [1, 0.95],
      "clamp"
    );
    const opacity = interpolate(
      Math.abs(relativeProgress.value),
      [0, 1],
      [1, 0.82],
      "clamp"
    );

    return {
      transform: [
        {
          scale: withSpring(scale, {
            damping: 20,
            stiffness: 160,
          }),
        },
      ],
      opacity: withTiming(opacity, { duration: 150 }),
    };
  });

  return (
    <Animated.View
      style={[
        {
          flexDirection: "row",
          gap: GAP,
          height: 70,
          width: pageWidth,
        },
        animatedStyle,
      ]}
    >
      {page.map((card) => (
        <View key={card.id} style={{ width: cardWidth }}>
          <HotCard card={card} />
        </View>
      ))}
    </Animated.View>
  );
}

export default function HotEstablishments({
  establishments,
}: {
  establishments: RadarEstablishment[];
}) {
  const { width: screenWidth } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "75%"], []);

  // Largeur disponible dans le conteneur parent
  const containerWidth = screenWidth - HORIZONTAL_PADDING;
  const carouselWidth = containerWidth - GAP;

  // Deux cartes visibles exactement
  const cardWidth = (carouselWidth - GAP) / 2;
  const cardPages = useMemo(() => {
    const pages: RadarEstablishment[][] = [];

    for (let index = 0; index < establishments.length; index += 2) {
      pages.push(establishments.slice(index, index + 2));
    }

    return pages;
  }, [establishments]);

  const progress = useSharedValue(0);
  const openAllEstablishments = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <View style={{ width: containerWidth }}>
      <View style={styles.cardsRow}>
        <Carousel
          data={cardPages}
          itemSize={carouselWidth}
          style={{ width: carouselWidth, height: 70 }}
          animation={{
            type: "spring",
            damping: 20,
            stiffness: 130,
            mass: 0.8,
          }}
          renderItem={({ item: page, relativeProgress }) => (
            <AnimatedCardPage
              page={page}
              cardWidth={cardWidth}
              pageWidth={carouselWidth}
              relativeProgress={relativeProgress}
            />
          )}
          progress={progress}
          loop={false}
          snapMode="page"
          renderWindowSize={4}
        />
        <Pressable
          accessibilityHint="Ouvre la liste de tous les établissements proches"
          accessibilityLabel="Voir tous les établissements"
          accessibilityRole="button"
          onPress={openAllEstablishments}
          style={[
            styles.listButton,
            { backgroundColor: colorScheme === "dark" ? "#212225" : "#F8FAFA" },
          ]}
        >
          <View style={styles.containerTiret}>
            <View style = {[styles.tiret, {backgroundColor : colorScheme === "dark" ? "#F4F7F6" : "#121818"}]}></View>
            <View style = {[styles.tiret, {width : 10, backgroundColor : colorScheme === "dark" ? "#F4F7F6" : "#121818"}]}></View>
            <View style = {[styles.tiret, {backgroundColor : colorScheme === "dark" ? "#F4F7F6" : "#121818"}]}></View>
          </View>
        </Pressable>
      </View>

      {/* Pagination */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 14,
          gap: 8,
        }}
      >
        {cardPages.map((_, index) => (
          <PaginationDot
            key={index}
            index={index}
            progress={progress}
          />
        ))}
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#121818" : "#FFFFFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          borderColor: '#769E9B',
          borderWidth: 2,
          overflow: "hidden",
        }}
        handleIndicatorStyle={{ backgroundColor: colorScheme === "dark" ? "#769E9B" : "#A8C0C0" }}
      >
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: colorScheme === "dark" ? "#F4F7F6" : "#121818" }]}>
            Établissements proches
          </Text>
          <Text style={[styles.sheetSubtitle, { color: colorScheme === "dark" ? "#B7CCC9" : "#60646C" }]}>
            {establishments.length} adresses à découvrir
          </Text>
        </View>
        <BottomSheetFlatList
          data={establishments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sheetList}
          renderItem={({ item }) => <HotCard card={item} variant="detailed" />}
          ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        />
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: GAP,
  },
  listButton: {
    alignItems: "center",
    borderRadius: LIST_BUTTON_SIZE / 2,
    elevation: 5,
    height: LIST_BUTTON_SIZE,
    justifyContent: "center",
    shadowColor: "#244240",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    width: LIST_BUTTON_SIZE,
    position: "absolute",
    right: 0,
  },
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
  containerTiret: {
    alignItems: "center",
    flexDirection: "column",
    gap: 2,
    justifyContent: "center",
  },
  tiret: {
    borderRadius: 2,
    height: 2,
    width: 12,
  },
});
