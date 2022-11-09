import { getLogger } from './utils.js';
import * as toolkitRaw from '@reduxjs/toolkit';
const { configureStore } = toolkitRaw.default ?? toolkitRaw;
import { gameReducer } from 'pium-pium-engine';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/index.js';

const sagaMiddleware = createSagaMiddleware();

const logger = (store) => (next) => (action) => {
    getLogger().info(action);
    let result = next(action);
    getLogger().info(store.getState());
    return result;
};

const store = configureStore({
    reducer: {
        game: gameReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false })
            .prepend(sagaMiddleware)
            .concat(logger),
});

sagaMiddleware.run(rootSaga);

export default store;
