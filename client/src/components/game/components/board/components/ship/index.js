import { useGLTF, Billboard, Text, Circle } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectRangeVisualAid } from '../../../../../../reducers/playerReducer';
import RangeAid from './components/rangeAid';
import Line from '../../../../../common/Line';

function Ship({
    ship,
    onClick,
    onPointerEnter,
    onPointerLeave,
    setShipRef,
    setBloomGeometryRef,
    cleanupShipRef,
    cleanupBloomGeometryRef,
}) {
    const [localShipRef, setLocalShipRef] = useState(null);
    const [localBloomGeometryRefs, setLocalBloomGeometryRefs] = useState([]);
    useEffect(() => {
        return () => {
            cleanupShipRef([localShipRef]);
            cleanupBloomGeometryRef(localBloomGeometryRefs);
        };
    }, [localShipRef, localBloomGeometryRefs]);
    const addShipRef = useCallback((el) => {
        if (!el) return;
        setLocalShipRef(el);
        setShipRef(el);
    }, []);
    const addBloomGeometryRef = useCallback((el) => {
        if (!el) return;
        setLocalBloomGeometryRefs((currentRefs) => currentRefs.concat([el]));
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
            motorIntensity: 1,
        },
        to: {
            motorIntensity: 2,
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
        color: [2, 2, 2],
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
                onClick={onClick}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
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
                    userData={{
                        shipId: ship.id,
                    }}
                    ref={addShipRef}
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
                                toneMapped={false}
                            />
                        </mesh>
                    </Fragment>
                ))}
                <animated.pointLight
                    color={motors[0].color}
                    position={[0, 0, -2]}
                    intensity={motorIntensity}
                    decay={1.5}
                    distance={1.8}
                    castShadow
                ></animated.pointLight>
                <Line start={[0, 0, 0]} end={[0, -2, 0]} color="grey" />
                <Circle
                    args={[0.2, 50]}
                    rotation-x={-Math.PI / 2}
                    position={[0, -2, 0]}
                >
                    <meshBasicMaterial color="grey" />
                </Circle>
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
