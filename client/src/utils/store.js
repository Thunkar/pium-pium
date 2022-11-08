import { configureStore } from '@reduxjs/toolkit';
import shipReducer from '../reducers/shipSlice';
import gameReducer from '../reducers/gameSlice';
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    ship: shipReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ thunk: false }).prepend(sagaMiddleware);
  },
});

sagaMiddleware.run(rootSaga);
