import { useColorScheme } from "react-native";
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    withSpring,
    withTiming,
    type SharedValue,
} from "react-native-reanimated";

export default function PaginationDot({
  index,
  progress,
}: {
  index: number;
  progress: SharedValue<number>;
}) {
  const colorScheme = useColorScheme();
  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(progress.value - index);

    const scale = interpolate(distance, [0, 1], [1.15, 1], "clamp");

    const width = interpolate(distance, [0, 1], [22, 8], "clamp");

    const opacity = interpolate(distance, [0, 1], [1, 0.45], "clamp");

    const backgroundColor = interpolateColor(
      distance,
      [0, 1],
      [colorScheme === "dark" ? "#fff" : "#111827", "#D1D5DB"],
    );

    return {
      width: withSpring(width, {
        damping: 18,
        stiffness: 140,
        mass: 0.6,
      }),
      height: 8,
      borderRadius: 10,
      opacity: withTiming(opacity, { duration: 200 }),
      transform: [
        {
          scale: withSpring(scale, {
            damping: 18,
            stiffness: 140,
            mass: 0.6,
          }),
        },
      ],
      backgroundColor,
    };
  });

  return <Animated.View style={animatedStyle} />;
}
