import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import Alert, { AlertType } from '../components/alert';
import ComponentLoader from '../components/component-loader';

const NFTs: React.FC<{}> = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        !!videoRef.current && videoRef.current.addEventListener('loadeddata', () => setIsLoading(false));
    }, [videoRef, setIsLoading]);

    const nftVideoTeaser = (
        <video
            ref={videoRef}
            autoPlay={true}
            muted={true}
            controls={false}
            loop={true}
            className="teaser-nft-video mw-100"
        >
            <source src="https://media.tenor.co/videos/77fdbf0a3d6ce29f9d51000b74fca7d8/mp4" type="video/mp4"></source>
        </video>
    );

    return (
        <>
            <Head>
                <title>Uptown Panda | NFTs - uptownpanda.finance</title>
            </Head>

            {isLoading ? (
                <>
                    <ComponentLoader />
                    <div className="d-none">{nftVideoTeaser}</div>
                </>
            ) : (
                <div className="container-md py-6">
                    <div className="row">
                        <div className="col-12 text-center">
                            <div>
                                <Alert type={AlertType.SUCCESS} className="d-inline-block mb-5">
                                    <span className="text-uppercase font-weight-bolder">
                                        These badboys are coming soon! Stay tuned!
                                    </span>
                                </Alert>
                            </div>
                            {nftVideoTeaser}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NFTs;
