import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Svg, {
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  SvgProps,
} from "react-native-svg";

interface LightHotFontProps extends SvgProps {
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
  preserveAspectRatio?: string;
}

// Wrap SVG elements to accept Animated values as props
const AnimatedG    = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function LightHotFont({
  width = "100%",
  height = "100%",
  style,
  preserveAspectRatio = "xMidYMid slice",
  ...props
}: LightHotFontProps) {

  // ── Animated values ──────────────────────────────────────────────────────
  // Birds: 0 = wings open (scaleY=1), 1 = wings folded (scaleY=0.5)
  const birdLeft  = useRef(new Animated.Value(0)).current;
  const birdRight = useRef(new Animated.Value(0)).current;

  // Clouds: raw translateX offset in SVG units
  const cloudLeft   = useRef(new Animated.Value(0)).current;
  const cloudRight  = useRef(new Animated.Value(0)).current;
  const cloudBottom = useRef(new Animated.Value(0)).current;

  // Sun: slow horizontal drift (same type as clouds, different frequency)
  const sunX           = useRef(new Animated.Value(0)).current;
  const sunGlowAlpha   = useRef(new Animated.Value(0.18)).current;

  // ── Start animations ─────────────────────────────────────────────────────
  // NOTE: useNativeDriver MUST be false — SVG props are not on the native thread.
  useEffect(() => {

    // Wing flap: 0 (open) → 1 (folded) → 0 (open), then pause
    const birdLeftAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(birdLeft, {
          toValue: 1,
          duration: 200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(birdLeft, {
          toValue: 0,
          duration: 200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(birdLeft, {
          toValue: 1,
          duration: 200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(birdLeft, {
          toValue: 0,
          duration: 200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.delay(700),
      ])
    );

    const birdRightAnim = Animated.loop(
      Animated.sequence([
        Animated.delay(150),
        Animated.timing(birdRight, {
          toValue: 1,
          duration: 210,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(birdRight, {
          toValue: 0,
          duration: 210,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(birdRight, {
          toValue: 1,
          duration: 210,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(birdRight, {
          toValue: 0,
          duration: 210,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.delay(650),
      ])
    );

    // Clouds: faster horizontal drift
    const cloudLeftAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudLeft, {
          toValue: 14,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(cloudLeft, {
          toValue: -10,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(cloudLeft, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    const cloudRightAnim = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(cloudRight, {
          toValue: -18,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(cloudRight, {
          toValue: 12,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(cloudRight, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    const cloudBottomAnim = Animated.loop(
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(cloudBottom, {
          toValue: 12,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(cloudBottom, {
          toValue: -8,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(cloudBottom, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    // Sun: same drift type as clouds, slower frequency, small amplitude
    const sunAnim = Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(sunX, {
          toValue: 6,
          duration: 3500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(sunX, {
          toValue: -6,
          duration: 3500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(sunX, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    // Sun glow halo opacity pulse
    const sunGlowAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(sunGlowAlpha, {
          toValue: 0.35,
          duration: 3500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(sunGlowAlpha, {
          toValue: 0.1,
          duration: 3500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    birdLeftAnim.start();
    birdRightAnim.start();
    cloudLeftAnim.start();
    cloudRightAnim.start();
    cloudBottomAnim.start();
    sunAnim.start();
    sunGlowAnim.start();

    return () => {
      birdLeftAnim.stop();
      birdRightAnim.stop();
      cloudLeftAnim.stop();
      cloudRightAnim.stop();
      cloudBottomAnim.stop();
      sunAnim.stop();
      sunGlowAnim.stop();
    };
  }, [
    birdLeft, birdRight,
    cloudLeft, cloudRight, cloudBottom,
    sunX, sunGlowAlpha,
  ]);

  // ── Derived interpolations (numeric only, no string templates) ────────────

  // Bird scaleY: 0 (anim) → 1 (wings open) … 1 (anim) → 0.48 (wings folded)
  const birdLeftScaleY = birdLeft.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.48],
  });

  const birdRightScaleY = birdRight.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.48],
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 395 863"
      fill="none"
      preserveAspectRatio={preserveAspectRatio}
      style={[StyleSheet.absoluteFill, style]}
      {...props}
    >
      <Rect x={0} y={0} width={395} height={863} fill="url(#backgroundGradient)" />

      {/* ── Sun outer glow halo – drifts with sun ── */}
      <AnimatedG translateX={sunX} opacity={sunGlowAlpha}>
        <Path
          d="M298 108C340.526 108 375 142.474 375 185C375 227.526 340.526 262 298 262C255.474 262 221 227.526 221 185C221 142.474 255.474 108 298 108Z"
          fill="url(#sunOuter)"
        />
      </AnimatedG>

      {/* ── Sun body + rays – same drift as glow ── */}
      <AnimatedG translateX={sunX}>
        <Path
          d="M298 150C316.778 150 332 165.222 332 184C332 202.778 316.778 218 298 218C279.222 218 264 202.778 264 184C264 165.222 279.222 150 298 150Z"
          fill="#FBBF24"
        />
        <Path
          d="M298 158C312.359 158 324 169.641 324 184C324 198.359 312.359 210 298 210C283.641 210 272 198.359 272 184C272 169.641 283.641 158 298 158Z"
          fill="#FDE047"
        />
        <G opacity={0.38}>
          <Path d="M298 136V121" stroke="#FBBF24" strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M249 184H232" stroke="#FBBF24" strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M263 149L250 136" stroke="#FBBF24" strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M263 219L250 232" stroke="#FBBF24" strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M333 219L346 232" stroke="#FBBF24" strokeWidth={1.5} strokeLinecap="round" />
        </G>
      </AnimatedG>

      {/* ── Cloud left: horizontal drift via translateX numeric prop ── */}
      <AnimatedG translateX={cloudLeft}>
        <Path
          d="M-19 201C-19 190 -8 181 4 181C8 181 12 182 16 184C23 176 32 172 42 172C52 172 61 176 67 183C72 181 77 180 82 180C94 180 104 187 108 197C117 199 123 207 123 217C123 228 114 237 103 237H-19V201Z"
          fill="url(#cloudLeft)"
        />
      </AnimatedG>

      {/* ── Cloud right: horizontal drift ── */}
      <AnimatedG translateX={cloudRight}>
        <Path
          d="M244 295C244 284 253 275 264 275C268 275 272 276 276 278C282 270 291 266 301 266C311 266 320 270 326 277C331 275 336 274 341 274C352 274 361 282 364 292C372 295 377 302 377 311C377 322 368 330 357 330H244V295Z"
          fill="url(#cloudRight)"
          fillOpacity={0.8}
        />
      </AnimatedG>

      {/* ── Cloud bottom: horizontal drift ── */}
      <AnimatedG translateX={cloudBottom}>
        <Path
          d="M-8 509C-8 498 1 489 12 489C16 489 20 490 24 492C31 484 40 480 50 480C60 480 69 484 75 491C80 489 85 488 90 488C102 488 112 496 115 506C124 509 130 517 130 527C130 538 121 547 110 547H-8V509Z"
          fill="url(#cloudBottom)"
          fillOpacity={0.65}
        />
      </AnimatedG>

      {/* ── Bird left: wing flap via scaleY, origin at bird centre ── */}
      <AnimatedPath
        d="M82 295C85.3333 291 88.6667 291 92 295C95.3333 291 98.6667 291 102 295"
        stroke="#67BFD7"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.55}
        scaleY={birdLeftScaleY}
        originX={92}
        originY={293}
      />

      {/* ── Bird right: wing flap ── */}
      <AnimatedPath
        d="M111 310C113.667 306.667 116.333 306.667 119 310C121.667 306.667 124.333 306.667 127 310"
        stroke="#67BFD7"
        strokeWidth={1.3}
        strokeLinecap="round"
        opacity={0.45}
        scaleY={birdRightScaleY}
        originX={119}
        originY={308}
      />

      {/* ── Static decorative dots ── */}
      <Path
        opacity={0.22}
        d="M232 284C236.418 284 240 280.418 240 276C240 271.582 236.418 268 232 268C227.582 268 224 271.582 224 276C224 280.418 227.582 284 232 284Z"
        fill="white"
      />
      <Path
        opacity={0.18}
        d="M182 319C188.627 319 194 313.627 194 307C194 300.373 188.627 295 182 295C175.373 295 170 300.373 170 307C170 313.627 175.373 319 182 319Z"
        fill="white"
      />
      {/* <Path
        opacity={0.25}
        d="M132 380C142.493 380 151 371.493 151 361C151 350.507 142.493 342 132 342C121.507 342 113 350.507 113 361C113 371.493 121.507 380 132 380Z"
        fill="#FDE047"
      /> */}

      <Defs>
        <LinearGradient
          id="backgroundGradient"
          x1={197.5} y1={0} x2={197.5} y2={863}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0}     stopColor="#F4F7F6" />
          <Stop offset={0.065} stopColor="#F1F5F6" />
          <Stop offset={0.11}  stopColor="#E9F4F8" />
          <Stop offset={0.18}  stopColor="#DFF1F9" />
          <Stop offset={0.28}  stopColor="#E5F3F8" />
          <Stop offset={0.42}  stopColor="#EFF8FA" />
          <Stop offset={0.55}  stopColor="#F3F8F4" />
          <Stop offset={0.67}  stopColor="#F8F6E8" />
          <Stop offset={0.74}  stopColor="#FBF3D1" />
          <Stop offset={0.82}  stopColor="#F6F5EA" />
          <Stop offset={0.88}  stopColor="#F4F7F6" />
          <Stop offset={1}     stopColor="#F4F7F6" />
        </LinearGradient>

        <RadialGradient
          id="sunOuter"
          cx={0} cy={0} r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(298 184) rotate(90) scale(77)"
        >
          <Stop offset={0}    stopColor="#FBBF24" stopOpacity={0.3} />
          <Stop offset={0.28} stopColor="#FDE68A" stopOpacity={0.2} />
          <Stop offset={0.58} stopColor="#FEF3C7" stopOpacity={0.1} />
          <Stop offset={1}    stopColor="#FEF3C7" stopOpacity={0}   />
        </RadialGradient>

        <LinearGradient
          id="cloudLeft"
          x1={52} y1={171} x2={52} y2={237}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0} stopColor="#FFFFFF" stopOpacity={0.9}  />
          <Stop offset={1} stopColor="#FFFFFF" stopOpacity={0.42} />
        </LinearGradient>

        <LinearGradient
          id="cloudRight"
          x1={310} y1={266} x2={310} y2={330}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0} stopColor="#FFFFFF" stopOpacity={0.82} />
          <Stop offset={1} stopColor="#FFFFFF" stopOpacity={0.38} />
        </LinearGradient>

        <LinearGradient
          id="cloudBottom"
          x1={61} y1={480} x2={61} y2={547}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0} stopColor="#FFFFFF" stopOpacity={0.8}  />
          <Stop offset={1} stopColor="#FFFFFF" stopOpacity={0.32} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}