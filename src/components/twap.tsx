import React from 'react';
import DataWrapper from './data-wrapper';
import useTwap from './hooks/useTwap';

const Twap: React.FC = () => {
    const { twap, isLoading, isDataAvailable } = useTwap();
    const twapDisplay = twap.toFixed(2);
    const burnRate = Math.round(twap <= 3 ? 30 : twap >= 10 ? 5 : 30 - (25 * (twap - 3)) / 7);

    return (
        <DataWrapper isLoading={isLoading} isDataAvailable={isDataAvailable}>
            <div className="form-group">
                <label className="mb-0 font-weight-bold">TWAP (compared to listing price)</label>
                <span className="d-block">x{twapDisplay}</span>
            </div>

            <div className="form-group mb-0">
                <label className="mb-0 font-weight-bold">Burn rate %</label>
                <span className="d-block">{burnRate}%</span>
            </div>
        </DataWrapper>
    );
};

export default Twap;
