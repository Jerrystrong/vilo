export const RADAR_WIDTH = 340;
export const RADAR_HEIGHT = 460;

export const RADAR_CENTER_X = 170;
export const RADAR_CENTER_Y = 230;

export const RADAR_ORBITS = {
  1: {
    rx: 160,
    ry: 203,
  },

  2: {
    rx: 111,
    ry: 133,
  },

  3: {
    rx: 59,
    ry: 65,
  },
} as const;


/**
 * Amplitude maximale de l'effet 3D.
 */
export const MAX_TILT = 12;


/**
 * Perspective.
 */
export const RADAR_PERSPECTIVE = 900;


/**
 * Espace autour du radar pour éviter
 * tout clipping pendant la rotation.
 */
export const RADAR_PADDING = 140;