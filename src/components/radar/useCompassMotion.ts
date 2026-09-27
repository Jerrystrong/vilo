import * as Location from "expo-location";
import { useEffect } from "react";
import {
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

export function useCompassHeading() {
  const heading = useSharedValue(0);

  useEffect(() => {
    let mounted = true;
    let subscription: Location.LocationSubscription | null = null;
    let previousHeading: number | null = null;
    let accumulatedHeading = 0;

    const start = async () => {
      // Android ne démarre pas l'écoute de la boussole sans autorisation de
      // localisation, même pour le cap magnétique. Sans ceci, l'API échoue
      // silencieusement et le radar reste immobile.
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
