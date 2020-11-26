import { Dispatch, SetStateAction, useCallback } from 'react';

const useUpdateState = function <T>(setState: Dispatch<SetStateAction<T>>) {
    const updateState = useCallback(
        (updatedState: Partial<T>) => setState((currentState) => ({ ...currentState, ...updatedState })),
        [setState]
    );
    return updateState;
};

export default useUpdateState;