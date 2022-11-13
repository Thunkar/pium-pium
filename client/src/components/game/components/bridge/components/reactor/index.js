import { selectPlayerShips } from 'pium-pium-engine';
import { useSelector } from 'react-redux';
import {
    selectPlayerId,
    selectSelectedShip,
} from '../../../../../../reducers/playerReducer';
import * as SC from './index.styles';

export function Reactor() {
    const playerId = useSelector(selectPlayerId);
    const selectedShipId = useSelector(selectSelectedShip);
    const playerShips = useSelector((state) =>
        selectPlayerShips(state, playerId)
    );
    const selectedShip = playerShips[selectedShipId];
    return (
        <SC.Container>
            {selectedShip && (
                <SC.ReactorCore>
                    <SC.Energy>
                        {selectedShip.reactor.remaining}/
                        {selectedShip.reactor.total}
                    </SC.Energy>
                </SC.ReactorCore>
            )}
        </SC.Container>
    );
}
