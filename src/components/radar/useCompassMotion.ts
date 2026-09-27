import { Magnetometer } from 'expo-sensors';
import { useEffect } from 'react';
import {
    Easing,
    useSharedValue,
    withTiming,
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

/**
 * Arrondit une valeur à un nombre précis
 * de décimales.
 *
 * Exemple :
 * -54.46035 -> -54.5
 * -54.52958 -> -54.5
 * -54.58015 -> -54.6
 */
function roundValue(
    value: number,
    decimals = 1,
) {
    const factor = Math.pow(10, decimals);

    return Math.round(value * factor) / factor;
}

export function useCompassHeading() {
    const heading = useSharedValue(0);

    useEffect(() => {
        let subscription:
            ReturnType<
                typeof Magnetometer.addListener
            > | null = null;

        let mounted = true;

        /**
         * Dernières valeurs X/Y réellement
         * utilisées pour calculer un angle.
         */
        let previousX: number | null = null;
        let previousY: number | null = null;

        /**
         * Dernier angle réellement utilisé.
         */
        let previousHeading: number | null = null;

        /**
         * Angle accumulé permettant de tourner
         * naturellement au-delà de 360°.
         */
        let accumulatedHeading = 0;

        /**
         * Seuil minimal de changement d'angle.
         *
         * Tant que le téléphone ne bouge pas
         * d'au moins cette valeur, on ne déplace
         * pas les établissements.
         */
        const ANGLE_THRESHOLD = 0.8;

        const start = async () => {
            const available =
                await Magnetometer.isAvailableAsync();

            if (!available || !mounted) {
                return;
            }

            /**
             * 60 FPS environ.
             */
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
                         * --------------------------------
                         * 1. QUANTIFICATION X / Y
                         * --------------------------------
                         *
                         * On ignore les micro-variations
                         * du capteur.
                         */
                        const roundedX =
                            roundValue(x, 1);

                        const roundedY =
                            roundValue(y, 1);

                        /**
                         * Si X et Y n'ont pas suffisamment
                         * changé, on ne fait absolument
                         * rien.
                         */
                        if (
                            previousX === roundedX &&
                            previousY === roundedY
                        ) {
                            return;
                        }

                        previousX = roundedX;
                        previousY = roundedY;

                        /**
                         * --------------------------------
                         * 2. CALCUL DE L'ANGLE
                         * --------------------------------
                         */
                        let angle =
                            Math.atan2(
                                roundedY,
                                roundedX,
                            ) *
                            (180 / Math.PI);

                        angle = normalizeAngle(
                            angle + 90,
                        );

                        /**
                         * --------------------------------
                         * 3. PREMIÈRE VALEUR
                         * --------------------------------
                         */
                        if (
                            previousHeading === null
                        ) {
                            previousHeading = angle;
                            accumulatedHeading = angle;

                            heading.value = angle;

                            return;
                        }

                        /**
                         * --------------------------------
                         * 4. DIFFÉRENCE ANGULAIRE
                         * --------------------------------
                         */
                        const delta =
                            shortestDelta(
                                angle,
                                previousHeading,
                            );

                        /**
                         * On mémorise le nouvel angle
                         * du capteur.
                         */
                        previousHeading = angle;

                        /**
                         * --------------------------------
                         * 5. IGNORER LES MICRO-MOUVEMENTS
                         * --------------------------------
                         */
                        if (
                            Math.abs(delta) <
                            ANGLE_THRESHOLD
                        ) {
                            return;
                        }

                        /**
                         * --------------------------------
                         * 6. ACCUMULATION
                         * --------------------------------
                         */
                        accumulatedHeading += delta;

                        /**
                         * --------------------------------
                         * 7. TRANSITION FLUIDE
                         * --------------------------------
                         */
                        heading.value =
                            withTiming(
                                accumulatedHeading,
                                {
                                    duration: 140,
                                    easing:
                                        Easing.out(
                                            Easing.quad,
                                        ),
                                },
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