import { AppProps } from 'next/app';
import Navbar from '../components/navbar';
import '../styles/app.scss';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Content from '../components/content';
import Footer from '../components/footer';

const App = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            </Head>

            <Navbar activePage={router.asPath} />

            <Content>
                <Component {...pageProps} />
            </Content>

            <Footer />
        </>
    );
};

export default App;
