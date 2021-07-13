import * as React from 'react';

// Stylesheets
import './ForgotPassword.scss';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import store from '@app/store';
import { push } from 'connected-react-router';
import { passwordResetEmailRequest } from '@app/apis/auth';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import ForgotComplete from './ForgotComplete';
/** States of `AuthForgotPassword` component. */
type AuthForgotPasswordStates = {
    EmailInfo: string;
    ButtonDisable: boolean;
    UserId: string;
    footNumber: number;
    isSuccess: boolean;
};
type AuthForgotPasswordProps = { } & InjectedIntlProps;

class AuthForgotPassword extends React.Component<AuthForgotPasswordProps, AuthForgotPasswordStates> {
    constructor(props: AuthForgotPasswordProps) {
        super(props);
        this.saveButtonDisable = this.saveButtonDisable.bind(this);
        this.saveEmailInfo = this.saveEmailInfo.bind(this);
        this.LoginPage = this.LoginPage.bind(this);
        this.passwordResetEmailResend = this.passwordResetEmailResend.bind(this);
        this.FootNum = this.FootNum.bind(this);
        this.state = {
            EmailInfo: '',
            ButtonDisable: true,
            UserId: '',
            footNumber: 1,
            isSuccess: false
        };
    }
    componentDidUpdate() {
    }
    render() {
        return (
    <>
    <>
        {
            this.state.isSuccess === true ?
            <ForgotComplete emailData = {this.state.EmailInfo}/> :
            <>
                <div className='auth-forgot-reset'>
                    <FormattedMessage
                        id='app-forgotpassword.reset'
                        defaultMessage='Reset Password'
                    />
                </div>
                <div className='forgotpassword_text'>
                    <FormattedMessage
                        id='app-forgotpassword.reset_text'
                        defaultMessage='Enter your email to reset your password.'
                        values={{linebreak: <br/>}}
                    />
                <div className='forgotpassword_text_warning'>
                     <FormattedMessage
                        id='app-forgotpassword.resrt_text_warning'
                        defaultMessage='(Copy, Paste warning!)'
                    />
                </div>
                </div>
                <div className = 'auth-forgot-textfield-title'>
                    <div className = 'auth-forgo-text-email'> E-mail </div>
                    <input type='text' className='emailtext' onChange={this.saveEmailInfo}></input>
                </div>
                <button className={( this.state.ButtonDisable === false ? 'email_send' : 'unsend' )}
                        onClick={this.passwordResetEmailResend} disabled={this.state.ButtonDisable} >
                        <FormattedMessage
                            id='app-forgotpassword.resend'
                            defaultMessage='Send E-mail to Reset'
                        />
                </button>
                <div className ='auth-forgot-loginbutton'>
                    <Button color='default' onClick = {this.LoginPage} className='auth_maing_login'>
                        <FormattedMessage
                            id='app-forgotpassword.login'
                            defaultMessage='Back to Sign In Page'
                        />
                    </Button>
                </div>
            </>
        }
    </>
</>
        );
    }
    private passwordResetEmailResend() {
        passwordResetEmailRequest({
            email: this.state.EmailInfo
        })
        .then(succ => {
            this.setState({ isSuccess: true });
        })
        .catch(error => {
            const {formatMessage} = this.props.intl;
            const { dialog } = require('electron').remote;
            const invalid_email = {
                type: 'info',
                title: 'error',
                button: ['Cancel'],
                message: formatMessage({id: 'app-common.alert_invalid_email', defaultMessage: 'Email format is not correct.'})
            };
            const available_email = {
                type: 'info',
                title: 'error',
                button: ['Cancel'],
                message: formatMessage({id: 'app-common.alert_available_email', defaultMessage: 'This email already exists.'})
            };
            const wrong_email = {
                type: 'info',
                title: 'error',
                button: ['Cancel'],
                message: formatMessage({id: 'app-common.alert_wrong_email', defaultMessage: 'Emails do not match.'})
            };
            const unavailable = {
                type: 'info',
                title: 'error',
                button: ['Cancel'],
                message: formatMessage({id: 'app-common.alert_unavailable', defaultMessage: 'There is no email.'})
            };

            error.response.data.message === 'invalid_email' ?
                dialog.showMessageBox(null, invalid_email)
                    : error.response.data.message === 'available_email' ?
                        dialog.showMessageBox(null, available_email)
                            : error.response.data.message === 'wrong_email' ?
                                dialog.showMessageBox(null, wrong_email)
                                    : error.response.data.message === 'unavailable' ?
                                        dialog.showMessageBox(null, unavailable)
                                            : null;
        });
    }
    private saveEmailInfo(e: React.ChangeEvent<{ value: any}>) {
        this.setState({ EmailInfo: e.target.value });
        console.log(this.state.EmailInfo, 'EmailInfo');
        this.saveButtonDisable();
    }

    private LoginPage(e: React.SyntheticEvent) {
        store.dispatch(push(`/auth`));
        console.log(e);
    }

    private FootNum() {
        this.setState({
            footNumber : this.state.footNumber + 1
        });
    }

    private saveButtonDisable() {
        if (this.state.EmailInfo.indexOf('@') != -1) {
            this.setState({ ButtonDisable: false });
        } else {
            this.setState ({ ButtonDisable: true });
        }
    }
}

export default injectIntl(AuthForgotPassword);
