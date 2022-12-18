import { Circle } from '@react-three/drei';
import { ROTATION_INCREMENT } from 'pium-pium-engine';

export default function RangeAid({ orientation, angle, range }) {
    return (
        <Circle
            position={[0, -2, 0]}
            args={[range, 50, -Math.PI / 2 - angle / 2, angle]}
            rotation-z={-orientation}
            rotation-x={-Math.PI / 2}
        >
            <meshBasicMaterial color="green" />
        </Circle>
    );
}
