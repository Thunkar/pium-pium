let currentLogger;

export const setLogger = (logger) => (currentLogger = logger);

export const getLogger = () => currentLogger;
