export type EstablishmentType =
  | 'restaurant'
  | 'bar'
  | 'hotel'
  | 'tourist';

export type RadarEstablishment = {
  id: string;

  type: EstablishmentType;

  /**
   * Position sur le radar.
   *
   * 1 = orbite extérieure
   * 2 = orbite intermédiaire
   * 3 = orbite intérieure
   */
  orbit: 1 | 2 | 3;

  /**
   * Angle initial de l'établissement.
   *
   * 0   = droite
   * 90  = bas
   * 180 = gauche
   * 270 = haut
   */
  angle: number;

  /**
   * Distance par rapport au centre.
   */
  distance?: number;

  /**
   * Taille de l'icône.
   */
  size?: number;
};