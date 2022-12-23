import Vec3 from 'vec3';

export function vectorFromMagnitudeAndAngle(magnitude, angle) {
    return new Vec3(
        magnitude * Math.sin(angle),
        0,
        magnitude * Math.cos(angle)
    );
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const throwD10 = () => {
    return randomIntFromInterval(0, 10);
};
