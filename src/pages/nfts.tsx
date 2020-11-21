import Head from 'next/head';
import Alert, { AlertType } from '../components/alert';
import Card from '../components/card';

const NFTs: React.FC<{}> = () => {
    return (
        <>
            <Head>
                <title>Uptown Panda | NFTs - uptownpanda.finance</title>
            </Head>

            <div className="container-md py-6">
                <div className="row">
                    <div className="col-12 text-center">
                        <div>
                            <Alert type={AlertType.SUCCESS} className="d-inline-block mb-5">
                                <span className="text-uppercase font-weight-bolder">These badboys are coming soon! Stay tuned!</span>
                            </Alert>
                        </div>

                        <video
                            autoPlay={true}
                            muted={true}
                            controls={false}
                            loop={true}
                            className="teaser-nft-video mw-100"
                        >
                            <source
                                src="https://media.tenor.co/videos/77fdbf0a3d6ce29f9d51000b74fca7d8/mp4"
                                type="video/mp4"
                            ></source>
                        </video>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NFTs;
