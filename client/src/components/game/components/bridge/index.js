import { ShipMap } from './components/shipMap';
import { Helm } from './components/helm';
import * as SC from './index.styles';
import { useSelector } from 'react-redux';
import { selectShip, selectShips } from 'pium-pium-engine';
import { selectSelectedShip } from '../../../../reducers/playerReducer';
import CameraControl from './components/cameraControl';

export function Bridge() {
    const selectedShipId = useSelector(selectSelectedShip);
    const selectedShip = useSelector((state) =>
        selectShip(state, selectedShipId)
    );
    return (
        <SC.Container>
            <CameraControl></CameraControl>
            <ShipMap ship={selectedShip}></ShipMap>
            <Helm ship={selectedShip}></Helm>
        </SC.Container>
    );
}
