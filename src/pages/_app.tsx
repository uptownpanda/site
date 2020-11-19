import { AppProps } from 'next/app';
import Navbar from '../components/navbar';
import '../styles/app.scss';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Content from '../components/content';
import Footer from '../components/footer';
import Web3ContextProvider from '../components/web3-context-provider';

const App = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            </Head>

            <Web3ContextProvider>
                <Navbar activePage={router.asPath} />

                <Content>
                    <Component {...pageProps} />
                </Content>

                <Footer />
            </Web3ContextProvider>
        </>
    );
};

export default App;
