import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  SvgProps,
} from "react-native-svg";

interface NightBackgroundProps extends SvgProps {
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
  preserveAspectRatio?: string;
}

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function NightBackground({
  width = "100%",
  height = "100%",
  style,
  preserveAspectRatio = "xMidYMid slice",
  ...props
}: NightBackgroundProps) {
  // ── Star animated values (each with a unique initial opacity) ───────────
  const star1 = useRef(new Animated.Value(0.55)).current;
  const star2 = useRef(new Animated.Value(0.3)).current;
  const star3 = useRef(new Animated.Value(0.72)).current;
  const star4 = useRef(new Animated.Value(0.2)).current;
  const star5 = useRef(new Animated.Value(0.6)).current;
  const star6 = useRef(new Animated.Value(0.15)).current;
  const star7 = useRef(new Animated.Value(0.68)).current;
  const star8 = useRef(new Animated.Value(0.25)).current;

  // ── Moon: subtle glow breathing (atmospheric haze) ─────────────────────
  const moonGlowAlpha = useRef(new Animated.Value(0.18)).current;

  // ── Constellation ─────────────────────────────────────────────────────
  const constellationOpacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    // ── Moon glow breathing — slow, subtle atmospheric shimmer ──────────
    const moonGlowAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(moonGlowAlpha, {
          toValue: 0.30,
          duration: 4500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(moonGlowAlpha, {
          toValue: 0.12,
          duration: 4500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    // ── Constellation slow pulse ────────────────────────────────────────
    const constellationAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(constellationOpacity, {
          toValue: 0.5,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(constellationOpacity, {
          toValue: 0.22,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    // ── Realistic star twinkle factory ──────────────────────────────────
    // Each star has its own: min/max brightness, fade-in/out speed, pause
    const createTwinkle = (
      value: Animated.Value,
      min: number,
      max: number,
      fadeIn: number,
      fadeOut: number,
      pause: number,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          // Brighten
          Animated.timing(value, {
            toValue: max,
            duration: fadeIn,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
          // Dim back
          Animated.timing(value, {
            toValue: min,
            duration: fadeOut,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          // Hold dim (rest period before next twinkle)
          Animated.delay(pause),
        ])
      );
    };

    // Each star: unique brightness range, speed, and rest period
    // Bright stars twinkle subtly; dim stars flicker more dramatically
    const starAnims = [
      //                 value  min   max   fadeIn fadeOut pause  delay
      createTwinkle(star1, 0.15, 0.90,  800,  1200,  2200,    0),   // quick bright flash
      createTwinkle(star2, 0.08, 0.65, 1400,  1800,  3500,  600),   // slow dim twinkle
      createTwinkle(star3, 0.25, 1.00,  900,  1100,  1800,  300),   // vivid, frequent
      createTwinkle(star4, 0.05, 0.55, 1600,  2200,  4000, 1200),   // faint & slow
      createTwinkle(star5, 0.20, 0.85, 1100,  1500,  2600,  800),   // medium steady
      createTwinkle(star6, 0.03, 0.50, 2000,  2800,  3200,  400),   // very faint, long cycle
      createTwinkle(star7, 0.18, 0.92,  700,   950,  1500, 1500),   // fast shimmer
      createTwinkle(star8, 0.10, 0.70, 1300,  1700,  3800, 1000),   // moderate, long rest
    ];

    moonGlowAnim.start();
    constellationAnim.start();
    starAnims.forEach((a) => a.start());

    return () => {
      moonGlowAnim.stop();
      constellationAnim.stop();
      starAnims.forEach((a) => a.stop());
    };
  }, [
    star1, star2, star3, star4, star5, star6, star7, star8,
    moonGlowAlpha, constellationOpacity,
  ]);

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 390 600"
      fill="none"
      preserveAspectRatio={preserveAspectRatio}
      style={[StyleSheet.absoluteFill, style]}
      {...props}
    >
      <Rect
        x={0}
        y={0}
        width={390}
        height={600}
        fill="url(#nightBackground)"
      />

      {/* ── Moon glow halo – subtle breathing ── */}
      <AnimatedG opacity={moonGlowAlpha}>
        <Circle
          cx={309}
          cy={79}
          r={52}
          fill="url(#moonGlow)"
        />
      </AnimatedG>

      {/* ── Moon body – static ── */}
      <G>
        <Path
          d="M309 55C294.088 55 282 67.0883 282 82C282 96.9117 294.088 109 309 109C314.352 109 319.372 107.441 323.6 104.76C317.742 106.631 311.06 106.413 304.938 103.92C295.102 99.912 288 90.041 288 78.5C288 68.477 293.47 59.733 301.56 55.196C303.943 55.067 306.438 55 309 55Z"
          fill="#DCE8F2"
        />

        <Circle
          cx={315}
          cy={74}
          r={19}
          fill="#080F1F"
        />
      </G>

      <AnimatedG
        opacity={constellationOpacity}
      >
        <Path
          d="M45 59L120 45L180 90L230 35"
          stroke="#2B4A67"
          strokeWidth={0.8}
          strokeDasharray="1.5 3.5"
          strokeLinecap="round"
        />

        <Path
          d="M180 90L220 53"
          stroke="#40566F"
          strokeWidth={0.8}
          strokeLinecap="round"
        />

        <Path
          d="M144 105L180 90"
          stroke="#182C43"
          strokeWidth={0.8}
          strokeLinecap="round"
        />

        <Circle
          cx={45}
          cy={59}
          r={1}
          fill="#7EA0C1"
        />

        <Circle
          cx={120}
          cy={45}
          r={1.2}
          fill="#E7EDF3"
        />

        <Circle
          cx={180}
          cy={90}
          r={1}
          fill="#7897B4"
        />

        <Circle
          cx={230}
          cy={35}
          r={1}
          fill="#E5EBF0"
        />
      </AnimatedG>

      <AnimatedCircle
        cx={69}
        cy={140}
        r={1}
        fill="#DDE6EF"
        opacity={star1}
      />

      <AnimatedCircle
        cx={250}
        cy={150}
        r={1}
        fill="#C9D5E0"
        opacity={star2}
      />

      <AnimatedCircle
        cx={160}
        cy={180}
        r={1.6}
        fill="#DCE6EF"
        opacity={star3}
      />

      <AnimatedCircle
        cx={30}
        cy={240}
        r={1.5}
        fill="#FFFFFF"
        opacity={star4}
      />

      <AnimatedCircle
        cx={210}
        cy={260}
        r={0.9}
        fill="#DDE7F0"
        opacity={star5}
      />

      <AnimatedCircle
        cx={340}
        cy={310}
        r={1}
        fill="#B9CCDE"
        opacity={star6}
      />

      <AnimatedCircle
        cx={140}
        cy={350}
        r={1.5}
        fill="#E1E8EF"
        opacity={star7}
      />

      <AnimatedCircle
        cx={310}
        cy={370}
        r={0.8}
        fill="#7EA5C7"
        opacity={star8}
      />

      <AnimatedCircle
        cx={360}
        cy={440}
        r={1.5}
        fill="#FFFFFF"
        opacity={star2}
      />

      <AnimatedCircle
        cx={110}
        cy={480}
        r={0.8}
        fill="#BFD0DF"
        opacity={star4}
      />

      <AnimatedCircle
        cx={180}
        cy={530}
        r={1.6}
        fill="#DDE6EF"
        opacity={star5}
      />

      <AnimatedCircle
        cx={330}
        cy={560}
        r={0.9}
        fill="#E7EDF3"
        opacity={star7}
      />

      <AnimatedCircle
        cx={25}
        cy={500}
        r={0.9}
        fill="#DDE7EF"
        opacity={star3}
      />

      <AnimatedCircle
        cx={230}
        cy={410}
        r={0.7}
        fill="#8FAAC2"
        opacity={star6}
      />

      <AnimatedG
        opacity={star3}
      >
        <Path
          d="M280 223V237M273 230H287"
          stroke="#FFFFFF"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      </AnimatedG>

      <AnimatedG
        opacity={star5}
      >
        <Path
          d="M60 205V215M55 210H65"
          stroke="#456F95"
          strokeWidth={1}
          strokeLinecap="round"
        />
      </AnimatedG>

      <AnimatedG
        opacity={star1}
      >
        <Path
          d="M330 453V465M324 459H336"
          stroke="#6D747D"
          strokeWidth={1}
          strokeLinecap="round"
        />
      </AnimatedG>

      <AnimatedG
        opacity={star7}
      >
        <Path
          d="M120 39V51M114 45H126"
          stroke="#E9EEF3"
          strokeWidth={1}
          strokeLinecap="round"
        />
      </AnimatedG>

      <Defs>
        <LinearGradient
          id="nightBackground"
          x1={195}
          y1={0}
          x2={195}
          y2={600}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0} stopColor="#111827" />
          <Stop offset={0.3} stopColor="#0D1728" />
          <Stop offset={0.65} stopColor="#0A1322" />
          <Stop offset={1} stopColor="#050B15" />
        </LinearGradient>

        <RadialGradient
          id="moonGlow"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(309 79) rotate(90) scale(52)"
        >
          <Stop
            offset={0}
            stopColor="#DCE8F2"
            stopOpacity={0.28}
          />
          <Stop
            offset={0.45}
            stopColor="#BFD3E5"
            stopOpacity={0.12}
          />
          <Stop
            offset={1}
            stopColor="#8FAAC2"
            stopOpacity={0}
          />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}