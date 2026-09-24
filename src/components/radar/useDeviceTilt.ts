import {
  useEffect,
} from 'react';

import {
  DeviceMotion,
} from 'expo-sensors';

import {
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  MAX_TILT_X,
  MAX_TILT_Y,
} from './radar.constants';

type DeviceTilt = {
  rotateX: ReturnType<typeof useSharedValue<number>>;
  rotateY: ReturnType<typeof useSharedValue<number>>;
};

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    Math.max(value, min),
    max,
  );
}

export function useDeviceTilt(): DeviceTilt {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  useEffect(() => {
    let subscription:
      ReturnType<typeof DeviceMotion.addListener> | null = null;

    let mounted = true;

    async function startMotion() {
      const available =
        await DeviceMotion.isAvailableAsync();

      if (!available || !mounted) {
        return;
      }

      /**
       * 30Hz est largement suffisant pour une animation
       * de ce type et évite de solliciter inutilement
       * le téléphone.
       */
      DeviceMotion.setUpdateInterval(30);

      subscription = DeviceMotion.addListener(
        (motion) => {
          if (!mounted) {
            return;
          }

          const rotation = motion.rotation;

          if (!rotation) {
            return;
          }

          /**
           * beta  = inclinaison avant / arrière
           * gamma = inclinaison gauche / droite
           *
           * Les valeurs sont en radians.
           */

          const beta =
            (rotation.beta ?? 0) *
            (180 / Math.PI);

          const gamma =
            (rotation.gamma ?? 0) *
            (180 / Math.PI);

          /**
           * On limite les valeurs.
           */
          const nextX = clamp(
            beta,
            -MAX_TILT_X,
            MAX_TILT_X,
          );

          const nextY = clamp(
            gamma,
            -MAX_TILT_Y,
            MAX_TILT_Y,
          );

          /**
           * Animation physique douce.
           */
          rotateX.value = withSpring(
            nextX,
            {
              damping: 20,
              stiffness: 120,
              mass: 0.7,
            },
          );

          rotateY.value = withSpring(
            nextY,
            {
              damping: 20,
              stiffness: 120,
              mass: 0.7,
            },
          );
        },
      );
    }

    startMotion();

    return () => {
      mounted = false;

      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return {
    rotateX,
    rotateY,
  };
}