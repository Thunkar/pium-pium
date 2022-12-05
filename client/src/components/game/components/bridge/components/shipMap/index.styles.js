import styled from 'styled-components';
import { styled as matStyled } from '@mui/material';

const buttonContainerWidth = 60;
const positioningMargin = 5;
const trapezoidCorrection = 5;
const trapezoidFactor = 50;
const trapezoidAngle = 9;

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
`;

export const Stats = styled.div`
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    overflow: hidden;
`;

export const Break = styled.div`
    flex-basis: 100%;
    height: calc(100% - 7.4rem);
`;

export const Stat = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    font-size: 0.8rem;
    height: 3.7rem;
    width: 2.5rem;
`;

export const CircleInfo = matStyled('div')`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    aspect-ratio: 1/1;
    background: radial-gradient(
        circle,
        rgba(2, 0, 36, 1) 0%,
        rgba(9, 9, 121, 1) 50%,
        rgba(0, 198, 255, 1) 70%
    );
    border-radius: 50%;
    border: solid 2px ${(props) => props.theme.palette.tertiary.main};
`;

export const Reactor = matStyled(CircleInfo)`
    background: radial-gradient(
        circle,
        ${(props) =>
            `${props.theme.palette.secondary.dark} 0%, ${props.theme.palette.secondary.main} 50%, ${props.theme.palette.secondary.light} 70%`}
    );
`;

export const Vent = matStyled(CircleInfo)`
    background: radial-gradient(
        circle,
        ${(props) =>
            `${props.theme.palette.warning.dark} 0%, ${props.theme.palette.warning.main} 50%, ${props.theme.palette.warning.light} 70%`}
    );
`;

export const Hull = matStyled(CircleInfo)`
    background: radial-gradient(
        circle,
        ${(props) =>
            `${props.theme.palette.primary.dark} 0%, ${props.theme.palette.primary.main} 50%, ${props.theme.palette.primary.light} 70%`}
    );
`;

export const Heat = matStyled(CircleInfo)`
    background: radial-gradient(
        circle,
        ${(props) =>
            `${props.theme.palette.error.dark} 0%, ${props.theme.palette.error.main} 50%, ${props.theme.palette.error.light} 70%`}
    );
`;

export const Systems = styled.div`
    display: flex;
    position: relative;
`;

const ButtonContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: space-around;
    margin: auto;
    align-items: center;
`;

export const Aft = styled(ButtonContainer)`
    flex-direction: column;
    left: 0;
    height: calc(100% - ${(buttonContainerWidth + positioningMargin) * 2}px);
    width: ${buttonContainerWidth}px;
    top: ${buttonContainerWidth + positioningMargin}px;
    padding: 0.5rem 0;
    border-radius: 5px 0px 0px 5px;
`;

export const AftTrapezoid = matStyled(Aft)`
    left: -${trapezoidCorrection}px;
    transform: perspective(${trapezoidFactor}px) rotateY(-${trapezoidAngle}deg);
    background-color: ${(props) => props.theme.palette.tertiary.main};
    border: solid ${(props) => props.theme.palette.primary.light};
    border-width: 2px 0px 2px 2px;
`;

export const Port = styled(ButtonContainer)`
    top: 0;
    width: calc(100% - ${(buttonContainerWidth + positioningMargin) * 2}px);
    height: ${buttonContainerWidth}px;
    left: ${buttonContainerWidth + positioningMargin}px;
    padding: 0 0.3rem;
    border-radius: 5px 5px 0px 0px;
`;

export const PortTrapezoid = matStyled(Port)`
    top: -${trapezoidCorrection / 2}px;
    background-color: ${(props) => props.theme.palette.tertiary.main};
    transform: perspective(${trapezoidFactor}px) rotateX(${trapezoidAngle}deg);
    border: solid ${(props) => props.theme.palette.primary.light};
    border-width: 2px 2px 0px 2px;
`;

export const Forward = styled(ButtonContainer)`
    flex-direction: column;
    right: 0;
    height: calc(100% - ${(buttonContainerWidth + positioningMargin) * 2}px);
    width: ${buttonContainerWidth}px;
    top: ${buttonContainerWidth + positioningMargin}px;
    padding: 0.3rem 0;
    border-radius: 0px 5px 5px 0px;
`;

export const ForwardTrapezoid = matStyled(Forward)`
    right: -${trapezoidCorrection}px;
    background-color: ${(props) => props.theme.palette.tertiary.main};
    transform: perspective(${trapezoidFactor}px) rotateY(${trapezoidAngle}deg);
    border: solid ${(props) => props.theme.palette.primary.light};
    border-width: 2px 2px 2px 0px;
`;

export const Starboard = styled(ButtonContainer)`
    bottom: 0;
    width: calc(100% - ${(buttonContainerWidth + positioningMargin) * 2}px);
    height: ${buttonContainerWidth}px;
    left: ${buttonContainerWidth + positioningMargin}px;
    padding: 0 0.3rem;
`;

export const StarboardTrapezoid = matStyled(Starboard)`
    bottom: -${trapezoidCorrection / 2}px;
    background-color: ${(props) => props.theme.palette.tertiary.main};
    transform: perspective(${trapezoidFactor}px) rotateX(-${trapezoidAngle}deg);
    border: solid ${(props) => props.theme.palette.primary.light};
    border-width: 0px 2px 2px 2px;
    border-radius: 0px 0px 5px 5px;
`;

export const ShipImage = styled.img`
    margin: ${buttonContainerWidth + positioningMargin * 2}px;
`;

export const Overlay = styled.div`
    position: absolute;
    top: -10px;
    bottom: -10px;
    left: -10px;
    right: -10px;
    backdrop-filter: blur(4px);
`;

export const VerticalDivider = matStyled('div')`
    height: 1px;
    width: 100%;
    visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
    background-color: ${(props) => props.theme.palette.primary.light};
`;

export const HorizontalDivider = matStyled('div')`
    width: 1px;
    height: 100%;
    visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
    background-color: ${(props) => props.theme.palette.primary.light};
`;
