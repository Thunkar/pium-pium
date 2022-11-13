import styled from 'styled-components';
import { Icon } from '@mui/material';

export const Ability = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    color: white;
    border-radius: 10px;
    background-color: #2a2a2a;
`;

export const CustomIcon = styled(Icon)`
    font-size: 1em !important;
`;

export const CostContainer = styled.div`
    display: flex;
    font-size: 1.3em;
    font-weight: bold;
    align-items: center;
`;

export const TextContainer = styled.div`
    font-size: 1em;
    font-style: italic;
    margin: 0px 10px;
`;
