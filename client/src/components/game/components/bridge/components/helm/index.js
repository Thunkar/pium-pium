import * as SC from './index.styles';
import {
    addSpeeds,
    ROTATION_INCREMENT,
    vectorFromMagnitudeAndAngle,
} from 'pium-pium-engine';
import { useMemo } from 'react';
import Vec3 from 'vec3';
import { Typography } from '@mui/material';
import { CustomIcon } from '../../../../../common/CustomIcon';

export function Helm({ ship }) {
    const speedLines = useMemo(() => {
        if (ship?.speed?.directional) {
            const sumVector = addSpeeds(ship.speed.directional);
            const sumSpeedLine = (
                <SC.SpeedLine
                    key="sum"
                    color={'red'}
                    x1={0}
                    y1={0}
                    x2={-sumVector.x * 10}
                    y2={-sumVector.z * 10}
                ></SC.SpeedLine>
            );
            const rotationVector = vectorFromMagnitudeAndAngle(
                5,
                ship.rotation
            );
            const rotationLine = (
                <SC.SpeedLine
                    key="rotation"
                    color={'grey'}
                    x1={0}
                    y1={0}
                    x2={-rotationVector.x * 10}
                    y2={-rotationVector.z * 10}
                ></SC.SpeedLine>
            );
            const ordered = Object.keys(ship.speed.directional)
                .filter((angle) => ship.speed.directional[angle])
                .sort(
                    (a, b) =>
                        ship.speed.directional[b] - ship.speed.directional[a]
                )
                .map((angle) => ({
                    magnitude: ship.speed.directional[angle],
                    angle: parseFloat(angle, 10),
                }));
            const result = [];
            let accumulated = new Vec3(0, 0, 0);
            for (const speed of ordered) {
                const startPoint = accumulated.clone();
                const velocity = vectorFromMagnitudeAndAngle(
                    speed.magnitude,
                    speed.angle
                );
                accumulated.add(velocity);
                const finishPoint = velocity.add(startPoint);
                result.push(
                    <SC.SpeedLine
                        key={speed.angle}
                        dasharray={1}
                        x1={-startPoint.x * 10}
                        y1={-startPoint.z * 10}
                        x2={-finishPoint.x * 10}
                        y2={-finishPoint.z * 10}
                    ></SC.SpeedLine>
                );
            }
            return result.concat([rotationLine, sumSpeedLine]);
        }
    }, [ship?.speed?.directional, ship?.rotation]);
    return (
        <SC.Container>
            {ship?.speed?.rotational > 0 && (
                <SC.RotationalSpeedIndicator>
                    <CustomIcon icon="turn-left"></CustomIcon>
                    <Typography>
                        {Math.round(
                            ship?.speed?.rotational / ROTATION_INCREMENT
                        )}
                    </Typography>
                </SC.RotationalSpeedIndicator>
            )}
            {ship?.speed?.rotational < 0 && (
                <SC.RotationalSpeedIndicatorRight>
                    <Typography variant="h6">
                        {Math.round(
                            -ship.speed.rotational / ROTATION_INCREMENT
                        )}
                    </Typography>
                    <CustomIcon icon="turn-right"></CustomIcon>
                </SC.RotationalSpeedIndicatorRight>
            )}
            <SC.NavigationChart>
                {new Array(5).fill(null).map((value, index) => (
                    <SC.ConcentricCircle
                        key={`circle-${index}`}
                        radius={(index + 1) * 20}
                    ></SC.ConcentricCircle>
                ))}
                <SC.SpeedChart>{speedLines}</SC.SpeedChart>
            </SC.NavigationChart>
        </SC.Container>
    );
}
