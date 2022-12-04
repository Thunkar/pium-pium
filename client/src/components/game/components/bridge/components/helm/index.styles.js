import styled from 'styled-components';
import { styled as matStyled } from '@mui/material';

export const Container = styled.div`
    display: flex;
    align-items: center;
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
`;
