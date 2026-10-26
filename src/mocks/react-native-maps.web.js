/**
 * Web stub for react-native-maps.
 * react-native-maps uses codegenNativeComponent (Fabric API) which doesn't
 * exist in react-native-web. This stub replaces the entire package on web.
 */
import React from "react";
import { View, Text } from "react-native";

const MapView = ({ style, children }) => (
  <View style={[{ backgroundColor: "#e0e0e0", alignItems: "center", justifyContent: "center" }, style]}>
    <Text style={{ color: "#888" }}>Map not available on web</Text>
    {children}
  </View>
);

MapView.displayName = "MapView";

export const Marker = () => null;
export const Callout = () => null;
export const Circle = () => null;
export const Polygon = () => null;
export const Polyline = () => null;
export const Overlay = () => null;
export const UrlTile = () => null;
export const PROVIDER_GOOGLE = "google";
export const PROVIDER_DEFAULT = null;

export default MapView;
