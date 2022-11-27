import styled from 'styled-components';
import { Button, styled as materialStyled } from '@mui/material';
import { RadialMenu } from '../../../../../../../common/RadialMenu';

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
    background-color: black;
    color: white;
    filter: ${(props) => (props.disabled ? 'blur(5px)' : 'unset')};
`;

export const PowerIndicator = styled(Indicator)`
    background-color: #0200bb;
    left: ${(props) => (props.horizontal ? 'calc(50% - 0.6em)' : '-1em')};
    top: ${(props) => (props.horizontal ? '-1em' : undefined)};
`;

export const HeatIndicator = styled(Indicator)`
    right: ${(props) => (props.horizontal ? 'calc(50% - 0.6em)' : '-1em')};
    bottom: ${(props) => (props.horizontal ? '-1em' : undefined)};
    background-color: #d50000;
`;

export const IconButton = materialStyled(Button)`
    display: flex;
    align-items: center;
    border-radius: 50%;
    width: 2em;
    height: 2em;
    padding: 0.5em;
    background-color: ${(props) => (props.disabled ? 'unset' : '#2a2a2a')};
    line-height: unset;
    min-width: unset;
    text-transform: unset;
    color: white;
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

export const Ability = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    overflow: hidden;
    color: white;
    border-radius: 10px;
    background-color: #2a2a2a;
    line-height: 1.2em;
    filter: ${(props) => (props.overlay ? 'blur(4px)' : undefined)};
    z-index: 1;
    &:hover {
        background-color: black;
    }
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
