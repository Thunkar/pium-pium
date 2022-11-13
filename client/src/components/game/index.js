import { Board } from './components/board';
import { Bridge } from './components/bridge';
import * as SC from './index.styles';

export function Game() {
    return (
        <SC.Container>
            <Board></Board>
            <Bridge></Bridge>
        </SC.Container>
    );
}
