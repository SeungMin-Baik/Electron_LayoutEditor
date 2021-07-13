import { getRectCenter } from '@fullcalendar/core';
import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
// Stylesheets
import Button from '@material-ui/core/Button';
import './Register.scss';
import TermsOfSevice from './TermsOfSevice';
import TermsOfSevicetwo from './TermsOfSevicetwo';
import { FormattedMessage } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

type AuthRegisterProps = {
   checkData?: Function // Props Reference 2
};


/** States of `AuthRegister` component. */
type AuthRegisterStates = {
    footNumber: number,
    nextOnchange1: boolean,
    nextOnchange2: boolean
};

class AuthRegister extends React.Component<AuthRegisterProps, AuthRegisterStates> {
    constructor(props: AuthRegisterProps) {
        super(props);
        this.nextOnchange1 = this.nextOnchange1.bind(this);
        this.nextOnchange2 = this.nextOnchange2.bind(this);
        this.state = {
            footNumber: 1,
            nextOnchange1: false,
            nextOnchange2: false

        };
    }

    componentDidUpdate () {
    }

    render() {
        return (
        <>
            <div className = 'useprentation'>
                <TermsOfSevice />
                <div className = 'checkbox'>
                    <Checkbox
                        onChange = {this.nextOnchange1}
                        style={{color: '#0066FF'}}
                    />
                    <FormattedMessage
                        id='app-register.agree'
                        defaultMessage='I have read and agree to Policies.'
                    />
                </div>
            </div>
            <div className = 'useprentation1'>
                <TermsOfSevicetwo/>
                <div className = 'checkbox1'>
                    <Checkbox
                        style={{color: '#0066FF'}}
                        onChange = {this.nextOnchange2}
                    />
                    <FormattedMessage
                        id='app-register.agree2'
                        defaultMessage='I have read and agree to Policies.'
                    />
                </div>
            </div>
        </>
        );
    }

    private nextOnchange1 (e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            nextOnchange1: e.target.checked
        });
        setTimeout(() => {
        this.props.checkData(this.state.nextOnchange1 , this.state.nextOnchange2);
        }, 100);

    }
     private nextOnchange2 (e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            nextOnchange2: e.target.checked
        });
        setTimeout(() => {
        this.props.checkData(this.state.nextOnchange1 , this.state.nextOnchange2);
        }, 100);
    }
}

export default AuthRegister;
