import "bootstrap/dist/css/bootstrap.min.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
    );
};

AppComponent.getInitialProps = async (context) => {
    const client = buildClient(context.ctx);
    const { data } = await client.get("/api/users/currentuser");

    let pageProps = {};
    if (context.Component.getInitialProps) {
        pageProps = await context.Component.getInitialProps(context);
    }

    return {
        pageProps,
        ...data,
    };
};

export default MyApp;
