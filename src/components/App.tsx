import * as React from 'react';
import { Route, Switch } from 'react-router';
import * as Loadable from 'react-loadable';
// Custom Components
import { AppBaseMenuDrawer, AppBaseNavBar } from './AppPartial';

// Other components
import {
    Loading as LoadingPage,
    NotFound as NotFoundComponent
} from './Others';

// Utils
import { isTokenValid, ProtectedRoute } from '@app/utils/auth';

// Models
import { AppContainerProps } from './AppContainer';

import {
    initAppDatabaseInsertIpc,
    initAppDatabaseDeleteIpc,
    initAppDatabaseFindIpc,
    initAppDatabaseUpdateIpc
 } from '@app/utils/renderer/initialize/initDatabaseIpc';

import { connectToDashboardIpc } from '@app/utils/renderer/server/UDPServerIpc';

import { createMessageKey, createDecryptionKey, createActivateToken } from '@app/utils/renderer/server/others';

// Stylesheet
import './App.scss';


// Asynchronous app components for lazy-load
const AsyncHomeComponent = Loadable({
    loader: () => import(/* webpackChunkName: "home" */ './Home'),
    loading: LoadingPage
});
const AsyncAuthComponent = Loadable({
    loader: () => import(/* webpackChunkName: "auth" */ './Auth'),
    loading: LoadingPage
});
const AsyncAssetComponent = Loadable({
    loader: () => import(/* webpackChunkName: "asset" */ './Asset'),
    loading: LoadingPage
});
const AsyncPresentationComponent = Loadable({
    loader: () => import(/* webpackChunkName: "presentation" */ './Presentation'),
    loading: LoadingPage
});
const AsyncLayoutEditorComponent = Loadable({
    loader: () => import(/* webpackChunkName: "layoutEditor" */ './LayoutEditor'),
    loading: LoadingPage
});


/** States of `App` component. */
type AppComponentStates = {
 };

/** Props of `App` component. */
type AppComponentProps = {
    localeData?: Function;
    localCode?: string;
} & AppContainerProps;

// 컴포넌트들의 routing 정의 및 토큰 검사 컴포넌트

class App extends React.Component<AppComponentProps, AppComponentStates> {
    /** Interval for token expire observation. */
    private tokenObserver: NodeJS.Timer | number = null;
    constructor(props: AppComponentProps) {
        super(props);
        this.saveApplocaleData = this.saveApplocaleData.bind(this);
        this.state = {
        };
    }

    componentDidMount() {
        initAppDatabaseInsertIpc();
        initAppDatabaseDeleteIpc();
        initAppDatabaseFindIpc();
        initAppDatabaseUpdateIpc();
        connectToDashboardIpc();
    }

    componentDidUpdate(prevProps: AppComponentProps) {
        // Observe when page is not in sign-in page.
        if (prevProps.currentRoute !== this.props.currentRoute) {
            if (this.props.currentRoute.match(/^\/auth/)) {
                this.unobserveTokenExpire();
            } else {
                this.observeTokenExpire();
            }
        }
    }

    componentWillUnmount() {
        this.unobserveTokenExpire();
    }

    render() {
        return (
            <div className='cbkApp-Container'>
                {
                    /* App Navigation Bar */
                    this.props.isSignedIn ?
                        <AppBaseNavBar saveLocalCode={this.saveApplocaleData} localCode={this.props.localCode} /> : null
                }

                {
                    /* App Menu Drawer */
                    this.props.isSignedIn ?
                        <AppBaseMenuDrawer /> : null
                }

                {/* App Body Contents */}
                <div className={'cbkApp-Body' + (
                    !this.props.isSignedIn ?
                        ' cbkApp-Body-SignIn' : ''
                )}>
                    <Switch>
                        <ProtectedRoute
                            path='/'
                            component={AsyncHomeComponent}
                            authToken={this.props.userToken}
                            exact
                        />
                        <Route
                            path='/auth'
                            component={AsyncAuthComponent}
                        />
                        <ProtectedRoute
                            path='/asset'
                            component={AsyncAssetComponent}
                            authToken={this.props.userToken}
                        />
                        <ProtectedRoute
                            path='/presentation'
                            component={AsyncPresentationComponent}
                            authToken={this.props.userToken}
                        />
                        <ProtectedRoute
                            path='/layoutEditor'
                            component={AsyncLayoutEditorComponent}
                            authToken={this.props.userToken}
                        />
                        <ProtectedRoute
                            path='**'
                            component={NotFoundComponent}
                            authToken={this.props.userToken}
                        />
                    </Switch>
                </div>

            </div>
        );
    }

    private saveApplocaleData(translationsData: any) {
        this.props.localeData(translationsData);
    }

    // =============== Token ===============

    /**
     * Observe token expire.
     * If token expired, log-out app and clear token.
     */
    private observeTokenExpire() {
        this.unobserveTokenExpire();
        this.tokenObserver = setInterval(() => {
            if (!isTokenValid(this.props.userToken)) {
                this.props.appSignOut();
            }
        }, 10000);  // Check every 10 sec.
    }


    /**
     * Unobserve token expire.
     */
    private unobserveTokenExpire() {
        if (this.tokenObserver) {
            clearInterval(this.tokenObserver as NodeJS.Timer);
            this.tokenObserver = null;
        }
    }

}

export default App;
