import { styled as matStyled } from '@mui/material';

export const PlayerListContainer = matStyled('div')`
    position: absolute;
    z-index: 1;
    top: 50px;
    right: 50px;
    background-color: ${(props) => props.theme.palette.primary.main};
    border-radius: 10px;
    padding: 10px;
`;

export const Player = matStyled('div')`
    border-radius: 10px;
    padding: 5px;
    margin: 0px 5px;
    background-color: ${(props) =>
        props.selected ? props.theme.palette.primary.light : 'unset'};
`;
