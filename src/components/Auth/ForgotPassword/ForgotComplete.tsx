import * as React from 'react';
import store from '@app/store';
import { push } from 'connected-react-router';
import Button from '@material-ui/core/Button';
import { faMailBulk } from '@fortawesome/pro-regular-svg-icons/faMailBulk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
// Stylesheet
import './ForgotComplete.scss';


/** Props of `ForgotComplete` component. */
type ForgotCompleteProps = {
    emailData: string;
};

class ForgotComplete extends React.Component<ForgotCompleteProps, {}> {
    constructor(props: ForgotCompleteProps) {
        super(props);
        this.LoginPage = this.LoginPage.bind(this);
    }

    render() {
        return (
            <>
             <FontAwesomeIcon icon={faMailBulk} className='mail_bulk_icon' />
                <div className ='complete-auth-emailvarify'>
                    {this.props.emailData}
                </div>
                <div className='auth-forgot-resendmessge'>
                    <FormattedMessage
                        id='app-forgotpassword.email_complete'
                        defaultMessage='Please check your mail!.'
                    />
                </div>
                <div className = 'auth-forgot-message'>
                    <FormattedMessage
                    id='app-forgotpassword.email'
                    defaultMessage='Please check your mail!.'
                />
                </div>
                <div className ='auth-forgot-loginbutton-complete'>
                    <Button color='default' onClick={this.LoginPage} className='auth_main_login'>
                        <FormattedMessage
                            id='app-forgotpassword.login'
                            defaultMessage='Back to Sign In Page'
                        />
                    </Button>
                </div>
            </>
        );
    }
    private LoginPage(e: React.SyntheticEvent) {
        store.dispatch(push((`/auth`)));
    }
}

export default ForgotComplete;