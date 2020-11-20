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
                        <h1 className="mb-0 mt-3 font-weight-bold text-white text-center landing-logo-title">
                            Uptown Panda
                        </h1>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12 col-md-6 col-xl-4 mb-3 mb-xl-0">
                        <div className="card shadow-sm mx-auto h-100">
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold text-success">
                                    <i className="fas fa-shopping-cart mr-2" />
                                    Presale
                                </h5>

                                <p className="card-text">
                                    Once we start the presale process, everybody who is whitelisted will be able to
                                    contribute. To check if your address is whitelisted, connect your wallet via
                                    MetaMask and head over to the Presale page. If by the end of the presale hardcap is
                                    not reached, we will open contributions for everyone on FCFS basis.
                                </p>

                                <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Max. contribution
                                        <span className="badge badge-success badge-pill">2.5ETH</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Hard cap
                                        <span className="badge badge-success badge-pill">400ETH</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Team allocation
                                        <span className="badge badge-success badge-pill">40%</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        LP (Uniswap) allocation
                                        <span className="badge badge-success badge-pill">60%</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-xl-4 mb-3 mb-xl-0">
                        <div className="card shadow-sm mx-auto h-100">
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold text-success">
                                    <i className="fas fa-money-bill-alt mr-2" />
                                    Pricing
                                </h5>

                                <p className="card-text">
                                    Presale investors will get tokens at the lowest price possible. $UP tokens are
                                    received automatically as soon as you invest. Once the presale ends, tokens will get
                                    unlocked, 60% of the collected funds will automatically be transferred to the
                                    uniswap and trading will start. From there on price will be determined by the
                                    market.
                                </p>
                                <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Presale price
                                        <span className="badge badge-success badge-pill">1ETH = 33$UP</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Listing price
                                        <span className="badge badge-success badge-pill">1ETH = 11$UP</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-4">
                        <div className="card shadow-sm mx-auto h-100">
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold text-success">
                                    <i className="fas fa-tractor mr-2" />
                                    Farming
                                </h5>

                                <p className="card-text">
                                    Every pool is allocated a certain amount of $UP tokens immediately after the presale
                                    ends. Every 10 days reward halving occures, starting with the half of the pool's
                                    total tokens allocation. Rewards are distributed among the pool contributors.
                                    Initial $UP tokens supply per pool is defined below.
                                </p>

                                <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        $UP pool
                                        <span className="badge badge-success badge-pill">27500$UP</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        $UP/ETH pool
                                        <span className="badge badge-success badge-pill">55000$UP</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        WETH pool
                                        <span className="badge badge-success badge-pill">7500$UP</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        WBTC pool
                                        <span className="badge badge-success badge-pill">7500$UP</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
