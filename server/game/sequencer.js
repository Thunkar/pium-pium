import store from './store.js';
import {
    createPlayer,
    createShip,
    selectPlayer,
    selectPlayerShips,
    removePlayer,
    selectPlayers,
    selectIsRunning,
    startGameAction,
} from 'pium-pium-engine';
import { useSelector } from './utils.js';
import { broadcast } from '../handlers/gameWS.js';

export const serverDispatch = (action) => {
    store.dispatch(action);
    broadcast(JSON.stringify(action));
};

export const seatPlayer = (playerId) => {
    const player = useSelector((state) => selectPlayer(state, playerId));
    if (!player) {
        serverDispatch(createPlayer({ playerId }));
    }
    const playerShips = useSelector((state) =>
        selectPlayerShips(state, playerId)
    );
    if (Object.keys(playerShips).length === 0) {
        serverDispatch(createShip({ playerId }));
    }
    const players = useSelector(selectPlayers);
    const isGameRunning = useSelector(selectIsRunning);
    if (players.length > 1 && !isGameRunning) {
        store.dispatch(startGameAction());
    }
};

export const unseatPlayer = (playerId) => {
    serverDispatch(removePlayer({ playerId }));
};

export const processMessage = (message, playerId) => {
    const JSONAction = JSON.parse(message.toString());
    JSONAction.payload = JSONAction.payload
        ? { ...JSONAction.payload, playerId }
        : { playerId };
    store.dispatch(JSONAction);
};
