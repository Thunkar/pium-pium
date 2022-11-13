import { Reactor } from './components/reactor';
import { ShipMap } from './components/shipMap';
import { Helm } from './components/helm';
import * as SC from './index.styles';

export function Bridge() {
    return (
        <SC.Container>
            <Reactor></Reactor>
            <Helm></Helm>
            <ShipMap></ShipMap>
        </SC.Container>
    );
}
