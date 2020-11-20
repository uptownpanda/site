import Head from 'next/head';
import { useContext, useEffect, useRef, useState } from 'react';
import { PresaleContext } from '../components/presale-context-provider';
import ComponentLoader from '../components/component-loader';
import Alert, { AlertType } from '../components/alert';

const Presale: React.FC<{}> = () => {
    const { isLoading, isInitialized, init } = useContext(PresaleContext);

    useEffect(() => {
        !isInitialized && init();
    }, [isInitialized, init]);

    return (
        <>
            <Head>
                <title>Uptown panda | Presale - uptownpanda.finance</title>
            </Head>

            {isLoading ? (
                <ComponentLoader />
            ) : (
                <div className="container-md py-3">
                    <div className="row">
                        <div className="col-12">
                            {isInitialized ? (
                                <Alert type={AlertType.DARK} className="my-5">
                                    Coming soon... Eat some bamboo in the meantime.
                                </Alert>
                            ) : (
                                <Alert type={AlertType.DANGER}>Failed to retrieved data.</Alert>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Presale;
