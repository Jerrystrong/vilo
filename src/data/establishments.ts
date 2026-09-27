import { RadarEstablishment } from "@/components/radar/radar.types";
import { ImageSourcePropType } from "react-native";

export type MapEstablishment = RadarEstablishment & {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  menu?: ImageSourcePropType[];
};

export const establishments: MapEstablishment[] = [
  {
    id: "1",
    type: "restaurant",
    name: "Big bite",
    orbit: 1,
    angle: 320,
    size: 34,
    image: require("@/assets/images/bigbite.png"),
    menu: [
      require("@/assets/images/bigbite.png"),
      require("@/assets/images/bbmal.png"),
    ],
    location: "Gombe",
    coordinates: { latitude: -4.3158, longitude: 15.2985 },
  },
  {
    id: "2",
    type: "restaurant",
    name: "Big bite mall",
    orbit: 2,
    angle: 40,
    size: 34,
    image: require("@/assets/images/bbmal.png"),
    menu: [
      require("@/assets/images/bbmal.png"),
      require("@/assets/images/bigbite.png"),
    ],
    location: "Kinshasa",
    coordinates: { latitude: -4.3215, longitude: 15.3112 },
  },
  {
    id: "3",
    type: "bar",
    name: "Le club",
    orbit: 1,
    angle: 145,
    size: 34,
    image: require("@/assets/images/leclub.png"),
    menu: [require("@/assets/images/leclub.png")],
    location: "Lemba",
    coordinates: { latitude: -4.3269, longitude: 15.3056 },
  },
  {
    id: "4",
    type: "bar",
    name: "Bibi bar",
    orbit: 1,
    angle: 101,
    size: 34,
    image: require("@/assets/images/bigbite.png"),
    location: "Matonge",
    coordinates: { latitude: -4.3165, longitude: 15.3077 },
  },
  {
    id: "6",
    type: "bar",
    name: "Les jeunes",
    orbit: 3,
    angle: 15,
    size: 34,
    image: require("@/assets/images/bbmal.png"),
    location: "Gombe",
    coordinates: { latitude: -4.3109, longitude: 15.3021 },
  },
];
