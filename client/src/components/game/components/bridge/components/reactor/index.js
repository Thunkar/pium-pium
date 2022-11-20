import { selectPlayerShips } from 'pium-pium-engine';
import { useSelector } from 'react-redux';
import {
    selectPlayerId,
    selectSelectedShip,
} from '../../../../../../reducers/playerReducer';
import * as SC from './index.styles';

export function Reactor({ ship }) {
    return (
        <SC.Container>
            {ship && (
                <SC.ReactorCore>
                    <SC.Energy>
                        {ship?.reactor.remaining}/{ship?.reactor.total}
                    </SC.Energy>
                </SC.ReactorCore>
            )}
        </SC.Container>
    );
}
