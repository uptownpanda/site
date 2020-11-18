import Head from 'next/head';

const Home: React.FC<{}> = () => {
    return (
        <>
            <Head>
                <title>Uptown Panda | Home - uptownpanda.finance</title>
            </Head>

            <div className="container-md py-6">
                <div className="row">
                    <div className="col-12">
                        <img
                            width="250"
                            src="/logo-big.png"
                            className="mx-auto d-block mw-100"
                            alt="Uptown Panda Logo"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
