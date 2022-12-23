import { useCallback, useEffect, useState } from 'react';
import { useSpring } from '@react-spring/three';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectLaserVisualAid,
    weaponCleanupRequested,
} from '../../../../../../reducers/playerReducer';
import Line from '../../../../../common/Line';
import { SUBSYSTEMS } from 'pium-pium-engine';

const LASER_TIMEOUT = 500;

export const Laser = function ({
    source,
    target,
    setLaserRef,
    cleanupLaserRef,
}) {
    const dispatch = useDispatch();
    const [localLaserRef, setLocalLaserRef] = useState(null);
    useEffect(() => {
        return () => {
            cleanupLaserRef([localLaserRef]);
        };
    }, [localLaserRef]);
    const addLaserRef = useCallback((el) => {
        if (!el) return;
        setLocalLaserRef(el);
        setLaserRef(el);
    }, []);

    useEffect(() => {
        setTimeout(
            () =>
                dispatch(
                    weaponCleanupRequested({ type: SUBSYSTEMS.LASER, target })
                ),
            LASER_TIMEOUT
        );
    }, []);

    return (
        <Line
            ref={addLaserRef}
            start={source}
            end={target}
            color={[10, 0, 0]}
        ></Line>
    );
};

export default function Weapons({
    ships,
    setBloomGeometryRef,
    cleanupBloomGeometryRef,
}) {
    const shipMap = ships?.reduce((previous, current) => {
        previous[current.id] = current;
        return previous;
    }, {});
    const laser = useSelector(selectLaserVisualAid);
    return (
        <>
            {laser.show && (
                <Laser
                    setLaserRef={setBloomGeometryRef}
                    cleanupLaserRef={cleanupBloomGeometryRef}
                    source={shipMap[laser.source].position}
                    target={shipMap[laser.target].position}
                ></Laser>
            )}
        </>
    );
}
