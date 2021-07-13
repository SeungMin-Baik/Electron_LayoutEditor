import * as React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { faEye } from '@fortawesome/pro-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/pro-solid-svg-icons/faEyeSlash';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/pro-regular-svg-icons/faLanguage';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import MenuItem from '@material-ui/core/MenuItem';
import Root from './../../../Root';


// Stylesheets
import './SignIn.scss';

// Models
import { SignInContainerProps } from './SignInContainer';
import { localeData } from 'moment';
import { ContactlessOutlined } from '@material-ui/icons';


/** Props of `AuthSignIn` component. */
type AuthSignInProps = {
    localedata: any;
} & SignInContainerProps & InjectedIntlProps;

/** States of `AuthSignIn` component. */
type AuthSignInStates = {

    /** User input credentials. */
    credentials: {
        /** User name. */
        username: string;
        /** User password. */
        password: string;
    }
    /** Is form wait for loading finish. */
    onLoading: boolean;
    /** Error message ID for sign-in. */
    errMsgId: string;
    /** Is password field visible? */
    isPasswordVisible: boolean;
};

class AuthSignIn extends React.Component<AuthSignInProps, AuthSignInStates> {
    constructor(props: AuthSignInProps) {
        super(props);
        this.onSignIn = this.onSignIn.bind(this);
        this.togglePasswordVisible = this.togglePasswordVisible.bind(this);
        this.state = {
            credentials: {
                username: '',
                password: ''
            },
            onLoading: false,
            errMsgId: '',
            isPasswordVisible: false

        };
    }

    componentDidUpdate(prevProps: AuthSignInProps) {
        if (prevProps.authStatus !== this.props.authStatus) {
            this.onSignInStatusChanged();
        }
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <>
            <div className='cbkApp-AuthSignIn'>
                <form className='signin-form' onSubmit={this.onSignIn}>
                    {/* Username */}
                    <TextField
                        className='form-input'
                        onChange={e => this.onInputChanged(
                            'UN',
                            e.target.value
                        )}
                        inputProps={{
                            minLength: 4,
                            maxLength: 128
                        }}
                        label={
                            formatMessage({
                                id: 'app-auth.signin-form.username',
                                defaultMessage: 'Username'
                            })
                        }
                        disabled={this.state.onLoading}
                        error={!!this.state.errMsgId}
                        margin='dense'
                        variant='outlined'
                        autoComplete='false'
                        autoCorrect='false'
                        autoFocus
                    />

                    {/* Password */}
                    <TextField
                        className='form-input'
                        type={
                            this.state.isPasswordVisible ?
                                'text' : 'password'
                        }
                        onChange={e => this.onInputChanged(
                            'PW',
                            e.target.value
                        )}
                        // InputProps={{
                        //     endAdornment: (
                        //         <InputAdornment position='end'>
                        //             <IconButton onClick={this.togglePasswordVisible}>
                        //                 <FontAwesomeIcon icon={
                        //                     this.state.isPasswordVisible ?
                        //                         faEyeSlash : faEye
                        //                 } />
                        //             </IconButton>
                        //         </InputAdornment>
                        //     )
                        // }}
                        inputProps={{
                            minLength: 4,
                            maxLength: 128
                        }}
                        label={
                            formatMessage({
                                id: 'app-auth.signin-form.password',
                                defaultMessage: 'Password'
                            })
                        }
                        disabled={this.state.onLoading}
                        error={!!this.state.errMsgId}
                        helperText={
                            this.state.errMsgId ?
                                formatMessage({
                                    id: this.state.errMsgId,
                                    defaultMessage: 'Error'
                                })
                            :
                                null
                        }
                        margin='dense'
                        variant='outlined'
                        autoComplete='false'
                        autoCorrect='false'
                    />

                    {/* Sign in button */}
                    <button
                        type='submit'
                        className={!(
                            this.state.credentials.username.length >= 4 &&
                            this.state.credentials.password.length >= 4
                            ) ||
                            this.state.onLoading ? 'form-button-disable' : 'form-button'
                        }
                        color='primary'
                        disabled={
                            !(
                                this.state.credentials.username.length >= 4 &&
                                this.state.credentials.password.length >= 4
                            ) ||
                            this.state.onLoading
                        }
                    >
                        <CircularProgress
                            size={15}
                            style={{
                                display: !this.state.onLoading ?
                                    'none' : null
                            }}
                        />
                        <FormattedMessage
                            id='app-auth.signin'
                            defaultMessage='Sign In'
                        />
                    </button>

                    <div className='form-extCover'>
                        {/* Link of forgot account */}
                        <div className='form-ext'>
                            <Link to='/auth/forgot'>
                                <FormattedMessage
                                    id='app-auth.signin-form.forgotMsg'
                                    defaultMessage='Forgot Password'
                                />
                            </Link>
                        </div>

                        <div className='form-ext-last'>
                            <Link to='/auth/signAuth'>
                                <FormattedMessage
                                    id='app-auth.register'
                                    defaultMessage='Register'
                                />
                            </Link>
                        </div>
                    </div>

                </form>
            </div>
        </>
        );
    }


    /**
     * On input changed.
     * @param type  Input type.
     * @param value Input value.
     */
    private onInputChanged(type: 'UN' | 'PW', value: string) {
        const tmpState = { credentials: { ...this.state.credentials } };
        switch (type) {
            case 'UN':
                tmpState.credentials.username = value;
                break;

            case 'PW':
                tmpState.credentials.password = value;
                break;

            default:
                break;
        }

        this.setState(tmpState);
    }
    /**
     * On sign-in button clicked.
     */
    private onSignIn(e: React.SyntheticEvent) {
        e.preventDefault();
        this.setState({
            onLoading: true,
            errMsgId: ''
        }, () => {
            this.props.signIn({
                username: this.state.credentials.username,
                password: this.state.credentials.password
            });
        });
    }


    /**
     * On sign-in status changed.
     */
    private onSignInStatusChanged() {
        if (this.props.authStatus) {
            // If status changed, set loading false.
            this.setState({ onLoading: false }, () => {
                // If status message exist, show message to form.
                let errMsgId = '';
                switch (this.props.authStatus) {
                    case 'ERR_WRONG_CREDENTIALS':
                        errMsgId = 'app-auth.signin-form.msg-error.credentials';
                        break;

                    case 'ERR_INVALID_TOKEN':
                    case 'ERR_SERVER':
                    default:
                        errMsgId = 'app-auth.signin-form.msg-error.server';
                        break;
                }

                // Set error message ID.
                this.setState({ errMsgId });
            });
        }
    }


    /**
     * Toggle password visibility.
     */
    private togglePasswordVisible() {
        this.setState({
            isPasswordVisible: !this.state.isPasswordVisible
        });
    }
}

export default injectIntl(AuthSignIn);
