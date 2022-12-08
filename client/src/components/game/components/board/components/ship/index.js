import { useGLTF, Billboard, Text } from '@react-three/drei';
import { animated, config, to, useSpring } from '@react-spring/three';
import { Fragment } from 'react';
import { configs } from 'eslint-plugin-prettier';

export default function Ship({
    ship,
    onClick,
    setBloomLightRef,
    setBloomGeometryRef,
}) {
    const { nodes, materials } = useGLTF('assets/ship.gltf');
    const { position, billboardPosition, rotation } = useSpring({
        position: ship.position,
        billboardPosition: [
            ship.position[0],
            ship.position[1] + 1,
            ship.position[2],
        ],
        rotation: ship.rotation,
        config: {
            mass: 8,
            tension: 200,
            friction: 80,
        },
    });
    const { motorIntensity } = useSpring({
        from: {
            motorIntensity: 2,
        },
        to: {
            motorIntensity: 4,
        },
        config: {
            mass: 8,
            tension: 250,
            friction: 50,
        },
        loop: { reverse: true },
    });
    const motors = new Array(4).fill(null).map((value, index) => ({
        scale: [0.25, 0.05, 0.02],
        position: [
            -0.36 * (index % 3 ? -1 : 1),
            -0.25 * (index % 2 ? -1 : 1),
            -1.43,
        ],
        color: 'white',
    }));
    return (
        <>
            <animated.mesh position={billboardPosition}>
                <Billboard
                    follow={true}
                    lockX={false}
                    lockY={false}
                    lockZ={false}
                >
                    <Text fontSize={0.3}>{ship.name}</Text>
                </Billboard>
            </animated.mesh>
            <animated.group
                position={position}
                rotation-y={rotation}
                dispose={null}
                onClick={onClick}
            >
                <pointLight
                    color="white"
                    position={[0, 1, -1]}
                    intensity={0.7}
                    distance={4}
                    castShadow
                ></pointLight>
                <mesh
                    geometry={nodes['Corvette-F3'].geometry}
                    material={materials['SF_Corvette_F3.001']}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.001}
                    castShadow
                    receiveShadow
                />
                {motors.map((motor, index) => (
                    <Fragment key={`motor-${index}`}>
                        <mesh
                            ref={setBloomGeometryRef}
                            position={motor.position}
                            scale={motor.scale}
                        >
                            <boxGeometry attach="geometry" />
                            <meshStandardMaterial
                                color={motor.color}
                                attach="material"
                            />
                        </mesh>
                    </Fragment>
                ))}
                <animated.pointLight
                    color={motors[0].color}
                    ref={setBloomLightRef}
                    position={[0, 0, -2]}
                    intensity={motorIntensity}
                    decay={1.5}
                    distance={1.5}
                    castShadow
                ></animated.pointLight>
            </animated.group>
        </>
    );
}

useGLTF.preload('assets/ship.gltf');
