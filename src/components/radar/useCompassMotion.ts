import { useEffect } from "react";
import { Platform } from "react-native";
import { Magnetometer } from "expo-sensors";
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

function headingFromMagnetometer(x: number, y: number) {
  const angle = (Math.atan2(y, x) * 180) / Math.PI;

  // Les axes renvoyés par les capteurs natifs ne sont pas orientés de la
  // même façon sur Android et iOS. On les ramène à 0° = nord, dans le sens
  // horaire, pour que le radar ait le même comportement sur les deux OS.
  return normalizeAngle(Platform.OS === "ios" ? angle - 90 : 90 - angle);
}

export function useCompassHeading() {
  const heading = useSharedValue(0);

  useEffect(() => {
    let mounted = true;
    let previousHeading: number | null = null;
    let accumulatedHeading = 0;
    let subscription: ReturnType<typeof Magnetometer.addListener> | null = null;

    const start = async () => {
      const isAvailable = await Magnetometer.isAvailableAsync();

      if (!mounted || !isAvailable) {
        return;
      }

      Magnetometer.setUpdateInterval(100);
      subscription = Magnetometer.addListener(({ x, y }) => {
        if (!mounted || !Number.isFinite(x) || !Number.isFinite(y)) {
          return;
        }

        const nextHeading = headingFromMagnetometer(x, y);

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
      });
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
