import { ShipMap } from './components/shipMap';
import { Helm } from './components/helm';
import * as SC from './index.styles';
import { useSelector } from 'react-redux';
import { selectPlayerShips } from 'pium-pium-engine';
import {
    selectPlayerId,
    selectSelectedShip,
} from '../../../../reducers/playerReducer';
import CameraControl from './components/cameraControl';

export function Bridge() {
    const playerId = useSelector(selectPlayerId);
    const selectedShipId = useSelector(selectSelectedShip);
    const playerShips = useSelector((state) =>
        selectPlayerShips(state, playerId)
    );
    const selectedShip = playerShips[selectedShipId];
    return (
        <SC.Container>
            <CameraControl></CameraControl>
            <ShipMap ship={selectedShip}></ShipMap>
            <Helm ship={selectedShip}></Helm>
        </SC.Container>
    );
}
