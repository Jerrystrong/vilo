import { Magnetometer } from 'expo-sensors';
import { useEffect } from 'react';
import {
    Easing,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

function normalizeAngle(angle: number) {
    let result = angle % 360;

    if (result < 0) {
        result += 360;
    }

    return result;
}

function shortestDelta(
    current: number,
    previous: number,
) {
    let delta = current - previous;

    if (delta > 180) {
        delta -= 360;
    }

    if (delta < -180) {
        delta += 360;
    }

    return delta;
}

export function useCompassHeading() {
    const heading = useSharedValue(0);

    useEffect(() => {
        let subscription:
            ReturnType<
                typeof Magnetometer.addListener
            > | null = null;

        let mounted = true;

        let previousHeading: number | null = null;

        let accumulatedHeading = 0;

        const start = async () => {
            const available =
                await Magnetometer.isAvailableAsync();

            if (!available || !mounted) {
                return;
            }

            Magnetometer.setUpdateInterval(16);

            subscription =
                Magnetometer.addListener(
                    ({
                        x,
                        y,
                    }) => {
                        if (!mounted) {
                            return;
                        }

                        /**
                         * Angle du téléphone par rapport
                         * au champ magnétique.
                         */
                        let angle =
                            Math.atan2(
                                y,
                                x,
                            ) *
                            (180 / Math.PI);

                        angle =
                            normalizeAngle(
                                angle + 90,
                            );

                        /**
                         * Première valeur.
                         */
                        if (
                            previousHeading === null
                        ) {
                            previousHeading =
                                angle;

                            return;
                        }

                        /**
                         * Petite différence entre
                         * l'ancien et le nouveau cap.
                         */
                        const delta =
                            shortestDelta(
                                angle,
                                previousHeading,
                            );

                        previousHeading =
                            angle;

                        /**
                         * Accumulation.
                         */
                        accumulatedHeading +=
                            delta;

                        /**
                         * Animation très douce.
                         */
                        // heading.value =
                        //     withSpring(
                        //         accumulatedHeading,
                        //         {
                        //             damping: 25,
                        //             stiffness: 180,
                        //             mass: 0.6,
                        //         },
                        //     );
                        heading.value = withTiming(
                            accumulatedHeading,
                            {
                                duration: 140,
                                easing: Easing.out(Easing.quad),
                            }
                        );
                    },
                );
        };

        start();

        return () => {
            mounted = false;
            subscription?.remove();
        };
    }, []);

    return {
        heading,
    };
}