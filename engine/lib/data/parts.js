export const Costs = {
    ENERGY: 'energy',
    HEAT: 'heat',
    RANGE: 'range',
    ANGLE: 'angle',
};

export const Effects = {
    TURN_RIGHT: 'turn-right',
    TURN_LEFT: 'turn-left',
    TURN_RIGHT_THEN_STOP: 'turn-right-then-stop',
    TURN_LEFT_THEN_STOP: 'turn-left-then-stop',
    ACCELERATE: 'accelerate',
    DAMAGE: 'damage',
};

export const Subsystems = {
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
    [Subsystems.THRUSTERS]: {
        type: Subsystems.THRUSTERS,
        abilities: [
            {
                costs: [{ value: 2, type: Costs.ENERGY }],
                text: 'Burn',
                effects: {
                    or: [{ type: Effects.ACCELERATE, value: 1 }],
                },
            },
            {
                costs: [
                    { value: 2, type: Costs.ENERGY },
                    { value: 2, type: Costs.HEAT },
                ],
                text: 'Afterburners',
                effects: {
                    or: [{ type: Effects.ACCELERATE, value: 2 }],
                },
            },
            {
                costs: [{ value: 2, type: Costs.ENERGY }],
                text: 'Maneuver',
                effects: {
                    or: [
                        { type: Effects.TURN_LEFT, value: 1 },
                        { type: Effects.TURN_RIGHT, value: 1 },
                    ],
                },
            },
        ],
    },
    [Subsystems.MANEUVERING_THRUSTERS]: {
        type: Subsystems.MANEUVERING_THRUSTERS,
        abilities: [
            {
                costs: [{ value: 1, type: Costs.ENERGY }],
                text: 'Maneuver',
                effects: {
                    or: [
                        {
                            type: Effects.TURN_RIGHT_THEN_STOP,
                            value: 1,
                            text: 'then stop',
                            onlyInSubmenu: true,
                        },
                        {
                            type: Effects.TURN_RIGHT,
                            value: 1,
                            onlyInSubmenu: true,
                        },
                        {
                            type: Effects.TURN_LEFT,
                            value: 1,
                            onlyInSubmenu: true,
                        },
                        {
                            type: Effects.TURN_LEFT_THEN_STOP,
                            value: 1,
                            text: 'then stop',
                            onlyInSubmenu: true,
                        },

                        { type: Effects.TURN_LEFT, value: 2 },
                        { type: Effects.TURN_RIGHT, value: 2 },
                    ],
                },
            },
        ],
    },
    [Subsystems.MISSILE_RACK]: {
        type: Subsystems.MISSILE_RACK,
        abilities: [
            {
                costs: [
                    {
                        type: Costs.ENERGY,
                        value: 3,
                    },
                    {
                        type: Costs.ANGLE,
                        value: 3,
                    },
                    {
                        type: Costs.RANGE,
                        value: 2,
                    },
                ],
                text: 'Barrage',
                effects: {
                    or: [{ type: Effects.DAMAGE, value: '3 x 2' }],
                },
            },
        ],
    },
    [Subsystems.BALLISTIC_RACK]: {
        type: Subsystems.BALLISTIC_RACK,
        abilities: [],
    },
    [Subsystems.LASER]: {
        type: Subsystems.LASER,
        abilities: [],
    },
    [Subsystems.DISRUPTOR]: {
        type: Subsystems.DISRUPTOR,
        abilities: [],
    },
    [Subsystems.RAILGUN]: {
        type: Subsystems.RAILGUN,
        abilities: [],
    },
    [Subsystems.PLASMA_CANNONS]: {
        type: Subsystems.PLASMA_CANNONS,
        abilities: [],
    },
};
