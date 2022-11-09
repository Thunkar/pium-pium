import { Board } from './components/board';
import { Helm } from './components/bridge';
import * as SC from './index.styles';

export function Game() {
    return (
        <SC.Container>
            <Board></Board>
            <Helm></Helm>
        </SC.Container>
    );
}
