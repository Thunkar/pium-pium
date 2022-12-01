export const SHIP_SIDES = {
    AFT: 'aft',
    PORT: 'port',
    STARBOARD: 'starboard',
    FORWARD: 'forward',
};

export const SIDE_TO_ROTATION_MAP = {
    [SHIP_SIDES.AFT]: Math.PI,
    [SHIP_SIDES.PORT]: (3 * Math.PI) / 2,
    [SHIP_SIDES.STARBOARD]: Math.PI / 2,
    [SHIP_SIDES.FORWARD]: 0,
};
