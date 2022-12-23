import { Canvas, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as SC from './index.styles';
import {
    Stars,
    OrbitControls,
    Plane,
    PerspectiveCamera,
} from '@react-three/drei';
import { Perf } from 'r3f-perf';
import Ship from './components/ship';
import { useDispatch, useSelector } from 'react-redux';
import { selectShips } from 'pium-pium-engine';
import { Vector3 } from 'three';
import { EffectComposer } from '@react-three/postprocessing';

import PlayerList from './components/playerList';
import {
    CAMERA_MODES,
    PLAYER_MODE,
    selectCameraMode,
    selectPlayerId,
    selectPlayerMode,
    selectSelectedShip,
    setCameraMode,
    setSelectedShip,
    targetSelectedAction,
} from '../../../../reducers/playerReducer';
import {
    MemoizedGodRays,
    MemoizedSelectiveBloom,
    MemoizedOutline,
    MemoizedSkyBox,
    Sun,
} from './components/environment';
import {
    addRefToArrayCallbackFactory,
    removeRefFromArrayCallbackFactory,
} from '../../../common/utils/refUtils';
import Weapons from './components/weapons';

function Scene() {
    const dispatch = useDispatch();
    const ships = useSelector(selectShips);
    const playerId = useSelector(selectPlayerId);
    const camera = useRef(null);
    const controls = useRef(null);
    const [lastCameraMode, setLastCameraMode] = useState(null);
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
        }
    });
    const targetShip = (ship) => {
        setCameraTarget(new Vector3(...ship?.position));
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
                const currentShip = ships.find(
                    (ship) => ship.id === selectedShip
                );
                if (currentShip) {
                    targetShip(currentShip);
                } else {
                    dispatch(setCameraMode(CAMERA_MODES.FREE));
                }
                break;
            }
            case CAMERA_MODES.MAP: {
                lookDown();
                break;
            }
        }
        setLastCameraMode(cameraMode);
    }, [ships, cameraMode, selectedShip]);

    const [bloomGeometryRefs, setBloomGeometryRefs] = useState([]);
    const [sunRef, setSunRef] = useState();
    const [shipRefs, setShipRefs] = useState([]);
    const [hoveredItemRef, setHoveredItemRef] = useState(null);

    const setBloomGeometryRef =
        addRefToArrayCallbackFactory(setBloomGeometryRefs);

    const setShipRef = addRefToArrayCallbackFactory(setShipRefs);

    const cleanupBloomGeometryRef =
        removeRefFromArrayCallbackFactory(setBloomGeometryRefs);

    const cleanupShipRef = removeRefFromArrayCallbackFactory(setShipRefs);

    const playerMode = useSelector(selectPlayerMode);

    const onShipClicked = useCallback(
        (e) => {
            const shipId = e.eventObject.userData.shipId;
            const ship = ships.find((ship) => ship.id === shipId);
            if (playerMode === PLAYER_MODE.TARGETING) {
                dispatch(targetSelectedAction(shipId));
            } else {
                setCameraPosition(
                    new Vector3(
                        ...ship?.position.map((coord) =>
                            coord > 0 ? coord + 5 : coord - 5
                        )
                    )
                );
                dispatch(setSelectedShip({ shipId }));
                dispatch(setCameraMode(CAMERA_MODES.FOLLOW));
                setCameraMoved(false);
            }
        },
        [ships]
    );

    const [outlineColor, setOutlineColor] = useState('white');

    const onShipHovered = useCallback(
        (e) => {
            const shipId = e.eventObject.userData.shipId;
            const ship = ships.find((ship) => ship.id === shipId);
            const shipRef = shipRefs.find(
                (ref) => ref.userData.shipId === shipId
            );
            setOutlineColor(ship.playerId === playerId ? 'white' : 'red');
            setHoveredItemRef(shipRef);
        },
        [shipRefs]
    );

    const cleanupHover = useCallback(() => setHoveredItemRef(null));

    const onMovementStart = useCallback((event) => {
        setCameraPosition(event.target.object.position);
        setCameraMoved(true);
    }, []);

    const onMovementEnd = useCallback((event) => {
        setCameraPosition(event.target.object.position);
    });

    const ambientLightRef = useRef();

    return (
        <>
            <Perf position="top-left" showGraph />
            <Stars saturation={10} />
            <fogExp2 color={'black'} density={0.0015} attach="fog" />
            <ambientLight ref={ambientLightRef} color="white" intensity={0.5} />
            <Sun ref={setSunRef} />
            <MemoizedSkyBox />
            {ships.map((ship) => (
                <Ship
                    id={ship.id}
                    key={ship.id}
                    ship={ship}
                    onPointerEnter={onShipHovered}
                    onPointerLeave={cleanupHover}
                    onClick={onShipClicked}
                    setShipRef={setShipRef}
                    setBloomGeometryRef={setBloomGeometryRef}
                    cleanupShipRef={cleanupShipRef}
                    cleanupBloomGeometryRef={cleanupBloomGeometryRef}
                ></Ship>
            ))}
            <Weapons
                ships={ships}
                setBloomGeometryRef={setBloomGeometryRef}
                cleanupBloomGeometryRef={cleanupBloomGeometryRef}
            />
            <Plane rotation-x={-Math.PI / 2} args={[100, 100, 100, 100]}>
                <meshBasicMaterial
                    opacity={0.01}
                    color="darkgrey"
                    transparent
                />
            </Plane>
            <gridHelper args={[100, 100]} />
            <PerspectiveCamera makeDefault ref={camera} />
            <OrbitControls
                enableRotate={cameraMode !== CAMERA_MODES.MAP}
                onStart={onMovementStart}
                onEnd={onMovementEnd}
                ref={controls}
            />

            <EffectComposer autoClear={false}>
                {sunRef && <MemoizedGodRays sun={sunRef} />}
                {bloomGeometryRefs && ambientLightRef && (
                    <MemoizedSelectiveBloom
                        lights={[ambientLightRef]}
                        geometries={bloomGeometryRefs}
                    />
                )}
                {hoveredItemRef && (
                    <MemoizedOutline
                        geometries={[hoveredItemRef]}
                        color={outlineColor}
                    />
                )}
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
