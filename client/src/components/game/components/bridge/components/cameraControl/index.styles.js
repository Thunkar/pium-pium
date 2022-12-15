import styled from 'styled-components';
import { IconButton, styled as matStyled, ToggleButton } from '@mui/material';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-around;
`;

export const CameraButton = matStyled(IconButton)`
    display: flex;
    align-items: center;
    border-radius: 10%;
    width: 1.5em;
    height: 1.5em;
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
    &:hover {
        background-color: black;
    }
`;

export const ToggleCameraButton = matStyled(ToggleButton)`
    display: flex;
    align-items: center;
    border-radius: 10%;
    width: 1.5em;
    height: 1.5em;
    padding: 1.23em;
    color: ${(props) => props.theme.palette.text.primary};
    background-color: ${(props) =>
        props.selected
            ? props.theme.palette.success.main
            : props.theme.palette.primary.light} !important;
    line-height: 1em;
    min-width: unset;
    text-transform: unset;
    margin: 0;

    & > span {
        margin: 0;
        padding: 0;
    }
    overflow: hidden;
`;
