import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Svg, {
    Defs,
    Path,
    Rect,
    SvgProps,
} from "react-native-svg";

interface BarIconProps extends SvgProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  style?: StyleProp<ViewStyle>;
}

export default function BarIcon({
  width = 32,
  height = 32,
  fill = "#000000",
  style,
  ...props
}: BarIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill={fill}
      style={style}
      {...props}
    >
      <Defs>
        {/* Style interne converti ou ignoré puisque géré par les props */}
      </Defs>
      <Path d="M25,11H15a1,1,0,0,0-1,1v4a6.0046,6.0046,0,0,0,5,5.91V28H16v2h8V28H21V21.91A6.0046,6.0046,0,0,0,26,16V12A1,1,0,0,0,25,11Zm-1,5a4,4,0,0,1-8,0V13h8Z" />
      <Path d="M15,1H10A1,1,0,0,0,9,2V9.3706A6.09,6.09,0,0,0,6,15V29a1,1,0,0,0,1,1h5V28H8V15c0-3.1875,2.231-4.02,2.3164-4.0513L11,10.7207V3h3V8h2V2A1,1,0,0,0,15,1Z" />
      <Rect width="32" height="32" fill="none" />
    </Svg>
  );
}