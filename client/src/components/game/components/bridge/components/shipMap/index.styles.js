import styled from 'styled-components';
import { styled as matStyled } from '@mui/material';

const buttonContainerWidth = 55;
const positioningMargin = 5;
const trapezoidCorrection = 4;

export const Container = styled.div`
    display: flex;
    position: relative;
    margin: 0px 40px;
`;

const ButtonContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: space-around;
    margin: auto;
    align-items: center;
    border-radius: 5px;
`;

export const Aft = styled(ButtonContainer)`
    flex-direction: column;
    left: 0;
    height: calc(100% - ${(buttonContainerWidth + positioningMargin) * 2}px);
    width: ${buttonContainerWidth}px;
    top: ${buttonContainerWidth + positioningMargin}px;
`;

export const AftTrapezoid = matStyled(Aft)`
    left: -${trapezoidCorrection}px;
    transform: perspective(10px) rotateY(-3deg);
    background-color: ${(props) => props.theme.palette.primary.light};
`;

export const Port = styled(ButtonContainer)`
    top: 0;
    width: calc(100% - ${(buttonContainerWidth + positioningMargin) * 2}px);
    height: ${buttonContainerWidth}px;
    left: ${buttonContainerWidth + positioningMargin}px;
`;

export const PortTrapezoid = matStyled(Port)`
    top: -${trapezoidCorrection}px;
    background-color: ${(props) => props.theme.palette.primary.light};
    transform: perspective(10px) rotateX(3deg);
`;

export const Forward = styled(ButtonContainer)`
    flex-direction: column;
    right: 0;
    height: calc(100% - ${(buttonContainerWidth + positioningMargin) * 2}px);
    width: ${buttonContainerWidth}px;
    top: ${buttonContainerWidth + positioningMargin}px;
`;

export const ForwardTrapezoid = matStyled(Forward)`
    right: -${trapezoidCorrection}px;
    background-color: ${(props) => props.theme.palette.primary.light};
    transform: perspective(10px) rotateY(3deg);
`;

export const Starboard = styled(ButtonContainer)`
    bottom: 0;
    width: calc(100% - ${(buttonContainerWidth + positioningMargin) * 2}px);
    height: ${buttonContainerWidth}px;
    left: ${buttonContainerWidth + positioningMargin}px;
`;

export const StarboardTrapezoid = matStyled(Starboard)`
    bottom: -${trapezoidCorrection}px;
    background-color: ${(props) => props.theme.palette.primary.light};
    transform: perspective(10px) rotateX(-3deg);
`;

export const ShipImage = styled.img`
    padding: ${positioningMargin};
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
