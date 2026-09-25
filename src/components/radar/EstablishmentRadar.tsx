import { StyleSheet, useColorScheme, View } from "react-native";

import EstablishmentMarker from "./EstablishmentMarker";
import RadarSvg from "./RadarSvg";

import { RadarEstablishment } from "./radar.types";

import { RADAR_HEIGHT, RADAR_PADDING, RADAR_WIDTH } from "./radar.constants";

import UserIcon from "@/assets/svg/userIcon";
import { useCompassHeading } from "./useCompassMotion";

type EstablishmentRadarProps = {
  establishments: RadarEstablishment[];
  width?: number;
  enableTilt?: boolean;
};

export default function EstablishmentRadar({
  establishments,
  width = RADAR_WIDTH,
}: EstablishmentRadarProps) {
  const colorScheme = useColorScheme();
  const scale = width / RADAR_WIDTH;

  const radarWidth = RADAR_WIDTH * scale;

  const radarHeight = RADAR_HEIGHT * scale;

  const stageWidth = radarWidth + RADAR_PADDING * 2;

  const stageHeight = radarHeight + RADAR_PADDING * 2;

  const { heading } = useCompassHeading();

  return (
    <View
      style={[
        styles.stage,
        {
          width: stageWidth,
          height: stageHeight,
        },
      ]}
    >
      {/* ==================================================
          RADAR FIXE
      ================================================== */}

      <View
        style={[
          styles.radar,
          {
            width: radarWidth,
            height: radarHeight,

            left: RADAR_PADDING,
            top: RADAR_PADDING,
          },
        ]}
      >
        <RadarSvg />

        {/* ==================================================
            ÉTABLISSEMENTS
        ================================================== */}

        {establishments.map((establishment) => (
          <EstablishmentMarker
            key={establishment.id}
            establishment={establishment}
            heading={heading}
          />
        ))}
      </View>

      {/* ==================================================
          UTILISATEUR FIXE
      ================================================== */}

      <View
        pointerEvents="none"
        style={[
          styles.user,
          {
            left: RADAR_PADDING + radarWidth / 2 - 22,

            top: RADAR_PADDING + radarHeight / 2 - 22,
          },
        ]}
      >
        <View className="dark:bg-transparent bg-[#111827] w-[45px] h-[45px] rounded-full flex-row items-center justify-center">
          <UserIcon stroke="#E5E7EB" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    position: "relative",
    alignSelf: "center",
    overflow: "visible",
  },

  radar: {
    position: "absolute",
    overflow: "visible",
  },

  user: {
    position: "absolute",

    width: 44,
    height: 44,

    alignItems: "center",
    justifyContent: "center",
  },

  userCircle: {
    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: "#111827",

    alignItems: "center",
    justifyContent: "center",
  },

  head: {
    position: "absolute",

    top: 11,

    width: 8,
    height: 8,

    borderRadius: 4,

    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },

  body: {
    position: "absolute",

    bottom: 8,

    width: 14,
    height: 10,

    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,

    borderWidth: 1.5,
    borderBottomWidth: 0,

    borderColor: "#E5E7EB",
  },
});
