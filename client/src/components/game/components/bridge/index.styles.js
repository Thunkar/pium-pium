import { styled as matStyled } from '@mui/material';
import { rgba } from 'polished';

export const Container = matStyled('div')`
    position: absolute;
    justify-content: space-between;
    height: 27%;
    bottom: 0;
    display: flex;
    flex-direction: row;
    margin: 0px 20px;
    transform: translateX(-50%);
    left: 50%;
    width: 70%;
    border-radius: 20px 20px 0px 0px;
    background-color: ${(props) => rgba(props.theme.palette.primary.main, 0.5)};
    border-style: solid;
    border-width: 5px 5px 0px 5px;
    border-color: ${(props) => rgba(props.theme.palette.primary.light, 0.5)};
    box-sizing: border-box;
    padding: 1em 2em;
`;
