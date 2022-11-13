import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 70%;
    background-color: black;
`;

export const PlayerListContainer = styled.div`
    position: absolute;
    z-index: 1;
    top: 50px;
    right: 50px;
    color: white;
    background-color: #4c4949;
    border-radius: 10px;
    padding: 10px;
`;

export const Player = styled.div`
    border-radius: 10px;
    padding: 5px;
    margin: 0px 5px;
    background-color: ${(props) => (props.selected ? 'grey' : 'unset')};
`;
