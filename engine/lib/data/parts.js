export const Costs = {
    ENERGY: 'energy',
    HEAT: 'heat',
};

export const Effects = {
    TURN_RIGHT: 'turn-right',
    TURN_LEFT: 'turn-left',
    TURN_RIGHT_THEN_STOP: 'turn-right-then-stop',
    TURN_LEFT_THEN_STOP: 'turn-left-then-stop',
    ACCELERATE: 'accelerate',
};

export const Thrusters = {
    name: 'thrusters',
    abilities: [
        {
            costs: [{ value: 2, type: Costs.ENERGY }],
            text: 'Burn',
            effects: {
                or: [{ name: Effects.ACCELERATE, value: 1 }],
            },
        },
        {
            costs: [
                { value: 2, type: Costs.ENERGY },
                { value: 2, type: Costs.HEAT },
            ],
            text: 'Afterburners',
            effects: {
                or: [{ name: Effects.ACCELERATE, value: 1 }],
            },
        },
        {
            costs: [{ value: 2, type: Costs.ENERGY }],
            text: 'Maneuver',
            effects: {
                or: [
                    { name: Effects.TURN_LEFT, value: 1 },
                    { name: Effects.TURN_RIGHT, value: 1 },
                ],
            },
        },
    ],
};

export const ManeuveringThrusters = {
    name: 'maneuvering_thrusters',
    abilities: [
        {
            costs: [{ value: 1, type: Costs.ENERGY }],
            text: 'Maneuver',
            effects: {
                or: [
                    {
                        name: 'turn-right-then-stop',
                        value: 1,
                        text: 'then stop',
                        onlyInSubmenu: true,
                    },
                    { name: Effects.TURN_RIGHT, value: 1, onlyInSubmenu: true },
                    { name: Effects.TURN_LEFT, value: 1, onlyInSubmenu: true },
                    {
                        name: 'turn-left-then-stop',
                        value: 1,
                        text: 'then stop',
                        onlyInSubmenu: true,
                    },

                    { name: Effects.TURN_LEFT, value: 2 },
                    { name: Effects.TURN_RIGHT, value: 2 },
                ],
            },
        },
    ],
};

export const Missiles = {
    name: 'missile',
    abilities: [
        {
            costs: [
                {
                    type: 'energy',
                    value: 3,
                },
                {
                    type: 'angle',
                    value: 3,
                },
                {
                    type: 'range',
                    value: 2,
                },
            ],
            text: 'Barrage',
            effects: {
                or: [{ name: 'damage', value: '3 x 2' }],
            },
        },
    ],
};
