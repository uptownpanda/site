import React from 'react';
import { Farm } from '../utils/enums';
import FarmLink from './farm-link';

interface FarmSelectionProps {
    isLoading: boolean;
    activeFarm: Farm;
    setActiveFarm: (farm: Farm) => void;
}

const FarmSelection: React.FC<FarmSelectionProps> = ({ isLoading, activeFarm, setActiveFarm }) => {
    return (
        <div className="list-group list-group-horizontal-md" role="tablist">
            <FarmLink onClick={(f) => !isLoading && setActiveFarm(f)} activeFarm={activeFarm} farm={Farm.UP}>
                $UP farm
            </FarmLink>
            <FarmLink onClick={(f) => !isLoading && setActiveFarm(f)} activeFarm={activeFarm} farm={Farm.UP_ETH}>
                $UP/ETH farm
            </FarmLink>
            <FarmLink onClick={(f) => !isLoading && setActiveFarm(f)} activeFarm={activeFarm} farm={Farm.WETH}>
                WETH farm
            </FarmLink>
            <FarmLink onClick={(f) => !isLoading && setActiveFarm(f)} activeFarm={activeFarm} farm={Farm.WBTC}>
                WBTC farm
            </FarmLink>
        </div>
    );
};

export default FarmSelection;
