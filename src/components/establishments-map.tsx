import type { MapEstablishment } from "@/data/establishments";
import MapView, { Marker, Region } from "react-native-maps";
import { StyleSheet } from "react-native";

type EstablishmentsMapProps = {
  establishments: MapEstablishment[];
  initialCoordinates?: MapEstablishment["coordinates"];
};

const FALLBACK_COORDINATES = { latitude: -4.325, longitude: 15.3222 };
const MAP_DELTA = 0.035;

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
          description={establishment.location}
          key={establishment.id}
          pinColor="#007B7B"
          title={establishment.name}
        />
      ))}
    </MapView>
  );
}
