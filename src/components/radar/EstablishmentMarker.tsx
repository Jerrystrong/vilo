import React from 'react';

import {
  Image,
  StyleSheet,
} from 'react-native';

import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {
  RadarEstablishment,
} from './radar.types';

import {
  RADAR_CENTER_X,
  RADAR_CENTER_Y,
  RADAR_ORBITS,
} from './radar.constants';


const ESTABLISHMENT_IMAGES = {
  restaurant: require("@/assets/images/Vector (2).png"),

  bar: require("@/assets/images/Vector (1).png"),

  hotel: require("@/assets/images/Vector (1).png"),

  tourist: require("@/assets/images/Vector (1).png"),
};


type Props = {
  establishment: RadarEstablishment;

  heading: SharedValue<number>;
};


export default function EstablishmentMarker({
  establishment,
  heading,
}: Props) {

  const {
    orbit,
    angle,
    distance = 1,
    size = 34,
  } = establishment;


  const orbitData =
    RADAR_ORBITS[orbit];


  /**
   * Position originale.
   */
  const initialAngle =
    angle *
    (Math.PI / 180);


  const initialX =
    RADAR_CENTER_X +
    Math.cos(initialAngle) *
    orbitData.rx *
    distance;


  const initialY =
    RADAR_CENTER_Y +
    Math.sin(initialAngle) *
    orbitData.ry *
    distance;


  /**
   * ---------------------------------------------------------
   * ANIMATION
   * ---------------------------------------------------------
   */

  const animatedStyle =
    useAnimatedStyle(() => {

      /**
       * Rotation actuelle de CET établissement.
       */
      const currentAngle =
        initialAngle -
        heading.value *
          (Math.PI / 180);


      /**
       * Nouvelle position sur son orbite.
       */
      const x =
        RADAR_CENTER_X +
        Math.cos(currentAngle) *
        orbitData.rx *
        distance;


      const y =
        RADAR_CENTER_Y +
        Math.sin(currentAngle) *
        orbitData.ry *
        distance;


      return {

        transform: [

          {
            translateX:
              x -
              initialX,
          },

          {
            translateY:
              y -
              initialY,
          },

        ],

      };

    });


  const image =
    ESTABLISHMENT_IMAGES[
      establishment.type
    ];


  return (
    <Animated.View
      style={[
        styles.marker,

        {
          left:
            initialX -
            size / 2,

          top:
            initialY -
            size / 2,

          width: size,
          height: size,
        },

        animatedStyle,
      ]}
    >

      <Image
        source={image}
        resizeMode="contain"
        style={{
          width: size,
          height: size,
        }}
      />

    </Animated.View>
  );
}


const styles = StyleSheet.create({

  marker: {
    position: 'absolute',

    alignItems: 'center',
    justifyContent: 'center',
  },

});