import React, { useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { Animated, Easing, View } from "react-native";
import Svg, { ClipPath, Defs, Path } from "react-native-svg";

// Filtre la prop `collapsable` (React Native only) pour éviter
// le warning DOM sur web quand Animated l'injecte dans un SVG Path.
const WebSafePath = React.forwardRef<any, any>(
  ({ collapsable: _c, ...props }, ref) => <Path {...props} ref={ref} />
);
WebSafePath.displayName = "WebSafePath";

const AnimatedPath = Animated.createAnimatedComponent(WebSafePath as any);
const AnimatedView = Animated.createAnimatedComponent(View);

type LocationAnimationProps = {
  onFinish?: () => void;
};

export default function LocationAnimation({ onFinish }: LocationAnimationProps = {}) {
  const pathProgress = useRef(new Animated.Value(0)).current;
  const locationScale = useRef(new Animated.Value(0)).current;
  const locationOpacity = useRef(new Animated.Value(0)).current;

  /*
   * Longueur du nouveau tracé SVG.
   * Utilisée pour l'animation strokeDashoffset.
   */
  const PATH_LENGTH = 390;

  useEffect(() => {
    /*
     * Animation 1 :
     * dessin progressif du tracé turquoise
     */
    Animated.timing(pathProgress, {
      toValue: 1,
      duration: 1200,
      easing: Easing.bezier(0.27, 0.17, 0.83, 0.67),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) return;

      /*70
       * Retour haptique une fois
       * que le tracé est terminé.
       */
      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light
      ).catch(() => {});

      /*
       * Son de notification
       *
       * Décommente si nécessaire :
       *
       * try {
       *   player.seekTo(0);
       *   player.play();
       * } catch (e) {
       *   console.log("Audio play error:", e);
       * }
       */

      /*
       * Animation 2 :
       * apparition du pin de localisation.
       */
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
      ]).start(() => {
        setTimeout(() => {
          onFinish?.();
        }, 400);
      });
    });
  }, [onFinish]);

  /*
   * Animation du tracé :
   * de complètement caché → complètement visible.
   */
  const strokeDashoffset = pathProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [PATH_LENGTH, 0],
  });

  return (
    <View
      style={{
        width: 191,
        height: 159,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      {/* =====================================================
          TRACÉ TURQUOISE
          ===================================================== */}

      <Svg
        width={191}
        height={159}
        viewBox="0 0 255 212"
        fill="none"
      >
        <Defs>
          <ClipPath id="notchCutout">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="
                M -50 -50 H 300 V 300 H -50 Z
                M 176 79
                A 15 15 0 0 0 176 109
                A 15 15 0 0 0 176 79
                Z
              "
            />
          </ClipPath>
        </Defs>

        <AnimatedPath
          clipPath="url(#notchCutout)"
          d="
            M 86 112

            C 74 109
              63 99
              62 86

            C 60 72
              66 61
              77 56

            C 89 50
              101 57
              106 70

            C 112 86
              112 107
              119 128

            C 125 148
              132 163
              143 164

            C 157 165
              166 147
              171 128

            C 173 121
              175 114
              176 108
          "
          stroke="#F4F7F6"
          strokeWidth={21}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${PATH_LENGTH} ${PATH_LENGTH}`}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>

      {/* =====================================================
          PIN DE LOCALISATION
          Apparaît après le tracé
          ===================================================== */}

      <AnimatedView
        style={{
          position: "absolute",

          /*
           * Position exacte du pin
           * centré au-dessus de l'extrémité creusée.
           */
          left: 123,
          top: 47,

          width: 24,
          height: 32,

          opacity: locationOpacity,

          transform: [
            {
              scale: locationScale,
            },
          ],
        }}
      >
        <Svg
          width={24}
          height={32}
          viewBox="0 0 24 32"
          fill="none"
        >
          {/*
           * Pin orange.
           *
           * fillRule="evenodd" permet de créer
           * directement le trou central sans
           * ajouter de cercle blanc.
           *
           * Le trou est donc réellement transparent.
           */}
          <Path
            fill="#CC4200"
            fillRule="evenodd"
            clipRule="evenodd"
            d="
              M 12 0.5

              C 5.65 0.5
                0.5 5.65
                0.5 12

              C 0.5 20.1
                12 31.5
                12 31.5

              C 12 31.5
                23.5 20.1
                23.5 12

              C 23.5 5.65
                18.35 0.5
                12 0.5

              Z

              M 12 8.1

              C 9.85 8.1
                8.1 9.85
                8.1 12

              C 8.1 14.15
                9.85 15.9
                12 15.9

              C 14.15 15.9
                15.9 14.15
                15.9 12

              C 15.9 9.85
                14.15 8.1
                12 8.1

              Z
            "
          />
        </Svg>
      </AnimatedView>
    </View>
  );
}
