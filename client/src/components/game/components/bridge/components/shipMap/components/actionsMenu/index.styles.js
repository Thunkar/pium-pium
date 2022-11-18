import styled from 'styled-components';
import { Button, styled as materialStyled } from '@mui/material';

export const ActionToggleContainer = styled.div``;

export const IconButton = materialStyled(Button)`
    display: flex;
    align-items: center;
    border-radius: 50%;
    width: 2em;
    height: 2em;
    padding: 0.5em;
    background-color: #2a2a2a;
    line-height: unset;
    min-width: unset;
    text-transform: unset;
    color: white;
    margin: 0;

    & > span {
        margin: 0;
        padding: 0;
    }
`;

export const Ability = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    overflow: hidden;
    color: white;
    border-radius: 10px;
    background-color: #2a2a2a;
    line-height: 1.4em;
    ${(props) => (props.overlay ? 'filter: blur(4px)' : 'unset')}
`;

export const Costs = styled.div`
    display: flex;
    flex-direction: row;

    & > p {
        margin: 0;
    }
`;

export const CostContainer = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 1.3em;
    font-weight: bold;
    align-items: center;
    margin-right: 5px;
`;

export const TextContainer = styled.div`
    font-size: 1em;
    font-style: italic;
    margin: 0px 10px;
`;

export const DetailTextContainer = styled(TextContainer)`
    font-size: 0.6em;
    line-height: 1em;
    font-style: italic;
    margin: 0px 5px;
`;
