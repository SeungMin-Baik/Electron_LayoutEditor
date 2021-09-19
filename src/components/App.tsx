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


import {
    initAppDatabaseInsertIpc,
    initAppDatabaseDeleteIpc,
    initAppDatabaseFindIpc,
    initAppDatabaseUpdateIpc
 } from '@app/utils/renderer/initialize/initDatabaseIpc';

// Stylesheet
import './App.scss';


// Asynchronous app components for lazy-load
const AsyncHomeComponent = Loadable({
    loader: () => import(/* webpackChunkName: "home" */ './Home'),
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
};

class App extends React.Component<AppComponentProps, AppComponentStates> {
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
        console.log('pat1', window.location.pathname);
    }

    componentDidUpdate() {
        console.log('path2', window.location.pathname);
    }


    render() {
        return (
            <div className='LayoutEditor-Container'>
                {
                    <AppBaseNavBar saveLocalCode={this.saveApplocaleData} localCode={this.props.localCode} />
                }

                {
                    <AppBaseMenuDrawer />
                }

                {/* App Body Contents */}
                <div className='LayoutEditor-Body'>
                    <Switch>
                        <Route
                            path='/'
                            component={AsyncHomeComponent}
                            exact
                        />
                        <Route
                            path='/asset'
                            component={AsyncAssetComponent}
                        />
                        <Route
                            path='/presentation'
                            component={AsyncPresentationComponent}
                        />
                        <Route
                            path='/layoutEditor'
                            component={AsyncLayoutEditorComponent}
                        />
                        <Route
                            path='**'
                            component={NotFoundComponent}
                        />
                    </Switch>
                </div>

            </div>
        );
    }

    private saveApplocaleData(translationsData: any) {
        this.props.localeData(translationsData);
    }

}

export default App;
