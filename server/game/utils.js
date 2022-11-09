import store from './store.js';

let currentLogger;

export const setLogger = (logger) => (currentLogger = logger);

export const getLogger = () => currentLogger;

export const useSelector = (target) => {
    const state = store.getState();
    return target(state);
};
