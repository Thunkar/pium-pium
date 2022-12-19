import { useCallback } from 'react';

export const addRefToArrayCallbackFactory = function (setter) {
    return useCallback((el) => {
        if (el) {
            setter((currentRefs) => currentRefs.concat([el]));
        }
    }, []);
};

export const removeRefFromArrayCallbackFactory = function (setter) {
    return useCallback((elements) =>
        setter((currentRefs) =>
            currentRefs.filter(
                (light) =>
                    !elements.find((element) => element?.uuid === light.uuid)
            )
        )
    );
};
