import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Svg, {
    Path,
    SvgProps,
} from "react-native-svg";

interface UserIconProps extends SvgProps {
  width?: number | string;
  height?: number | string;
  stroke?: string;
  style?: StyleProp<ViewStyle>;
}

export default function UserIcon({
  width = 24,
  height = 24,
  stroke = "#000000",
  style,
  ...props
}: UserIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      {...props}
    >
      <Path
        d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}