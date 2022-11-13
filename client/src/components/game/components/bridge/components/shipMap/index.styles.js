import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    position: relative;
`;

const ButtonContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: space-around;
    margin: auto;
`;

export const Aft = styled(ButtonContainer)`
    flex-direction: column;
    left: 0;
    height: calc(100% - 100px);
    width: 40px;
    top: 50px;
`;

export const AftTrapezoid = styled(Aft)`
    transform: perspective(10px) rotateY(-3deg);
    background-color: grey;
`;

export const Port = styled(ButtonContainer)`
    top: 0;
    width: calc(100% - 100px);
    height: 40px;
    right: 50px;
`;

export const PortTrapezoid = styled(Port)`
    background-color: grey;
    transform: perspective(10px) rotateX(3deg);
`;

export const Forward = styled(ButtonContainer)`
    flex-direction: column;
    right: 0;
    height: calc(100% - 100px);
    width: 40px;
    top: 50px;
`;

export const ForwardTrapezoid = styled(Forward)`
    background-color: grey;
    transform: perspective(10px) rotateY(3deg);
`;

export const Starboard = styled(ButtonContainer)`
    bottom: 0;
    width: calc(100% - 100px);
    height: 40px;
    left: 50px;
`;

export const StarboardTrapezoid = styled(Starboard)`
    background-color: grey;
    transform: perspective(10px) rotateX(-3deg);
`;

export const ShipImage = styled.img`
    padding: 10px;
    margin: 50px;
`;

export const Overlay = styled.div`
    position: absolute;
    top: -3px;
    bottom: -3px;
    left: -3px;
    right: -3px;
    backdrop-filter: blur(4px);
`;
