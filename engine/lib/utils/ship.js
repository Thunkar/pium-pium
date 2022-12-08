import Vec3 from 'vec3';
import {
    uniqueNamesGenerator,
    adjectives,
    animals,
} from 'unique-names-generator';
import { Subsystems } from '../index.mjs';

export const INITIAL_POSITIONS = [
    { x: 0, y: -50 },
    { x: -50, y: 0 },
    { x: 0, y: 50 },
    { x: 50, y: 0 },
];

export const INITIAL_ROTATIONS = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

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

export const ROTATION_INCREMENT = Math.PI / 4;

export const ALLOWED_AXES = new Array(8)
    .fill(null)
    .map((value, index) => (index * Math.PI) / 4);

export function vectorFromMagnitudeAndAngle(magnitude, angle) {
    return new Vec3(
        magnitude * Math.sin(angle),
        0,
        magnitude * Math.cos(angle)
    );
}

export function addSpeeds(currentSpeed) {
    return Object.keys(currentSpeed).reduce(
        (previous, angle) =>
            previous.add(
                vectorFromMagnitudeAndAngle(
                    currentSpeed[angle],
                    parseFloat(angle, 10)
                )
            ),
        new Vec3(0, 0, 0)
    );
}

export function applyThrustVector(
    currentSpeed,
    currentPosition,
    thrustAngle,
    thrustMagnitude
) {
    let normalizedAngle = thrustAngle % (2 * Math.PI);
    if (normalizedAngle >= Math.PI) {
        thrustMagnitude = -thrustMagnitude;
        normalizedAngle = normalizedAngle % Math.PI;
    }
    const affectedDirectionMagnitude = currentSpeed[normalizedAngle.toFixed(5)];
    const isBraking =
        affectedDirectionMagnitude !== 0 &&
        Math.sign(affectedDirectionMagnitude) !== Math.sign(thrustMagnitude);
    let newPosition;
    if (isBraking) {
        if (Math.abs(thrustMagnitude) <= Math.abs(affectedDirectionMagnitude)) {
            newPosition = [...currentPosition];
        } else {
            newPosition = new Vec3(currentPosition)
                .add(
                    vectorFromMagnitudeAndAngle(
                        thrustMagnitude + affectedDirectionMagnitude,
                        normalizedAngle
                    )
                )
                .toArray();
        }
    } else {
        newPosition = new Vec3(currentPosition)
            .add(vectorFromMagnitudeAndAngle(thrustMagnitude, normalizedAngle))
            .toArray();
    }

    const newSpeed = {
        ...currentSpeed,
        [normalizedAngle.toFixed(5)]:
            affectedDirectionMagnitude + thrustMagnitude,
    };
    return { newSpeed, newPosition };
}

export function applyRotation(
    currentRotationalSpeed,
    currentRotation,
    angleDelta,
    selfContained
) {
    const isBraking =
        currentRotationalSpeed !== 0 &&
        Math.sign(currentRotationalSpeed) !== Math.sign(angleDelta) &&
        !selfContained;
    let newRotation;
    if (isBraking) {
        if (Math.abs(angleDelta) <= Math.abs(currentRotationalSpeed)) {
            newRotation = currentRotation + angleDelta + currentRotationalSpeed;
        } else {
            newRotation = currentRotation;
        }
    } else {
        newRotation = currentRotation + angleDelta;
    }
    const newRotationalSpeed = currentRotationalSpeed + angleDelta;
    return { newRotation, newRotationalSpeed };
}

export function createShip(id, name, playerId, position, rotation) {
    const defaultStatus = {
        power: {
            current: 0,
            used: 0,
        },
        heat: 0,
    };
    return {
        id,
        name:
            name ||
            `The ${uniqueNamesGenerator({
                dictionaries: [adjectives, animals],
                separator: ' ',
                style: 'capital',
            })}`,
        playerId: playerId,
        speed: {
            directional: ALLOWED_AXES.slice(0, 4).reduce(
                (previous, current) => ({
                    ...previous,
                    [current.toFixed(5)]: 0,
                }),
                {}
            ),
            rotational: 0,
        },
        position: new Vec3(position.x, 2, position.y).toArray(),
        rotation: rotation,
        hull: 20,
        reactor: {
            total: 10,
            current: 10,
            maxVent: 3,
            vented: 0,
            heat: 0,
        },
        deflectors: {
            status: defaultStatus,
            position: 0,
            width: 0,
        },
        aft: [
            {
                type: Subsystems.THRUSTERS,
                name: 'Main thrusters',
                status: defaultStatus,
            },
            {
                type: Subsystems.MANEUVERING_THRUSTERS,
                name: 'Maneuvering thrusters',
                status: defaultStatus,
            },
            {
                type: Subsystems.BALLISTIC_RACK,
                name: 'Aft ballistics',
                status: defaultStatus,
            },
        ],
        port: [
            {
                type: Subsystems.PLASMA_CANNONS,
                name: 'Port plasma cannons',
                status: defaultStatus,
            },
            {
                type: Subsystems.MISSILE_RACK,
                name: 'Port missiles',
                status: defaultStatus,
            },
            {
                type: Subsystems.BALLISTIC_RACK,
                name: 'Port ballistics',
                status: defaultStatus,
            },
        ],
        starboard: [
            {
                type: Subsystems.PLASMA_CANNONS,
                name: 'Starboard plasma cannons',
                status: defaultStatus,
            },
            {
                type: Subsystems.MISSILE_RACK,
                name: 'Starboard missiles',
                status: defaultStatus,
            },
            {
                type: Subsystems.BALLISTIC_RACK,
                name: 'Port ballistics',
                status: defaultStatus,
            },
        ],
        forward: [
            {
                type: Subsystems.THRUSTERS,
                name: 'Retro thrusters',
                status: defaultStatus,
            },
            {
                type: Subsystems.DISRUPTOR,
                name: 'Forward disruptor',
                status: defaultStatus,
            },
            {
                type: Subsystems.LASER,
                name: 'Forward laser',
                status: defaultStatus,
            },
            {
                type: Subsystems.RAILGUN,
                name: 'Railgun',
                status: defaultStatus,
            },
        ],
    };
}
