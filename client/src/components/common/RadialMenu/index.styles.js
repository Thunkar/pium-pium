import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    position: relative;
`;

export const Toggle = styled.div`
    display: flex;
`;

export const IconButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1em;
    width: 1em;
    border-radius: 50%;
    padding: 8px;
`;

export const ChildrenContainer = styled.div`
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
`;

export const RadialChild = styled.div`
    position: absolute;
    left: -50%;
    top: -50%;
    transition: all 0.3s;
    visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    cursor: pointer;
    transform: translate(
        calc(
            -50% + ${(props) => (props.isOpen ? props.radius * Math.cos(props.angle) : 0)}em
        ),
        calc(
            -50% + ${(props) => (props.isOpen ? props.radius * Math.sin(props.angle) : 0)}em
        )
    );
    z-index: 10;
`;

export const Line = styled.div`
    position: absolute;
    left: -50%;
    top: -50%;
    transition: all 0.3s;
    visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    cursor: pointer;
    width: ${(props) => props.radius}em;
    background-color: darkgrey;
    height: 1px;
    transform: translate(
            calc(
                -50% + ${(props) => (props.isOpen ? (props.radius / 2) * Math.cos(props.angle) : 0)}em
            ),
            calc(
                -50% + ${(props) => (props.isOpen ? (props.radius / 2) * Math.sin(props.angle) : 0)}em
            )
        )
        rotate(${(props) => props.angle}rad);
`;
