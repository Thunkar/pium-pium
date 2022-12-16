import { styled as matStyled } from '@mui/material';
import styled from 'styled-components';

export const Ability = matStyled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    overflow: hidden;
    border-radius: 10px;
    color: ${(props) =>
        props.disabled
            ? props.theme.palette.primary.light
            : props.theme.palette.text.primary};
    background-color: ${(props) =>
        props.disabled
            ? props.theme.palette.primary.dark
            : props.theme.palette.primary.main};
    line-height: 1.2em;
    filter: ${(props) => (props.overlay ? 'blur(4px)' : undefined)};
    z-index: 10;
    box-shadow: ${(props) =>
        props.disabled ? 'unset' : '2px 2px 1px 1px black'};
    ${(props) =>
        !props.disabled ? `&:hover { background-color: black; }` : undefined}
`;

export const COSTS = styled.div`
    display: flex;
    flex-direction: row;

    & > p {
        margin: 0;
    }
`;

export const CostContainer = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 1em;
    font-weight: bold;
    align-items: center;
    margin-right: 5px;
`;

export const TextContainer = styled.div`
    font-size: 0.8em;
    font-style: italic;
    margin: 0px 10px;
`;

export const DetailTextContainer = styled(TextContainer)`
    font-size: 0.6em;
    line-height: 1em;
    font-style: italic;
    margin: 0px 5px;
`;
