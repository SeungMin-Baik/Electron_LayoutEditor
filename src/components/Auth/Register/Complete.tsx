import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { Route } from 'react-router';
import SignUp from './SignUp';
// Stylesheet
import './Complete.scss';
import { divide, flowRight } from 'lodash';
import Button from '@material-ui/core/Button';
import EmailResend from './EmailResend';
import store from '@app/store';
import { push } from 'connected-react-router';
import { FormattedMessage } from 'react-intl';
import { ThreeSixtyOutlined } from '@material-ui/icons';
/** Props of `Complete` component. */
type CompleteProps = {
    emailData: string;
};
type CompleteState = {
    footNumber: number;
};

class Complete extends React.Component<CompleteProps, CompleteState> {
    constructor(props: CompleteProps) {
        super(props);
        this.LoginPage = this.LoginPage.bind(this);
        this.NextFootNumber = this.NextFootNumber.bind(this);
       // this.saveEmail = this.saveEmail.bind(this);
        this.state = {
            footNumber: 1
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <>
                {
                    this.state.footNumber === 2 ?
                        <EmailResend/>
                    :
                    <>
                        <div className = 'Complete-auth-emailvarify'>
                            {this.props.emailData}
                        </div>
                        <div className = 'Complete-auth-text'>
                            <FormattedMessage
                                    id='app-register.auth_text'
                                    defaultMessage='We sent an email to below e-mail address to verify your email. Check it, please.This process is required to use your account'
                                    values={{linebreak: <br/>}}
                            />
                        </div>
                        <div className='complete_button'>
                            <button className='email_resend' onClick={this.NextFootNumber} >
                                    <FormattedMessage
                                        id='app-register.email-resend'
                                        defaultMessage='Resend your E-mail'
                                    />
                            </button>
                            <Button color='default' className = 'sign-up-next' onClick = {this.LoginPage}>
                                <FormattedMessage
                                    id='app-forgotpassword.login'
                                    defaultMessage='Back to Sign In Page'
                                />
                            </Button>
                        </div>
                    </>
                }
            </>
        );
    }

    private LoginPage(e: React.SyntheticEvent) {
        store.dispatch(push(`/auth`));
        console.log(e);
    }

    private NextFootNumber() {
        this.setState({
          footNumber: this.state.footNumber + 1
        });
    }

}

export default Complete;
