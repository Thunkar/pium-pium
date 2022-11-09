import { Reactor } from './components/reactor';
import { ShipMap } from './components/shipMap';
import * as SC from './index.styles';

export function Helm() {
    return (
        <SC.Container>
            <Reactor></Reactor>
            <ShipMap></ShipMap>
        </SC.Container>
    );
}
