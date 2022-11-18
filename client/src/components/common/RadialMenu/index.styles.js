import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    position: relative;
`;

export const Toggle = styled.div`
    display: flex;
    overflow: hidden;
`;

export const IconButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1em;
    width: 1em;
    border-radius: 50%;
    color: white;
    padding: 8px;
    background-color: black;
`;

export const ChildrenContainer = styled.div`
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
`;

export const RadialChild = styled.div`
    position: absolute;
    transition: all 0.3s;
    visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    z-index: 100;
    cursor: pointer;
    transform: translate(
        calc(
            -50% + ${(props) => (props.isOpen ? props.radius * Math.cos(props.angle) : 0)}em
        ),
        calc(
            -50% + ${(props) => (props.isOpen ? props.radius * Math.sin(props.angle) : 0)}em
        )
    );
`;
