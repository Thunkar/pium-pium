import * as SC from './index.styles';
import { addSpeeds, vectorFromMagnitudeAndAngle } from 'pium-pium-engine';
import { useMemo } from 'react';
import Vec3 from 'vec3';

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
            const ordered = Object.keys(ship.speed.directional)
                .filter((angle) => ship.speed.directional[angle])
                .sort(
                    (a, b) =>
                        ship.speed.directional[a] - ship.speed.directional[b]
                )
                .map((angle) => ({
                    magnitude: ship.speed.directional[angle],
                    angle: parseFloat(angle, 10),
                }));
            const result = [];
            let accumulated = new Vec3(0, 0, 0);
            for (const speed of ordered) {
                const startPoint = accumulated;
                const finishPoint = vectorFromMagnitudeAndAngle(
                    speed.magnitude,
                    speed.angle
                ).add(accumulated);
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
                accumulated = accumulated.add(finishPoint);
            }

            return result.concat([sumSpeedLine]);
        }
    }, [ship?.speed?.directional]);
    return (
        <SC.Container>
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
