import LocationAnimation from "@/assets/animated/logo";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useRef } from "react";
import { Animated as RNAnimated, Dimensions, StyleSheet, View } from "react-native";
import Animated, { Easing, Keyframe } from "react-native-reanimated";

const INITIAL_SCALE_FACTOR = Dimensions.get("screen").height / 90;
const DURATION = 1500;

type AnimatedSplashOverlayProps = {
  onFinish?: () => void;
};

export function AnimatedSplashOverlay({
  onFinish,
}: AnimatedSplashOverlayProps) {
  const fadeAnim = useRef(new RNAnimated.Value(1)).current;

  const handleAnimationFinish = () => {
    RNAnimated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      onFinish?.();
    });
  };

  return (
    <RNAnimated.View
      style={[
        styles.splashOverlay,
        { opacity: fadeAnim },
      ]}
    >
      <LocationAnimation onFinish={handleAnimationFinish} />
    </RNAnimated.View>
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: Easing.elastic(0.7),
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: "0deg" }],
  },
  100: {
    transform: [{ rotateZ: "7200deg" }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View
        entering={glowKeyframe.duration(60 * 1000 * 4)}
        style={styles.glow}
      >
        <Image
          style={styles.glow}
          source={require("@/assets/images/logo-glow.png")}
        />
      </Animated.View>

      <Animated.View
        entering={keyframe.duration(DURATION)}
        style={styles.background}
      />
      <Animated.View
        style={styles.imageContainer}
        entering={logoKeyframe.duration(DURATION)}
      >
        <Image
          style={styles.image}
          source={require("@/assets/images/icon.png")}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    width: 201,
    height: 201,
    position: "absolute",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 128,
    height: 128,
    zIndex: 100,
  },
  image: {
    width: 100,
    height: 100,
  },
  background: {
    borderRadius: 40,
    experimental_backgroundImage: `linear-gradient(180deg, #3C9FFE, #0274DF)`,
    width: 128,
    height: 128,
    position: "absolute",
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#007B7B",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
    padding: 32,
  },
});
