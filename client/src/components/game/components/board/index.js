import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { forwardRef, useEffect, useRef, useState } from 'react';
import * as SC from './index.styles';
import {
    Stars,
    OrbitControls,
    Plane,
    Stats,
    PerspectiveCamera,
    Circle,
} from '@react-three/drei';
import Ship from './components/ship';
import { useDispatch, useSelector } from 'react-redux';
import { selectShips } from 'pium-pium-engine';
import { Vector3, TextureLoader, BackSide } from 'three';
import {
    EffectComposer,
    GodRays,
    SelectiveBloom,
} from '@react-three/postprocessing';
import { KernelSize, BlendFunction, Resizer } from 'postprocessing';

import PlayerList from './components/playerList';
import {
    CAMERA_MODES,
    selectCameraMode,
    selectSelectedShip,
    setCameraMode,
    setSelectedShip,
} from '../../../../reducers/playerReducer';

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

const Sun = forwardRef(function Sun(props, forwardRef) {
    return (
        <Circle
            args={[30, 30]}
            ref={forwardRef}
            position={[0, 50, 500]}
            rotation-y={Math.PI}
            {...props}
        >
            <meshBasicMaterial color="lightblue" />
        </Circle>
    );
});

function Scene() {
    const materialArray = [];
    const dispatch = useDispatch();
    const ships = useSelector(selectShips);
    const camera = useRef(null);
    const controls = useRef(null);
    const [lastCameraMode, setLastCameraMode] = useState(null);
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
    const targetShip = (ship) => {
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
    const lookDown = () => {
        if (lastCameraMode !== CAMERA_MODES.MAP) {
            controls.current.reset();
            setCameraPosition(new Vector3(0, 120, 0));
            setCameraTarget(new Vector3(0, 0, 0));
            setCameraMoved(false);
        }
    };

    useEffect(() => {
        setLastCameraMode(cameraMode);
    }, []);

    const cameraMode = useSelector(selectCameraMode);
    const selectedShip = useSelector(selectSelectedShip);
    useEffect(() => {
        switch (cameraMode) {
            case CAMERA_MODES.FOLLOW: {
                targetShip(ships.find((ship) => ship.id === selectedShip));
                break;
            }
            case CAMERA_MODES.MAP: {
                lookDown();
                break;
            }
        }
        setLastCameraMode(cameraMode);
    }, [ships, cameraMode]);

    const whiteBloomLightRef = useRef([]);
    const whiteBloomGeometryRef = useRef([]);
    const sunRef = useRef();

    const setWhiteBloomLightRef = (el) => {
        if (el) {
            whiteBloomLightRef.current.push(el);
        }
    };
    const setWhiteBloomGeometryRef = (el) => {
        if (el) {
            whiteBloomGeometryRef.current.push(el);
        }
    };

    return (
        <>
            <Stats></Stats>
            <Stars saturation={10} />
            <fogExp2 color={'black'} density={0.0015} attach="fog" />
            <ambientLight color="white" intensity={0.5} />
            <Sun ref={sunRef} />
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
                    ship={ship}
                    onClick={() => {
                        dispatch(setSelectedShip({ shipId: ship.id }));
                        dispatch(setCameraMode(CAMERA_MODES.FOLLOW));
                    }}
                    setBloomLightRef={setWhiteBloomLightRef}
                    setBloomGeometryRef={setWhiteBloomGeometryRef}
                ></Ship>
            ))}
            <Plane rotation-x={-Math.PI / 2} args={[100, 100, 100, 100]}>
                <meshBasicMaterial
                    opacity={0.01}
                    color="darkgrey"
                    transparent
                />
            </Plane>
            <gridHelper args={[100, 100]}></gridHelper>
            <PerspectiveCamera makeDefault ref={camera} />
            <OrbitControls
                enableRotate={cameraMode !== CAMERA_MODES.MAP}
                onStart={() => {
                    if (cameraMode === CAMERA_MODES.FOLLOW) {
                        dispatch(setCameraMode(CAMERA_MODES.FREE));
                    }
                    setCameraMoved(true);
                }}
                ref={controls}
            />

            <EffectComposer autoClear={false}>
                {sunRef?.current && (
                    <GodRays
                        sun={sunRef?.current}
                        blendFunction={BlendFunction.Screen}
                        samples={60}
                        density={0.96}
                        decay={0.9}
                        weight={0.4}
                        exposure={0.6}
                        clampMax={1}
                        width={Resizer.AUTO_SIZE}
                        height={Resizer.AUTO_SIZE}
                        kernelSize={KernelSize.SMALL}
                        blur={true}
                    />
                )}
                <SelectiveBloom
                    lights={whiteBloomLightRef?.current}
                    selection={whiteBloomGeometryRef?.current}
                    selectionLayer={1}
                    intensity={3}
                    luminanceThreshold={0.75}
                    luminanceSmoothing={0.025}
                    blurPass={null}
                    kernelSize={KernelSize.LARGE}
                />
            </EffectComposer>
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
