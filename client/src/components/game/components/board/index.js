import { Canvas, useFrame, useLoader } from '@react-three/fiber';
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
    selectShips,
} from 'pium-pium-engine';
import { Vector3, TextureLoader, BackSide } from 'three';
import PlayerList from './components/playerList';

let skyboxImage = 'milky_way';

function createPathStrings(filename) {
    const basePath = `assets/skyboxes/${filename}/`;
    const baseFilename = basePath + filename;
    const fileType = '.png';
    const sides = ['ft', 'bk', 'up', 'dn', 'rt', 'lf'];
    const pathStings = sides.map((side) => {
        return baseFilename + '_' + side + fileType;
    });

    return pathStings;
}

function Scene() {
    const materialArray = [];
    const ships = useSelector(selectShips);
    const camera = useRef(null);
    const controls = useRef(null);
    const [cameraTarget, setCameraTarget] = useState(new Vector3(0, 3, 0));
    const [cameraPosition, setCameraPosition] = useState(
        new Vector3(10, 10, 10)
    );
    const [cameraMoved, setCameraMoved] = useState(false);
    if (materialArray.length === 0) {
        const skyboxImagePaths = createPathStrings(skyboxImage);
        skyboxImagePaths.forEach((image) =>
            materialArray.push(useLoader(TextureLoader, image))
        );
    }
    useFrame((state, delta) => {
        if (camera?.current && controls?.current && !cameraMoved) {
            camera.current.position.lerp(cameraPosition, delta * 3);
            controls.current.target.lerp(cameraTarget, delta * 3);
            controls.current.update();
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
            <pointLight position={[0, 0, 0]} />
            <fogExp2 args={[0x202020, 0.001]} attach={'fog'}></fogExp2>
            <mesh>
                <boxGeometry
                    args={[2000, 2000, 2000]}
                    attach={'geometry'}
                ></boxGeometry>
                {materialArray.map((texture, index) => (
                    <meshBasicMaterial
                        attach={`material-${index}`}
                        key={texture.id}
                        map={texture}
                        side={BackSide}
                    ></meshBasicMaterial>
                ))}
            </mesh>

            {ships.map((ship) => (
                <Ship
                    key={ship.id}
                    rotation-y={ship.rotation}
                    position={ship.position}
                    name={ship.name}
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
            <OrbitControls
                onStart={() => setCameraMoved(true)}
                ref={controls}
            />
        </>
    );
}

export function Board() {
    return (
        <SC.Container>
            <PlayerList></PlayerList>
            <Canvas>
                <Scene></Scene>
            </Canvas>
        </SC.Container>
    );
}
