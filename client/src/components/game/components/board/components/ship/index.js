import { useGLTF, Billboard, Text } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectRangeVisualAid } from '../../../../../../reducers/playerReducer';
import RangeAid from './components/rangeAid';

function Ship({
    ship,
    onClick,
    setBloomLightRef,
    setBloomGeometryRef,
    cleanupBloomLightRefs,
    cleanupBloomGeometryRefs,
}) {
    const [bloomLightRefs, setBloomLightRefs] = useState([]);
    const [bloomGeometryRefs, setBloomGeometryRefs] = useState([]);
    useEffect(() => {
        return () => {
            cleanupBloomGeometryRefs(bloomGeometryRefs);
            cleanupBloomLightRefs(bloomLightRefs);
        };
    }, [bloomLightRefs, bloomGeometryRefs]);
    const addBloomLightRef = useCallback((el) => {
        if (!el) return;
        setBloomLightRefs((currentRefs) => currentRefs.concat([el]));
        setBloomLightRef(el);
    }, []);
    const addBloomGeometryRef = useCallback((el) => {
        if (!el) return;
        setBloomGeometryRefs((currentRefs) => currentRefs.concat([el]));
        setBloomGeometryRef(el);
    }, []);
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
            precision: 0.0001,
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
    const rangeAid = useSelector((state) =>
        selectRangeVisualAid(state, ship.id)
    );
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
                userData={{
                    shipId: ship.id,
                }}
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
                            ref={addBloomGeometryRef}
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
                    ref={addBloomLightRef}
                    position={[0, 0, -2]}
                    intensity={motorIntensity}
                    decay={1.5}
                    distance={1.8}
                    castShadow
                ></animated.pointLight>
                {rangeAid && rangeAid.show && (
                    <RangeAid
                        orientation={rangeAid.orientation}
                        angle={rangeAid.angle}
                        range={rangeAid.range}
                    ></RangeAid>
                )}
            </animated.group>
        </>
    );
}

export default memo(Ship);

useGLTF.preload('assets/ship.gltf');
