import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { push } from 'connected-react-router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import store from '@app/store';

// Models
import { AuthTabContainerProps } from './AuthTabContainer';

// Stylesheets
import './AuthTab.scss';


/** Props of `AuthTab` component. */
type AuthTabProps = { } & AuthTabContainerProps & InjectedIntlProps;

/** States of `AuthTab` component. */
type AuthTabStates = {
    /** Auth tab index. */
    tabIndex: number;
};

class AuthTab extends React.Component<AuthTabProps, AuthTabStates> {
    constructor(props: AuthTabProps) {
        super(props);
        this.onTabChanged = this.onTabChanged.bind(this);
        this.state = {
            tabIndex: -1
        };
    }

    componentDidMount() {
        this.setTabSelection();
    }

    componentDidUpdate(prevProps: AuthTabProps) {
        if (prevProps.currentRoute !== this.props.currentRoute) {
            this.setTabSelection();
        }
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            this.state.tabIndex >= 0 ?
                <div className='cbkApp-AuthTab'>
                    <Tabs
                        value={this.state.tabIndex}
                        onChange={this.onTabChanged}
                        indicatorColor='primary'
                        textColor='primary'
                        variant='fullWidth'
                        action={
                            () => setTimeout(() => {
                                // Force emit window resize event after tab mounted,
                                // to update indicator position and size.
                                // Seems to bug of React-Mui.
                                // ref: https://github.com/mui-org/material-ui/issues/9337
                                window.dispatchEvent(new CustomEvent('resize'));
                            }, 0)
                        }
                    >
                        { <Tab label={
                            formatMessage({
                                id: 'app-auth.signin',
                                defaultMessage: 'Sign In'
                            })
                        } /> }
                        { <Tab label={
                            formatMessage({
                                id: 'app-auth.register',
                                defaultMessage: 'Register'
                            })
                        } /> }
                    </Tabs>
                </div>
            :
                null
        );
    }


    /**
     * Determine and set tab index to select.
     */
    private setTabSelection() {
        // Determine tab index.
        let tabIndex: number = null;
        switch (this.props.currentRoute) {
            case '/auth/signin':
                tabIndex = 0;
                break;

            case '/auth/signAuth':
                tabIndex = 1;
                break;

            default:
                // `-1` for hide tab.
                tabIndex = -1;
                break;
        }

        // Change tab index state.
        this.setState({ tabIndex });
    }


    /**
     * On auth tab selection changed.
     */
    private onTabChanged(e: React.SyntheticEvent, tabIndex: number) {
        // Change route as tab index.
        switch (tabIndex) {
            case 0:  store.dispatch(push('/auth/signin'));   break;
            case 1:  store.dispatch(push('/auth/signAuth')); break;
            default: break;
        }
    }
}

export default injectIntl(AuthTab);
