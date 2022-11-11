import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as SC from './index.styles';
import {
    Stars,
    OrbitControls,
    Plane,
    Stats,
    PerspectiveCamera,
} from '@react-three/drei';
import Ship from './components/ship';
import { useSelector } from 'react-redux';
import {
    selectCurrentTimer,
    selectCurrentTurn,
    selectPlayers,
    selectPlayerShips,
    selectShips,
} from 'pium-pium-engine';
import { Vector3 } from 'three';

function Game() {
    const ships = useSelector(selectShips);
    const playerShips = useSelector(selectPlayerShips);
    const players = useSelector(selectPlayers);
    const currentTurn = useSelector(selectCurrentTurn);
    const currentTimer = useSelector(selectCurrentTimer);
    const camera = useRef(null);
    const controls = useRef(null);
    const [cameraTarget, setCameraTarget] = useState(new Vector3(0, 3, 0));
    const [cameraPosition, setCameraPosition] = useState(
        new Vector3(10, 10, 10)
    );
    const [cameraMoved, setCameraMoved] = useState(false);
    useFrame((state, delta) => {
        if (camera?.current && controls?.current && !cameraMoved) {
            camera.current.position.lerp(cameraPosition, delta * 3);
            controls.current.target.lerp(cameraTarget, delta * 3);
            controls.current.update();
            if (
                camera.current.position.distanceTo(cameraPosition) < 0.1 &&
                controls.current.target.distanceTo(cameraTarget) < 0.1
            ) {
                setCameraMoved(true);
            }
        }
    });
    const onShipClicked = (ship) => {
        setCameraPosition(
            new Vector3(
                ...ship.position.map((coord) =>
                    coord > 0 ? coord + 5 : coord - 5
                )
            )
        );
        setCameraTarget(new Vector3(...ship.position));
        setCameraMoved(false);
    };
    return (
        <>
            <Stats></Stats>
            <Stars />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {ships.map((ship) => (
                <Ship
                    key={ship.id}
                    rotation-y={ship.rotation}
                    position={ship.position}
                    onClick={() => onShipClicked(ship)}
                ></Ship>
            ))}
            <Plane rotation-x={-Math.PI / 2} args={[100, 100, 100, 100]}>
                <meshBasicMaterial
                    opacity={0.15}
                    color="darkgrey"
                    transparent
                />
            </Plane>
            <gridHelper args={[100, 100]}></gridHelper>
            <PerspectiveCamera makeDefault ref={camera} />
            <OrbitControls ref={controls} />
        </>
    );
}

export function Board() {
    return (
        <SC.Container>
            <Canvas>
                <Game></Game>
            </Canvas>
        </SC.Container>
    );
}
