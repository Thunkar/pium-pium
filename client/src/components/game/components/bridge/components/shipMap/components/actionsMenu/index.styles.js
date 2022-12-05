import styled from 'styled-components';
import { Button, styled as matStyled } from '@mui/material';

export const ActionToggleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const Indicator = styled.div`
    position: absolute;
    font-size: 0.8em;
    display: flex;
    width: 1.2em;
    height: 1.2em;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-radius: 50%;
    filter: ${(props) => (props.disabled ? 'blur(5px)' : 'unset')};
`;

export const PowerIndicator = matStyled(Indicator)`
    background-color: ${(props) => props.theme.palette.secondary.main};
    left: ${(props) => (props.horizontal ? 'calc(50% - 0.6em)' : '-1em')};
    top: ${(props) => (props.horizontal ? '-1em' : undefined)};
`;

export const UsedPowerIndicator = matStyled(Indicator)`
    background-color: ${(props) => props.theme.palette.warning.main};
    left: ${(props) => (props.horizontal ? 'calc(50% + 0.55em)' : '-0.55em')};
    top: ${(props) => (props.horizontal ? '-0.65em' : '1.5em')};
`;

export const HeatIndicator = matStyled(Indicator)`
    right: ${(props) => (props.horizontal ? 'calc(50% - 0.6em)' : '-1em')};
    bottom: ${(props) => (props.horizontal ? '-1em' : undefined)};
    background-color: ${(props) => props.theme.palette.error.main};
`;

export const IconButton = matStyled(Button)`
    display: flex;
    align-items: center;
    border-radius: 50%;
    width: 2em;
    height: 2em;
    padding: 0.5em;
    color: ${(props) => props.theme.palette.text.primary};
    background-color: ${(props) =>
        props.disabled ? 'unset' : props.theme.palette.primary.light};
    line-height: 1em;
    min-width: unset;
    text-transform: unset;
    margin: 0;

    & > span {
        margin: 0;
        padding: 0;
    }
    overflow: hidden;
    filter: ${(props) => (props.disabled ? 'blur(5px)' : 'unset')};

    &:hover {
        background-color: black;
    }
`;
