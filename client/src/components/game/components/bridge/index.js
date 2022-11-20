import { Reactor } from './components/reactor';
import { ShipMap } from './components/shipMap';
import { Helm } from './components/helm';
import * as SC from './index.styles';
import { useSelector } from 'react-redux';
import { selectPlayerShips } from 'pium-pium-engine';
import {
    selectPlayerId,
    selectSelectedShip,
} from '../../../../reducers/playerReducer';

export function Bridge() {
    const playerId = useSelector(selectPlayerId);
    const selectedShipId = useSelector(selectSelectedShip);
    const playerShips = useSelector((state) =>
        selectPlayerShips(state, playerId)
    );
    const selectedShip = playerShips[selectedShipId];
    return (
        <SC.Container>
            <Reactor ship={selectedShip}></Reactor>
            <Helm ship={selectedShip}></Helm>
            <ShipMap ship={selectedShip}></ShipMap>
        </SC.Container>
    );
}
