import "@/styles/globals.scss";
import { useEffect } from "react";

//redux toolkit
import { logInSuccess } from "@/features/auth/authSlice";
import { Provider } from "react-redux";
import { store } from "@/store/store";

// nprogress
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import Router from "next/router";

Router.events.on("routeChangeStart", (url) => {
    // console.log(`Loading: ${url}`);
    NProgress.start();
});

Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

//next-auth
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps, session }) {
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            store.dispatch(logInSuccess({ token }));
        }
    }, []);
    return (
        <SessionProvider session={session}>
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </SessionProvider>
    );
}
