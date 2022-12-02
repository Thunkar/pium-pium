import { useGLTF, Billboard, Text, useHelper } from '@react-three/drei';
import { animated, config, useSpring, useSpringRef } from '@react-spring/three';
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing';

import { KernelSize } from 'postprocessing';

import { Fragment, useRef } from 'react';

export default function Ship({ ship, onClick }) {
    const { nodes, materials } = useGLTF('assets/ship.gltf');
    const { position, rotation } = useSpring({
        position: ship.position,
        rotation: ship.rotation,
        config: {
            mass: 8,
            tension: 200,
            friction: 80,
        },
    });
    const motors = new Array(4).fill(null).map((value, index) => ({
        scale: [0.25, 0.05, 0.02],
        position: [
            -0.36 * (index % 3 ? -1 : 1),
            -0.25 * (index % 2 ? -1 : 1),
            -1.43,
        ],
        color: 'grey',
    }));
    const motorRef = useRef([]);
    const lightRef = useRef([]);
    return (
        <animated.group
            position={position}
            rotation-y={rotation}
            dispose={null}
            onClick={onClick}
        >
            <Billboard
                follow={true}
                lockX={false}
                lockY={false}
                lockZ={false}
                rotation={[Math.PI / 2, 0, 0]}
                position={[0, 1, 0]}
            >
                <Text fontSize={0.3}>{ship.name}</Text>
            </Billboard>
            <mesh
                geometry={nodes['Corvette-F3'].geometry}
                material={materials['SF_Corvette_F3.001']}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.001}
                castShadow
                receiveShadow
            />{' '}
            <EffectComposer autoclear={false}>
                <SelectiveBloom
                    lights={lightRef.current}
                    selection={motorRef.current}
                    selectionLayer={10}
                    intensity={3}
                    luminanceThreshold={0.15}
                    luminanceSmoothing={0.025}
                    blurPass={null}
                    kernelSize={KernelSize.LARGE}
                />
            </EffectComposer>
            {motors.map((motor, index) => (
                <Fragment key={`motor-${index}`}>
                    <animated.ambientLight
                        color="white"
                        ref={(el) => (lightRef.current[index] = el)}
                        position={[
                            motor.position[0],
                            motor.position[1],
                            motor.position[2] - 1,
                        ]}
                        intensity={0.5}
                        castShadow={true}
                    ></animated.ambientLight>
                    <mesh
                        ref={(el) => (motorRef.current[index] = el)}
                        position={motor.position}
                        scale={motor.scale}
                    >
                        <boxGeometry attach="geometry" />
                        <meshStandardMaterial color="grey" attach="material" />
                    </mesh>
                </Fragment>
            ))}
        </animated.group>
    );
}

useGLTF.preload('assets/ship.gltf');
