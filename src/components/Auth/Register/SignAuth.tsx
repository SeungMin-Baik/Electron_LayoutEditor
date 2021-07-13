import * as React from 'react';
import Button from '@material-ui/core/Button';
// Stylesheet
import './SignAuth.scss';
import AuthRegister from './Register';
import SignUp from './SignUp';
import { Link, Route, Switch } from 'react-router-dom';
import EmailResend from './EmailResend';
import Complete from './Complete';
import { FormattedDate, FormattedMessage } from 'react-intl';
import store from '@app/store';
import { push } from 'connected-react-router';

/** Props of `SignAuth` component. */
type SignAuthProps = {
    checkData: Function;

};
type SignAuthState = {
    footNumber: number;
    nextOnChange1: boolean,
    nextOnChange2: boolean
};

class SignAuth extends React.Component<SignAuthProps, SignAuthState> {
    constructor(props: SignAuthProps) {
        super(props);
        this.nextfootNum = this.nextfootNum.bind(this);
        this.saveCheck = this.saveCheck.bind(this);
        this.LoginPage = this.LoginPage.bind(this);
        this.state = {
            footNumber: 1,
            nextOnChange1: false,
            nextOnChange2: false
        };
    }
    componentDidUpdate () {
    }


    render() {

        const RegisterInfo = (
                <div style = {{width: '100%', height: '100%'}}>
                    {
                        this.state.footNumber === 1 ?
                        <AuthRegister checkData={this.saveCheck}/> : this.state.footNumber === 2 ? // props refernce 4
                        <SignUp/> : this.state.footNumber === 3 ? <EmailResend/> : null
                    }
                </div>
            );
        return (
            <>
            <div>
                <div className = 'RegisterInfo'>
                    {RegisterInfo}
                    <div className = 'SingUpNext'>
                        {
                            this.state.footNumber === 1 ?
                            <>
                                <button className='registerInfo_signupnext_close' color='primary' onClick={this.LoginPage}>
                                    <FormattedMessage
                                        id='app-common.close'
                                        defaultMessage='Close'
                                    />
                                </button>
                                <button className={(
                                                    this.state.nextOnChange1 === true && this.state.nextOnChange2 === true ?
                                                    'registerInfo_signupnext_confirm' : 'registerInfo_signupnext_false'
                                                )}
                                        disabled={this.state.nextOnChange1 === true && this.state.nextOnChange2 === true ? false : true }
                                        onClick={this.nextfootNum}>
                                            <FormattedMessage
                                                id='app-common.confirm'
                                                defaultMessage='Confirm'
                                            />
                                </button>
                            </>
                            : null
                        }
                    </div>
                </div>
            </div>
            </>
        );
    }
    private LoginPage(e: React.SyntheticEvent) {
        store.dispatch(push(`/auth`));
        console.log(e);
    }

    private nextfootNum() {
        this.setState({
            footNumber: this.state.footNumber + 1
        });
    }

    private saveCheck(check1: boolean , check2: boolean) {
        this.setState({
            nextOnChange1: check1,
            nextOnChange2: check2
        });
    }    // props Reference 1

}
export default SignAuth;
