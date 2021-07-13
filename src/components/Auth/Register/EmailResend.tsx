import * as React from 'react';
import TextField from '@material-ui/core/TextField';


// Stylesheet
import './EmailResend.scss';
import { divide, flowRight } from 'lodash';
import Button from '@material-ui/core/Button';
import store from '@app/store';
import { push } from 'connected-react-router';
import { any } from 'prop-types';
import { fontsize } from '*.jpg';
import { registEmailRequest } from '@app/apis/auth';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';



/** Props of `EmailResend` component. */

type SignUpProps = {
}& InjectedIntlProps;
type signUpState = {
    footNumber: number;
    LoginPassword: any;
    errMsgPw: string;
    errType: string;
    LoginPasswordsame: any;
    EmailInfo: string;
    errMsEmail: string;
    UserId: string;
    ButtonDisable: boolean;
};

class EmailResend extends React.Component<SignUpProps, signUpState> {
    constructor(props: SignUpProps) {
        super(props);
        this.nextfootNumber = this.nextfootNumber.bind(this);
        this.saveLoginPassword = this.saveLoginPassword.bind(this);
        this.LoginPage = this.LoginPage.bind(this);
        this.saveEmailInfo = this.saveEmailInfo.bind(this);
        this.saveUserId = this.saveUserId.bind(this);
        this.saveButtonDisable = this.saveButtonDisable.bind(this);
        this.registEmailResend = this.registEmailResend.bind(this);
        this.state = {
            footNumber: 1,
            LoginPassword: '',
            errMsgPw: '',
            errType: '',
            LoginPasswordsame: '',
            EmailInfo: '',
            errMsEmail: '',
            UserId: '',
            ButtonDisable: true
        };
    }
    render() {
        const {formatMessage} = this.props.intl;
        return (
                    <div className = 'sign-up' style = {{width: 400}}>
                            <h1>
                                <FormattedMessage
                                    id='app-register.email_resend'
                                    defaultMessage='Send E-mail to Reset'
                                />
                            </h1>
                        <div className = 'sign-up-textfield'>
                            <div className = 'sing-up-textfield-part'>
                                <div className = 'sign-up-textfield-title'>
                                    <TextField
                                        id='standard-basic'
                                        label={
                                            formatMessage({
                                                id: 'app-register.login_id',
                                                defaultMessage: 'Login ID'
                                            })
                                        }
                                        fullWidth
                                        onChange = {this.saveUserId}
                                        error={this.state.UserId.length < 4 ? true : false}
                                    />
                                </div>
                        </div>
                            <TextField
                                className='textFieldInfo'
                                onChange={this.saveLoginPassword}
                                id='standard-content'
                                type='password'
                                label={
                                    formatMessage({
                                        id: 'app-auth.signin-form.password',
                                        defaultMessage: 'Password'
                                    })
                                }
                                fullWidth
                                inputProps={{
                                                minLength: 4,
                                                maxLength: 128
                                            }}
                                error={this.state.LoginPassword.length < 8 ? true : false}
                                autoComplete='false'
                                autoCorrect='false'
                            />
                            <>
                                <TextField
                                    className='textFieldInfo'
                                    onChange={this.saveEmailInfo}
                                    id='standard-content'
                                    label='email'
                                    fullWidth
                                    inputProps={{
                                                    minLength: 4,
                                                    maxLength: 128
                                                }}
                                    error={this.state.EmailInfo.indexOf('@') != -1 ? false : true}
                                    helperText={'(example@cublic.com)'}
                                    autoComplete='false'
                                    autoCorrect='false'
                                />
                            </>
                        </div>
                        <div className='Sign-up-Button'>
                            <button className={( this.state.ButtonDisable === false ? 'email_send' : 'unsend' )}
                                    onClick={this.registEmailResend} disabled={this.state.ButtonDisable}>
                                    <FormattedMessage
                                        id='app-sign-up.create'
                                        defaultMessage='Send Email'
                                    />
                            </button>
                            <div className ='Sign-up-BackLogin'>
                                <Button color='default' className = 'sign_back_login' onClick = {this.LoginPage}>
                                    <FormattedMessage
                                        id='app-forgotpassword.login'
                                        defaultMessage='← Back to Sign In Page'
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            }
    private registEmailResend() {
        registEmailRequest({
            username: this.state.UserId,
            password: this.state.LoginPassword,
            email: this.state.EmailInfo
        })
        .then()
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
            const available_user = {
                type: 'info',
                title: 'error',
                button: ['Cancel'],
                message: formatMessage({id: 'app-common.alert_available_user', defaultMessage: 'This ID already exists.'})
            };
            const wrong_email = {
                type: 'info',
                title: 'error',
                button: ['Cancel'],
                message: formatMessage({id: 'app-common.alert_wrong_email', defaultMessage: 'Emails do not match.'})
            };
            const wrong_password = {
                type: 'info',
                title: 'error',
                button: ['Cancel'],
                message: formatMessage({id: 'app-common.alert_worng_password', defaultMessage: 'Passwords do not match'})
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
                    : error.response.data.message === 'available_user' ?
                        dialog.showMessageBox(null, available_user)
                        : error.response.data.message === 'wrong_email' ?
                            dialog.showMessageBox(null, wrong_email)
                            : error.response.data.message === 'wrong_password' ?
                                dialog.showMessageBox(null, wrong_password)
                                : error.response.data.message === 'unavailable' ?
                                    dialog.showMessageBox(null, unavailable)
                                    : null;
        });
    }

    private nextfootNumber() {
        this.setState({
            footNumber: this.state.footNumber + 1
        });
    }

    private LoginPage(e: React.SyntheticEvent) {
        store.dispatch(push(`/auth`));
        console.log(e);
    }

    private saveUserId(e: React.ChangeEvent<{ value: any}>) {
        this.setState({ UserId: e.target.value });
        this.saveButtonDisable();
        console.log(this.state.UserId, 'userid');
    }

    private saveLoginPassword(e: React.ChangeEvent<{ value: any}>) {
        this.setState({ LoginPassword: e.target.value });
        setTimeout(() => {
            if (this.state.LoginPassword.length < 8 || this.state.LoginPassword.number < 1 || this.state.LoginPassword.string < 1) {
                this.setState({ errMsgPw: '비밀번호를 다시 입력해주십시요'});
                this.setState({ errType: 'password error'});
                this.saveButtonDisable();
            } else {
                this.setState({ errMsgPw: ''});
                this.setState({ errType: ''});
                this.saveButtonDisable();
            }console.log(this.state.LoginPassword, 'pass');
        }, 100);
    }
    private saveEmailInfo(e: React.ChangeEvent<{ value: any}>) {
        this.setState({ EmailInfo: e.target.value });
        setTimeout(() => {
            if (this.state.EmailInfo.indexOf('@') != -1) {
                this.setState({ errMsEmail: '이메일 형식이 아닙니다.' });
                this.setState({ errMsEmail: 'E-mail error' });
                this.saveButtonDisable();
            } else {
                this.setState({ errMsEmail: ''});
                this.setState({ errType: ''});
                this.saveButtonDisable();
            }console.log(this.state.EmailInfo, 'email');
        }, 100);
    }

    private saveButtonDisable() {
            if (this.state.UserId.length > 4 && this.state.LoginPassword !== '' && this.state.EmailInfo.indexOf('@') != -1)  {
                this.setState({ ButtonDisable: false });
            } else {
                this.setState ({ ButtonDisable: true });
            }
    }

}

export default injectIntl(EmailResend);