import Head from 'next/head';
import { useContext, useEffect, useRef } from 'react';
import { Web3Context } from '../components/web3-context-provider';
import UptownPandaPresale from '../contracts/UptownPandaPresale';
import { AbiItem } from 'web3-utils/types';

const Presale: React.FC<{}> = () => {
    const web3Context = useContext(Web3Context);

    useEffect(() => {
        const { web3, isEthProviderAvailable, isNetworkSupported, account } = web3Context;
        if (!isEthProviderAvailable || !isNetworkSupported) {
            return;
        }
        const load = async () => {
            const contract = new web3.eth.Contract(
                UptownPandaPresale as AbiItem[],
                process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS
            );
            //const isActive = await contract.methods.isPresaleActive().call();
            //const wasEnded = await contract.methods.wasPresaleEnded().call();
            //console.log('is active', isActive);
            //console.log('was ended', wasEnded);
        };
        load();
    }, [web3Context]);

    return (
        <>
            <Head>
                <title>Uptown panda | Presale - uptownpanda.finance</title>
            </Head>

            <div className="container-md py-3">
                <div className="row">
                    <div className="col-12">TODO</div>
                </div>
            </div>
        </>
    );
};

export default Presale;
