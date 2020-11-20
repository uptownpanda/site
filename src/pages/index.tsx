import Head from 'next/head';

const Home: React.FC<{}> = () => {
    return (
        <>
            <Head>
                <title>Uptown Panda | Home - uptownpanda.finance</title>
            </Head>

            <div className="container-md py-6">
                <div className="row">
                    <div className="col">
                        <img
                            width="250"
                            src="/logo-big.png"
                            className="mx-auto d-block mw-100"
                            alt="Uptown Panda Logo"
                        />
                    </div>
                </div>

                <div className="row mt-6">
                    <div className="col">
                        <div className="card shadow-sm mx-auto" style={{ maxWidth: '400px' }}>
                            <div className="card-body">TODO</div>
                        </div>
                    </div>
                </div>

                <div className="row mt-6">
                    <div className="col">
                        <div className="card shadow-sm mx-auto" style={{ maxWidth: '400px' }}>
                            <div className="card-body">TODO</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
