import { RadarEstablishment } from "@/components/radar/radar.types";

export type MapEstablishment = RadarEstablishment & {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  menu?: string[];
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
    menu: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1_O8epLfXAOwRMBVY0tIZei1ZULSSFDCWERM99zyq3TvBCvSDU2RVHEs&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0XFuhLuifOhj_h01FQapSn1Jrd6o83MT9mumrWZt92WA1OibPEZaVt4&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdlMf7QBSv4bHI93O5vq8XuIqYxa9ntjpiUJWbFYnz603y1O90cfiYQtY&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlMtBsEpWJM2bepnEjdEvDQVpuga42hkUkgP0VxCP9xx2AUfLjeQupcAs&s=10"
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
    menu: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1_O8epLfXAOwRMBVY0tIZei1ZULSSFDCWERM99zyq3TvBCvSDU2RVHEs&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0XFuhLuifOhj_h01FQapSn1Jrd6o83MT9mumrWZt92WA1OibPEZaVt4&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdlMf7QBSv4bHI93O5vq8XuIqYxa9ntjpiUJWbFYnz603y1O90cfiYQtY&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlMtBsEpWJM2bepnEjdEvDQVpuga42hkUkgP0VxCP9xx2AUfLjeQupcAs&s=10"
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
    menu: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1_O8epLfXAOwRMBVY0tIZei1ZULSSFDCWERM99zyq3TvBCvSDU2RVHEs&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0XFuhLuifOhj_h01FQapSn1Jrd6o83MT9mumrWZt92WA1OibPEZaVt4&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdlMf7QBSv4bHI93O5vq8XuIqYxa9ntjpiUJWbFYnz603y1O90cfiYQtY&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlMtBsEpWJM2bepnEjdEvDQVpuga42hkUkgP0VxCP9xx2AUfLjeQupcAs&s=10"
    ],
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
    menu: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1_O8epLfXAOwRMBVY0tIZei1ZULSSFDCWERM99zyq3TvBCvSDU2RVHEs&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0XFuhLuifOhj_h01FQapSn1Jrd6o83MT9mumrWZt92WA1OibPEZaVt4&s=10"],
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
    menu: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1_O8epLfXAOwRMBVY0tIZei1ZULSSFDCWERM99zyq3TvBCvSDU2RVHEs&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0XFuhLuifOhj_h01FQapSn1Jrd6o83MT9mumrWZt92WA1OibPEZaVt4&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdlMf7QBSv4bHI93O5vq8XuIqYxa9ntjpiUJWbFYnz603y1O90cfiYQtY&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlMtBsEpWJM2bepnEjdEvDQVpuga42hkUkgP0VxCP9xx2AUfLjeQupcAs&s=10"
    ],
  },
];
