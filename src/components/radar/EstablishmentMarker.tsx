import { Image, StyleSheet, View } from "react-native";

import Animated, {
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

import { RadarEstablishment } from "./radar.types";

import BarIcon from "@/assets/svg/barIcon";
import RestaurantIcon from "@/assets/svg/restaurantIcon";
import {
    RADAR_CENTER_X,
    RADAR_CENTER_Y,
    RADAR_ORBITS,
} from "./radar.constants";

const ESTABLISHMENT_ICONS = {
  restaurant: require("@/assets/svg/restaurantIcon"),

  bar: require("@/assets/svg/barIcon"),

  hotel: require("@/assets/svg/barIcon"),

  tourist: require("@/assets/svg/barIcon"),
};

type Props = {
  establishment: RadarEstablishment;

  heading: SharedValue<number>;
};

export default function EstablishmentMarker({ establishment, heading }: Props) {
  const { orbit, angle, distance = 1, size = 34 } = establishment;

  const orbitData = RADAR_ORBITS[orbit];

  /**
   * Position originale.
   */
  const initialAngle = angle * (Math.PI / 180);

  const initialX =
    RADAR_CENTER_X + Math.cos(initialAngle) * orbitData.rx * distance;

  const initialY =
    RADAR_CENTER_Y + Math.sin(initialAngle) * orbitData.ry * distance;

  /**
   * ---------------------------------------------------------
   * ANIMATION
   * ---------------------------------------------------------
   */

  const animatedStyle = useAnimatedStyle(() => {
    /**
     * Rotation actuelle de CET établissement.
     */
    const currentAngle = initialAngle - heading.value * (Math.PI / 180);

    /**
     * Nouvelle position sur son orbite.
     */
    const x = RADAR_CENTER_X + Math.cos(currentAngle) * orbitData.rx * distance;

    const y = RADAR_CENTER_Y + Math.sin(currentAngle) * orbitData.ry * distance;

    return {
      transform: [
        {
          translateX: x - initialX,
        },

        {
          translateY: y - initialY,
        },
      ],
    };
  });

  const icon = ESTABLISHMENT_ICONS[establishment.type];

  return (
    <Animated.View
      style={[
        styles.marker,

        {
          left: initialX - size / 2,

          top: initialY - size / 2,

          width: size,
          height: size,
        },

        animatedStyle,
      ]}
    >
      <Image
        source={establishment.image}
        resizeMode="contain"
        style={{
          width: size,
          height: size,
        }}
      />
      <View className=" absolute bottom-0 -right-1 items-center justify-center bg-black rounded-full w-[18px] h-[18px]">
        {establishment.type === "restaurant" && (
          <RestaurantIcon fill="#ffffff" width={12} height={12} />
        )}
        {establishment.type === "bar" && (
          <BarIcon fill="#ffffff" width={12} height={12} />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  marker: {
    position: "absolute",

    alignItems: "center",
    justifyContent: "center",
  },
});
