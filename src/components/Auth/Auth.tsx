import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { push } from 'connected-react-router';
import store from '@app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/pro-regular-svg-icons/faLanguage';

// Components
import AuthTab from './AuthTabContainer';
import SignIn from './SignIn';
import Complete from './Register/Complete';

import ForgotPassword from './ForgotPassword';

// Models
import { AuthContainerProps } from './AuthContainer';

// Stylesheets
import './Auth.scss';

// Images
import * as Logo from '../../../public/media/logo.colored.png';
import SignAuth from './Register/SignAuth';



/** Props of `Auth` component. */
type AuthProps = {} & AuthContainerProps;

/** States of `Auth` component. */
type AuthStates = {
    /** Auth tab index. */
    tabIndex: number;
};

// 로그인 관련 routing 및 최상단 부모 컴포넌트
class Auth extends React.Component<AuthProps, AuthStates> {
    constructor(props: AuthProps) {
        super(props);
        this.state = {
            tabIndex: 0
        };
    }

    componentDidMount() {
        // Sign out to clear auth data.
        this.props.signOut();
    }

    render() {
        return (
            <div className='cbkApp-Auth'>
                <div className='auth-contents'>

                    {/* Brand Logo */}
                    <div className='auth-brand' onClick = {this.LoginPage}>
                        {/* <img className='brand-logo'
                            src={null}
                        /> */}
                        <div className='auth-account'> ID: smbaik  PASS: smbaik123 </div>
                    </div>

                    {/* Auth form box */}
                    <div className='auth-box'>
                        <div className='auth-box-contents'>
                            <Switch>
                                <Route
                                    path='/auth'
                                    render={() =>
                                        <Redirect to={{
                                            pathname: '/auth/signin'
                                        }} />
                                    }
                                    exact
                                />
                                <Route
                                    path='/auth/signin'
                                    component={SignIn}
                                />
                                <Route
                                    path='/auth/signAuth'
                                    component={SignAuth}
                                />
                                <Route
                                    path='/auth/forgot'
                                    component={ForgotPassword}
                                />

                                <Route
                                    path='/auth/register/complete'
                                    component={Complete}
                                />
                            </Switch>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
    private LoginPage(e: React.SyntheticEvent) {
        store.dispatch(push(`/auth`));
        console.log(e);
    }

}

export default Auth;
