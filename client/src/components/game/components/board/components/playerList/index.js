import {
    selectCurrentTimer,
    selectCurrentTurn,
    selectPlayers,
} from 'pium-pium-engine';
import { useSelector } from 'react-redux';
import * as SC from './index.styles';

const PlayerList = function () {
    const players = useSelector(selectPlayers);
    const currentTurn = useSelector(selectCurrentTurn);
    const currentTimer = useSelector(selectCurrentTimer);
    return (
        <SC.PlayerListContainer>
            {players.map((player) => (
                <SC.Player
                    selected={player.id === players?.[currentTurn]?.id}
                    key={player.id}
                >
                    {player.id}{' '}
                    {player.id === players?.[currentTurn]?.id
                        ? ` - ${currentTimer}`
                        : ''}
                </SC.Player>
            ))}
        </SC.PlayerListContainer>
    );
};

export default PlayerList;
