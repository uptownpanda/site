import { useCallback, useState } from 'react';

const useOnClickLoadingButton = (onClick: () => Promise<void>) => {
    const [isLoading, setIsLoading] = useState(false);
    const onClickWithLoading = useCallback(() => {
        (async () => {
            setIsLoading(true);
            try {
                await onClick();
            } catch (e) {
                alert(`Error occured! Message: ${e}`);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [onClick, setIsLoading]);
    return { isLoading, onClickWithLoading };
};

export default useOnClickLoadingButton;
