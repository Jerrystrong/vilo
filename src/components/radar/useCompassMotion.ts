import * as Location from "expo-location";
import { useEffect } from "react";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Platform } from "react-native";

/** Durée d'un tour complet pour la rotation automatique Android (en ms). */
const AUTO_ROTATION_DURATION = 30_000;

function normalizeAngle(angle: number) {
  const result = angle % 360;

  return result < 0 ? result + 360 : result;
}

function shortestDelta(current: number, previous: number) {
  let delta = current - previous;

  if (delta > 180) {
    delta -= 360;
  } else if (delta < -180) {
    delta += 360;
  }

  return delta;
}

/**
 * Sur Android : rotation automatique infinie des établissements (360° en
 * AUTO_ROTATION_DURATION ms, vitesse constante).
 * Sur iOS : suit le cap magnétique de la boussole.
 */
export function useCompassHeading() {
  const heading = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS === "android") {
      // Rotation automatique infinie : de 0 à 360° en boucle
      heading.value = withRepeat(
        withTiming(360, {
          duration: AUTO_ROTATION_DURATION,
          easing: Easing.linear,
        }),
        -1, // infini
        false, // pas de retour arrière
      );
      return;
    }

    // ── iOS : boussole ──────────────────────────────────────────────────────
    let mounted = true;
    let subscription: Location.LocationSubscription | null = null;
    let previousHeading: number | null = null;
    let accumulatedHeading = 0;

    const start = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (!mounted || status !== "granted") {
        return;
      }

      subscription = await Location.watchHeadingAsync(
        ({ magHeading }) => {
          if (!mounted || !Number.isFinite(magHeading)) {
            return;
          }

          const nextHeading = normalizeAngle(magHeading);

          if (previousHeading === null) {
            previousHeading = nextHeading;
            accumulatedHeading = nextHeading;
            heading.value = nextHeading;
            return;
          }

          const delta = shortestDelta(nextHeading, previousHeading);
          previousHeading = nextHeading;

          if (Math.abs(delta) < 1) {
            return;
          }

          accumulatedHeading += delta;
          heading.value = withTiming(accumulatedHeading, {
            duration: 120,
            easing: Easing.out(Easing.quad),
          });
        },
        () => {
          heading.value = 0;
        },
      );

      if (!mounted) {
        subscription.remove();
      }
    };

    start().catch(() => {
      heading.value = 0;
    });

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, [heading]);

  return { heading };
}
