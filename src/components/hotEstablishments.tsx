import React from "react";
import { View, useWindowDimensions } from "react-native";
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

const GAP = 12;
const HORIZONTAL_PADDING = 24 * 2; // correspond au mx-6 dans index.tsx (24px de chaque côté)

function AnimatedCardItem({
  item,
  cardWidth,
  relativeProgress,
}: {
  item: any;
  cardWidth: number;
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
          width: cardWidth,
          height: 60,
          marginRight: GAP,
        },
        animatedStyle,
      ]}
    >
      <HotCard card={item} />
    </Animated.View>
  );
}

export default function HotEstablishments({
  establishments,
}: {
  establishments: any[];
}) {
  const { width: screenWidth } = useWindowDimensions();

  // Largeur disponible dans le conteneur parent
  const containerWidth = screenWidth - HORIZONTAL_PADDING;

  // Deux cartes visibles exactement
  const cardWidth = (containerWidth - GAP) / 2;

  // Largeur d'un pas (slide)
  const slideWidth = cardWidth + GAP;

  const progress = useSharedValue(0);

  return (
    <View style={{ width: containerWidth }}>
      <Carousel
        data={establishments}
        itemSize={slideWidth}
        style={{
          width: containerWidth,
          height: 68,
        }}
        animation={{
          type: "spring",
          damping: 20,
          stiffness: 130,
          mass: 0.8,
        }}
        renderItem={({ item, relativeProgress }) => (
          <AnimatedCardItem
            item={item}
            cardWidth={cardWidth}
            relativeProgress={relativeProgress}
          />
        )}
        progress={progress}
        loop={false}
        snapMode="item"
        renderWindowSize={4}
      />

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
        {establishments.map((_, index) => (
          <PaginationDot
            key={index}
            index={index}
            progress={progress}
          />
        ))}
      </View>
    </View>
  );
}