export const COSTS = {
    ENERGY: 'energy',
    HEAT: 'heat',
    RANGE: 'range',
    ANGLE: 'angle',
};

export const EFFECTS = {
    TURN_RIGHT: 'turn-right',
    TURN_LEFT: 'turn-left',
    TURN_RIGHT_THEN_STOP: 'turn-right-then-stop',
    TURN_LEFT_THEN_STOP: 'turn-left-then-stop',
    ACCELERATE: 'accelerate',
    DAMAGE: 'damage',
};

export const TARGETED_EFFECTS = [EFFECTS.DAMAGE];

export const SUBSYSTEMS = {
    THRUSTERS: 'thrusters',
    MANEUVERING_THRUSTERS: 'maneuvering_thrusters',
    MISSILE_RACK: 'missile_rack',
    BALLISTIC_RACK: 'ballistic_rack',
    LASER: 'laser',
    DISRUPTOR: 'disruptor',
    PLASMA_CANNONS: 'plasma_cannons',
    RAILGUN: 'railgun',
};

export const Parts = {
    [SUBSYSTEMS.THRUSTERS]: {
        type: SUBSYSTEMS.THRUSTERS,
        abilities: [
            {
                costs: [{ value: 2, type: COSTS.ENERGY }],
                text: 'Burn',
                effects: {
                    or: [{ type: EFFECTS.ACCELERATE, value: 1 }],
                },
            },
            {
                costs: [
                    { value: 2, type: COSTS.ENERGY },
                    { value: 2, type: COSTS.HEAT },
                ],
                text: 'Afterburners',
                effects: {
                    or: [{ type: EFFECTS.ACCELERATE, value: 2 }],
                },
            },
            {
                costs: [{ value: 2, type: COSTS.ENERGY }],
                text: 'Maneuver',
                effects: {
                    or: [
                        { type: EFFECTS.TURN_LEFT, value: 1 },
                        { type: EFFECTS.TURN_RIGHT, value: 1 },
                    ],
                },
            },
        ],
    },
    [SUBSYSTEMS.MANEUVERING_THRUSTERS]: {
        type: SUBSYSTEMS.MANEUVERING_THRUSTERS,
        abilities: [
            {
                costs: [{ value: 1, type: COSTS.ENERGY }],
                text: 'Maneuver',
                effects: {
                    or: [
                        {
                            type: EFFECTS.TURN_RIGHT_THEN_STOP,
                            value: 1,
                            text: 'then stop',
                            onlyInSubmenu: true,
                        },
                        {
                            type: EFFECTS.TURN_RIGHT,
                            value: 1,
                            onlyInSubmenu: true,
                        },
                        {
                            type: EFFECTS.TURN_LEFT,
                            value: 1,
                            onlyInSubmenu: true,
                        },
                        {
                            type: EFFECTS.TURN_LEFT_THEN_STOP,
                            value: 1,
                            text: 'then stop',
                            onlyInSubmenu: true,
                        },

                        { type: EFFECTS.TURN_LEFT, value: 2 },
                        { type: EFFECTS.TURN_RIGHT, value: 2 },
                    ],
                },
            },
        ],
    },
    [SUBSYSTEMS.MISSILE_RACK]: {
        type: SUBSYSTEMS.MISSILE_RACK,
        abilities: [
            {
                costs: [
                    {
                        type: COSTS.ENERGY,
                        value: 3,
                    },
                    {
                        type: COSTS.ANGLE,
                        value: 3,
                    },
                    {
                        type: COSTS.RANGE,
                        value: 2,
                    },
                ],
                text: 'Barrage',
                effects: {
                    or: [{ type: EFFECTS.DAMAGE, value: '3 x 2' }],
                },
            },
        ],
    },
    [SUBSYSTEMS.BALLISTIC_RACK]: {
        type: SUBSYSTEMS.BALLISTIC_RACK,
        abilities: [],
    },
    [SUBSYSTEMS.LASER]: {
        type: SUBSYSTEMS.LASER,
        abilities: [],
    },
    [SUBSYSTEMS.DISRUPTOR]: {
        type: SUBSYSTEMS.DISRUPTOR,
        abilities: [],
    },
    [SUBSYSTEMS.RAILGUN]: {
        type: SUBSYSTEMS.RAILGUN,
        abilities: [],
    },
    [SUBSYSTEMS.PLASMA_CANNONS]: {
        type: SUBSYSTEMS.PLASMA_CANNONS,
        abilities: [],
    },
};
