import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { Route } from 'react-router';
import { injectIntl, InjectedIntlProps, FormattedDate, FormattedMessage } from 'react-intl';
// Stylesheet
import './SignUp.scss';
import Paper from '@material-ui/core/Paper';
import { divide, flowRight, thru } from 'lodash';
import Button from '@material-ui/core/Button';
import store from '@app/store';
import { push } from 'connected-react-router';
import { any, number, string } from 'prop-types';
import { fontsize } from '*.jpg';
import { Link } from 'react-router-dom';
import Auth from './SignAuth';

import { registUser } from '@app/apis/auth';
import Complete from './Complete';
import { faMailBulk } from '@fortawesome/pro-regular-svg-icons/faMailBulk';




/** Props of `SignUp` component. */
type SignUpProps = {
} & InjectedIntlProps;

type signUpState = {
    footNumber: number;
    LoginPassword: any;
    errMsgPw: any;
    errType: string;
    LoginPasswordsame: any;
    EmailInfo: string;
    errMsEmail: string;
    UserId: string;
    ButtonDisable: boolean;
    isSuccess: boolean;
    formatMessage: string
};

class SignUp extends React.Component<SignUpProps, signUpState> {
    constructor(props: SignUpProps) {
        super(props);
        this.saveLoginPassword = this.saveLoginPassword.bind(this);
        this.LoginPage = this.LoginPage.bind(this);
        this.saveLoginPasswordsame = this.saveLoginPasswordsame.bind(this);
        this.saveEmailInfo = this.saveEmailInfo.bind(this);
        this.saveUserId = this.saveUserId.bind(this);
        this.saveButtonDisable = this.saveButtonDisable.bind(this);
        this.state = {
            footNumber: 1,
            LoginPassword: '',
            errMsgPw: '',
            errType: '',
            LoginPasswordsame: '',
            EmailInfo: '',
            errMsEmail: '',
            UserId: '',
            ButtonDisable: true,
            isSuccess: false,
            formatMessage: ''
        };
    }
    componentDidUpdate() {
        console.log('footNumber', this.state.footNumber);
    }
    render() {
        return (
        <>
            {
                this.state.isSuccess === true ?
                    <Complete emailData = {this.state.EmailInfo}/>
                :
                    <div className='sign-up' style={{width: 400}}>
                        <div className='sign-up-textfield'>
                            <div className='sign_id'>
                                <FormattedMessage
                                    id='app-common.id'
                                    defaultMessage='ID'
                                />
                            </div>
                                <TextField
                                    className='sign-up-textfield-userid'
                                    color='primary'
                                    id='outlined-basic'
                                    fullWidth
                                    variant='outlined'
                                    onChange={this.saveUserId}
                                />
                            <div className='sign_password'>
                                <FormattedMessage
                                    id='app-common.password'
                                    defaultMessage='PASSWORD'
                                />
                            </div>
                                <TextField
                                    className='sign-up-textfield-userid1'
                                    color='primary'
                                    onChange={this.saveLoginPassword}
                                    id='outlined-basic'
                                    variant='outlined'
                                    type='password'
                                    fullWidth
                                    inputProps={{
                                        minLength: 4,
                                        maxLength: 128
                                    }}
                                />
                            <div className='sign_passwordsame'>
                                <FormattedMessage
                                    id='app-common.password_same'
                                    defaultMessage='PASSWORD CONFIRM'
                                />
                            </div>
                                <TextField
                                    className='sign-up-textfield-userid2'
                                    color='primary'
                                    variant='outlined'
                                    onChange={this.saveLoginPasswordsame}
                                    id='outlined-basic'
                                    type='password'
                                    fullWidth
                                    inputProps={{
                                        minLength: 4,
                                        maxLength: 128
                                    }}
                                />
                            <div className='sign_email'>
                                <FormattedMessage
                                    id='app-common.email'
                                    defaultMessage='E-MAIL'
                                />
                            </div>
                                <TextField
                                    className='sign-up-textfield-userid3'
                                    variant='outlined'
                                    onChange={this.saveEmailInfo}
                                    id='outlined-basic'
                                    color='primary'
                                    fullWidth
                                    inputProps={{
                                        minLength: 4,
                                        maxLength: 128
                                    }}
                                />
                        </div>
                            <div className='Sign-up-Button'>
                                <>
                                    <button className={( this.state.ButtonDisable === false ? 'email_send' : 'unsend')}
                                            onClick={this.registerUser} disabled={this.state.ButtonDisable}>
                                            <FormattedMessage
                                                id='app-sign-up.create'
                                                defaultMessage='Send Email'
                                            />
                                    </button>
                                </>
                                    <Button color='default' className='sign_back_login' onClick={this.LoginPage}>
                                        <FormattedMessage
                                            id='app-forgotpassword.login'
                                            defaultMessage='← Back to Sign In Page'
                                        />
                                    </Button>
                            </div>
                    </div>
            }
        </>
        );
    }

    private registerUser = () => {

        const supportLangs = navigator.languages;
        console.log('supportLangs', supportLangs);


       registUser({
            username: this.state.UserId,
            password: this.state.LoginPassword,
            email: this.state.EmailInfo,
            defLanguage: supportLangs
        })
        .then(succ => {
        //    store.dispatch(push('/auth/register/complete'));
            this.setState({ isSuccess: true});
            console.log('asdasd', succ);
        })
        .catch(error => {
            console.log('error', error);
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

    private LoginPage(e: React.SyntheticEvent) {
        store.dispatch(push(`/auth`));
    }

    private saveUserId(e: React.ChangeEvent<{ value: any}>) {
        this.setState({ UserId: e.target.value });
        this.saveButtonDisable();
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
    private saveLoginPasswordsame(e: React.ChangeEvent<{ value: any}>) {
        this.setState({ LoginPasswordsame: e.target.value });
        setTimeout(() => {
            if (this.state.LoginPasswordsame.any === !this.saveLoginPassword) {
                this.setState({ errMsgPw: '비밀번호가 일치하지 않습니다.' });
                this.setState({ errType: 'password error.' });
                this.saveButtonDisable();
            } else {
                this.setState({ errMsgPw: ''});
                this.setState({ errType: ''});
                this.saveButtonDisable();
            }
            console.log(this.state.LoginPasswordsame, 'passsame');
        }, 100);
    }
    private saveEmailInfo(e: React.ChangeEvent<{ value: any}>) {
        this.setState({ EmailInfo: e.target.value }, () => {
            if (this.state.EmailInfo.indexOf('@') != -1) {
                this.setState({ errMsEmail: '이메일 형식이 아닙니다.' });
                this.setState({ errMsEmail: 'E-mail error' });
                this.saveButtonDisable();
            } else {
                this.setState({ errMsEmail: ''});
                this.setState({ errType: ''});
                this.saveButtonDisable();
            }
        });
        setTimeout(() => {
            console.log(this.state.EmailInfo, 'email');
        }, 100);
    }
    private saveButtonDisable() {
        if (this.state.UserId.length > 4 && this.state.LoginPassword !== '' && this.state.LoginPasswordsame !== '' && this.state.EmailInfo.indexOf('@') != -1)  {
            this.setState({ ButtonDisable: false });
        } else {
            this.setState ({ ButtonDisable: true });
        }
    }

}

export default injectIntl(SignUp);
