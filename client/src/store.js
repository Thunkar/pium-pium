import { configureStore } from '@reduxjs/toolkit';
import { gameReducer } from 'pium-pium-engine';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import { playerReducer } from './reducers/playerReducer';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        player: playerReducer,
        game: gameReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({ thunk: false }).prepend(sagaMiddleware);
    },
});

sagaMiddleware.run(rootSaga);
