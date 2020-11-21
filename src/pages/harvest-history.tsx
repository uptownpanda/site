import Head from 'next/head';
import Alert, { AlertType } from '../components/alert';

const HarvestHistory: React.FC<{}> = () => {
    return (
        <>
            <Head>
                <title>Uptown Panda | Harvest History - uptownpanda.finance</title>
            </Head>

            <div className="container-md py-6">
                <div className="row">
                    <div className="col-12 text-center">
                        <Alert type={AlertType.DARK} className="d-inline-block mb-0">
                            Coming soon... Eat some bamboo in the meantime.
                        </Alert>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HarvestHistory;
