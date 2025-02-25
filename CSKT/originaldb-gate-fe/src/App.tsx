import { LoadingProvider } from './providers/LoadingProvider';
import Router from './routing';
import './App.scss';
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { themeConfig } from "@app/configs/themeConfig";
import { ModalProvider } from "./contexts/ModalContext";
import { MessageProvider } from "./contexts/MessageContext";
import { useEffect } from 'react';
import { LOCAL_USER_KEY } from './configs/auth.config';
import cache from './core/cache';
import HTTP from './core/http';
const App = () => {
    useEffect(() => {
        const res = cache.getCache(LOCAL_USER_KEY);
        if (res?.data?.token) {
            HTTP.setToken(res?.data?.token)
        }
    }, [])
    return (
        <LoadingProvider>
            <ConfigProvider
                theme={themeConfig}
                locale={viVN}
            >
                <MessageProvider>
                    <ModalProvider>
                        <Router />
                    </ModalProvider>
                </MessageProvider>
            </ConfigProvider>
        </LoadingProvider>
    )
};

export default App
