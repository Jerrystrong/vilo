import { StyleProp, ViewStyle } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

interface DotIconProps extends SvgProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  style?: StyleProp<ViewStyle>;
}

export default function DotIcon({ 
  width = 32,
  height = 32,
  fill = "#000000",
  style,
  ...props
}: DotIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill={fill}
      style={style}
      {...props}
    >
      <Path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z" />
      <Path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z" />
      <Path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z" />
    </Svg>
  );
}
