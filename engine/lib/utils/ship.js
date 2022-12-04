import Vec3 from 'vec3';

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
