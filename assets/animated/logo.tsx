import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function LocationAnimation() {
  const pathProgress = useRef(new Animated.Value(0)).current;
  const locationScale = useRef(new Animated.Value(0)).current;
  const locationOpacity = useRef(new Animated.Value(0)).current;

  const player = useAudioPlayer(require("../sounds/notification.wav"));

  // Longueur du path récupérée depuis ton SVG
  const PATH_LENGTH = 499.412;

  useEffect(() => {
    // Animation 1 : dessin du V
    Animated.timing(pathProgress, {
      toValue: 1,
      duration: 500,
      easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) return;

      // Sensor / Retour haptique doux
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

      // Son du beep de notification iPhone
      // try {
      //   player.seekTo(0);
      //   player.play();
      // } catch (e) {
      //   console.log("Audio play error:", e);
      // }
      // Animation 2 : grow de l'icône location
      Animated.parallel([
        Animated.spring(locationScale, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(locationOpacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return;
      });
    });

    // Pas de loop ici
  }, []);

  const strokeDashoffset = pathProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [PATH_LENGTH, 0],
  });

  return (
    <View
      style={{
        width: 500,
        height: 500,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Animation du tracé */}
      <Svg width={500} height={500} viewBox="0 0 500 500" fill="none">
        <AnimatedPath
          d="M195 295C135 255 125 185 180 185C230 185 215 335 262 335C298 335 320 235 298 188"
          stroke="#F4F7F6"
          strokeWidth={32}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${PATH_LENGTH} ${PATH_LENGTH}`}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>

      {/* Location icon : grow après le tracé */}
      <AnimatedView
        style={{
          position: "absolute",
          left: 259,
          top: 168,
          width: 93,
          height: 92,

          opacity: locationOpacity,

          transform: [
            {
              scale: locationScale,
            },
          ],
        }}
      >
        <Svg width={93} height={92} viewBox="0 0 93 92" fill="none">
          {/* Cercle turquoise */}
          <Rect x={0} y={0} width={93} height={92} rx={46} fill="#007B7B" />

          {/* Icône location */}
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="
              M32.559 52.949
              L47 71
              L61.441 52.949
              C64.23 49.462 65.75 45.13 65.75 40.665
              V39.75
              C65.75 29.395 57.355 21 47 21
              C36.645 21 28.25 29.395 28.25 39.75
              V40.665
              C28.25 45.13 29.77 49.462 32.559 52.949Z

              M47 46
              C50.452 46 53.25 43.202 53.25 39.75
              C53.25 36.298 50.452 33.5 47 33.5
              C43.548 33.5 40.75 36.298 40.75 39.75
              C40.75 43.202 43.548 46 47 46Z
            "
            fill="#CC4200"
          />
        </Svg>
      </AnimatedView>
    </View>
  );
}
