import type { MapEstablishment } from "@/data/establishments";
import MapView, { Marker, Region } from "react-native-maps";
import { Image, StyleSheet, View } from "react-native";

type EstablishmentsMapProps = {
  establishments: MapEstablishment[];
  initialCoordinates?: MapEstablishment["coordinates"];
};

const FALLBACK_COORDINATES = { latitude: -4.325, longitude: 15.3222 };
const MAP_DELTA = 0.035;

/** Marqueur personnalisé : avatar circulaire + pointe de pin en bas. */
function EstablishmentMarker({ establishment }: { establishment: MapEstablishment }) {
  const src =
    typeof establishment.image === "string"
      ? { uri: establishment.image }
      : establishment.image;

  return (
    <View style={markerStyles.wrapper}>
      <View style={markerStyles.bubble}>
        <Image source={src} style={markerStyles.image} resizeMode="cover" />
      </View>
      <View style={markerStyles.pointer} />
    </View>
  );
}

/**
 * Carte native réutilisable. Passez n'importe quelle liste d'établissements
 * avec des coordonnées pour afficher automatiquement ses marqueurs.
 */
export default function EstablishmentsMap({
  establishments,
  initialCoordinates,
}: EstablishmentsMapProps) {
  const center =
    initialCoordinates ?? establishments[0]?.coordinates ?? FALLBACK_COORDINATES;
  const initialRegion: Region = {
    ...center,
    latitudeDelta: MAP_DELTA,
    longitudeDelta: MAP_DELTA,
  };

  return (
    <MapView initialRegion={initialRegion} style={StyleSheet.absoluteFill}>
      {establishments.map((establishment) => (
        <Marker
          coordinate={establishment.coordinates}
          key={establishment.id}
          title={establishment.name}
          description={establishment.location}
          tracksViewChanges={false}
        >
          <EstablishmentMarker establishment={establishment} />
        </Marker>
      ))}
    </MapView>
  );
}

const BUBBLE_SIZE = 48;
const POINTER_SIZE = 10;
const BORDER_WIDTH = 2;

const markerStyles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: "#007B7B",
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: POINTER_SIZE,
    borderRightWidth: POINTER_SIZE,
    borderTopWidth: POINTER_SIZE * 1.2,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#007B7B",
    marginTop: -1,
  },
});
