import Head from 'next/head';
import Alert, { AlertType } from '../components/alert';

const HarvestHistory: React.FC<{}> = () => {
    return (
        <>
            <Head>
                <title>Uptown Panda | Harvest History - uptownpanda.finance</title>
            </Head>

            <div className="container-md py-3">
                <div className="row">
                    <div className="col-12">
                        <Alert type={AlertType.DARK} className="my-5">
                            Coming soon... Eat some bamboo in the meantime.
                        </Alert>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HarvestHistory;
