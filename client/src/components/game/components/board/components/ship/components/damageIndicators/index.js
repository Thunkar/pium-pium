import { animated, useSpring } from '@react-spring/three';
import { Billboard, Text } from '@react-three/drei';

export default function DamageIndicators({ damage }) {
    return (
        <animated.mesh position={billboardPosition}>
            <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
                <Text fontSize={0.15}>{ship.name}</Text>
            </Billboard>
        </animated.mesh>
    );
}
