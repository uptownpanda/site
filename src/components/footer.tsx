import FooterSocialLink from "./footer-social-link"

const Footer: React.FC<{}> = () => {
    return (
        <footer className="bg-white shadow-sm">
            <div className="container-md">
                <div className="row">
                    <div className="col-12 text-center py-5">
                        <div className="mb-3">
                            <FooterSocialLink title="Uptown Panda on Twitter" icon="twitter" href="https://twitter.com/PandaUptown" />
                            <FooterSocialLink title="Uptown Panda on Telegram" icon="telegram-plane" href="https://t.me/UptownPanda" />
                            <FooterSocialLink title="Uptown Panda on Discord" icon="discord" href="https://discord.gg/NGMpbMrkxA" />
                            <FooterSocialLink title="Uptown Panda on Medium" icon="medium-m" href="https://medium.com/@uptownpanda" isLast={true} />
                            {/*<FooterSocialLink title="Uptown Panda on GitHub" icon="github" href="https://github.com/uptown-panda" isLast={true} />*/}
                        </div>
                        <p>Copyright © 2020, uptownpanda.finance</p>
                        <p className="mb-0">UptownPanda is a DeFi experiment. The investor is fully responsible for the investment.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;