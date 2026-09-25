import { StyleProp, ViewStyle } from "react-native";
import Svg, {
    Circle,
    ClipPath,
    Defs,
    G,
    Path,
    SvgProps,
} from "react-native-svg";

interface WeatherLandscapeProps extends SvgProps {
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
}

export default function WeatherLandscape({
  width = 100,
  height = 100,
  style,
  ...props
}: WeatherLandscapeProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      style={style}
      {...props}
    >
      <G clipPath="url(#clip_circle)">
        {/* Fond circulaire bleu clair */}
        <Circle cx="50" cy="50" r="50" fill="#D2EBF8" />

        {/* Soleil et ses rayons */}
        <G fill="#FFEB3B" opacity={0.85}>
          <Circle cx="72" cy="28" r="10" />
          {/* Rayons du soleil */}
          <Path
            d="M58 18L61 21M63 12L65 16M72 10V14M82 16L79 19"
            stroke="#FFEB3B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </G>

        {/* Nuages */}
        <G fill="#FFFFFF" opacity={0.8}>
          {/* Nuage haut-gauche */}
          <Path d="M32 24C32 21 35 19 38 20C40 17 45 17 48 20C51 18 55 21 53 24C55 26 53 30 49 30H35C31 30 30 27 32 24Z" />
          {/* Nuage milieu-gauche */}
          <Path d="M14 36C14 32 18 30 22 32C25 28 32 28 35 32C39 30 43 33 41 37C44 40 40 45 35 45H17C13 45 12 40 14 36Z" />
          {/* Nuage milieu-droit */}
          <Path d="M52 48C52 45 55 43 58 44C60 41 65 41 68 44C71 42 75 45 73 48C75 51 73 55 69 55H55C51 55 50 52 52 48Z" />
        </G>

        {/* Forme / structure marron (château / muret) */}
        <Path d="M22 75V62H31V58H45V67H57V55H75V75H22Z" fill="#A06E3B" />

        {/* Collines / buissons verts */}
        <Path
          d="M22 85C22 75 35 70 48 77C60 70 76 72 88 80C92 84 92 90 85 92H25C21 92 22 88 22 85Z"
          fill="#00C800"
        />
      </G>

      <Defs>
        <ClipPath id="clip_circle">
          <Circle cx="50" cy="50" r="50" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
