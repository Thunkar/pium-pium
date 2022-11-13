export const Thrusters = {
    name: 'thrusters',
    abilities: [
        {
            costs: [{ value: 2, type: 'energy' }],
            text: 'Burn',
            effects: {
                or: [{ name: 'accelerate', value: 1 }],
            },
        },
        {
            costs: [{ value: 2, type: 'energy' }],
            text: 'Maneuver',
            effects: {
                or: [{ name: 'turn', value: 1 }],
            },
        },
        {
            costs: [
                { value: 2, type: 'energy' },
                { value: 2, type: 'heat' },
            ],
            text: 'Afterburners',
            effects: {
                or: [{ name: 'accelerate', value: 1 }],
            },
        },
    ],
};

export const ManeuveringThrusters = {
    name: 'maneuvering_thrusters',
    abilities: [
        {
            costs: [{ value: 1, type: 'energy' }],
            text: 'Maneuver',
            effects: {
                or: [{ name: 'turn', value: 2 }],
            },
        },
    ],
};
