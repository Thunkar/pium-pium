import styled from 'styled-components';
import { styled as matStyled, Typography } from '@mui/material';

export const Container = styled.div`
    display: flex;
    position: relative;
    align-items: center;
    padding: 1rem;
`;

export const AngleLabel = matStyled(Typography)`
    position: absolute;
    line-height: 1rem;
    top: ${(props) => 50 + 50 * Math.sin(props.angle - Math.PI / 2)}%;
    left: ${(props) => 50 + 50 * Math.cos(props.angle - Math.PI / 2)}%;
    transform: translate(-50%, -50%);
`;

export const NavigationChart = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    aspect-ratio: 1/1;
    background: radial-gradient(
        circle,
        rgb(0 0 0) 0%,
        rgb(0 0 0) 50%,
        rgb(40 40 40) 70%
    );
    border-radius: 50%;
`;

export const ConcentricCircle = matStyled('div')`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: transparent;
    height: ${(props) => props.radius}%;
    border-radius: 50%;
    aspect-ratio: 1/1;
    border: solid 2px ${(props) => props.theme.palette.primary.light};
`;

export const SpeedChart = styled.svg.attrs((props) => ({
    viewBox: [-50, -50, 100, 100],
}))`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: transparent;
    height: 100%;
    aspect-ratio: 1/1;
    stroke-width: 1px;
`;

export const SpeedLine = styled.line`
    stroke: ${(props) => (props.color ? props.color : 'white')};
    stroke-dasharray: ${(props) =>
        props.dasharray ? props.dasharray : undefined};
    transition: all 0.3s;
`;

export const RotationalSpeedIndicator = matStyled('div')`
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 0;
    align-items: center;
    justify-content: flex-start;
    height: 3.5rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
    padding: 0 0.25rem;

    background: radial-gradient(
        circle,
        rgb(0 0 0) 0%,
        rgb(0 0 0) 50%,
        rgb(40 40 40) 70%
    );

    border: solid 2px ${(props) => props.theme.palette.primary.light};

    & > span {
        margin: 0 0.2rem;
    }
`;

export const RotationalSpeedIndicatorRight = matStyled(
    RotationalSpeedIndicator
)`
    right: 0;
    justify-content: flex-end;
`;
