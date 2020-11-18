import { AppProps } from 'next/app';
// include global styles - settings grid and so on for bootstrap

const App = ({ Component, pageProps }: AppProps) => {
    return <Component {...pageProps} />;
};

export default App;
