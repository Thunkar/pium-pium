import { styled as matStyled } from '@mui/material';
import { rgba } from 'polished';

export const Container = matStyled('div')`
    position: absolute;
    justify-content: space-around;
    height: 22%;
    bottom: 0;
    display: flex;
    flex-direction: row;
    margin: 0px 20px;
    width: calc(100% - 40px);
    border-radius: 20px 20px 0px 0px;
    background-color: ${(props) => rgba(props.theme.palette.primary.main, 0.5)};
    box-sizing: border-box;
    padding: 10px;
`;
