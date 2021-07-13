import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/pro-regular-svg-icons/faLanguage';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LanguageIcon from '@material-ui/icons/Language';

import FormControl from '@material-ui/core/FormControl';
import Menu from '@material-ui/core/Menu';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import store from '@app/store';


// Stylesheet
import './BaseNavBar.scss';
import { FormatQuoteRounded } from '@material-ui/icons';
import HomeInfoBody from '@app/components/Home/Info/HomeInfoBody';



type BaseNavBarProps = {
    /** CSS styles. */
    style?: React.CSSProperties;
    saveLocalCode: Function;
    localCode: string;
};

type BaseNavBarStates = {
    changeLang: string;
    setAnchorEl: any;
    footNumber: number;
};

class BaseNavBar extends React.Component<BaseNavBarProps, BaseNavBarStates> {
    constructor(props: BaseNavBarProps) {
        super(props);
        this.LinkToAuth = this.LinkToAuth.bind(this);
        this.state = {
            changeLang: '',
            setAnchorEl: null,
            footNumber: 1
        };
    }

    componentDidMount() {
        this.setState({
            changeLang: this.props.localCode
        });
    }

    componentDidUpdate() {
    }

    render() {

        return (
            <nav className='cbkApp-NavBar' style={this.props.style}>
                <div className='cbkApp-NavBar-content'>
                    <div className='cbkApp-NavBar-info'>
                        <div className='cbkApp-Language-Change'>
                            <LanguageIcon className='cbkApp-Language-Change-Icon'/>
                            <FormControl className='select-size'>
                                <Select
                                    className='baseNavBar-select-lang'
                                    aria-label='demo-simple-select-label'
                                    id='demo-simple-select'
                                    value={this.state.changeLang}
                                    onChange={this.changeLang}
                                >
                                    <MenuItem value={'ko'}>한국어</MenuItem>
                                    <MenuItem value={'en'}>English</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='cbkApp-NaBar-info-Logout'>
                            <Button style={{textTransform: 'none'}} aria-controls='simple-menu' aria-haspopup='true' onClick={this.handleClick}>
                                <AccountCircleIcon className='cbkApp-NaBar-info-LogoutIcon' />
                                <div className='cbkApp-NaBar-info-LogoutText'> {store.getState().appAuth.userData.name}</div>
                            </Button>
                        </div>
                        <Menu
                            className='menu-item'
                            id='simple-menu'
                            anchorEl={this.state.setAnchorEl}
                            keepMounted
                            open={Boolean(this.state.setAnchorEl)}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={this.LinkToAuth}>
                                <FormattedMessage
                                    id='app-common.logOut'
                                    defaultMessage='Logout'
                                />
                            </MenuItem>
                            {/* <MenuItem onClick={this.UserInfomationPaper}>
                                <Link to='/homeUserInfo' style={{ textDecoration: 'none', color: 'black'}}>
                                    <FormattedMessage
                                        id='app-common.user_Information'
                                        defaultMessage='User Information'
                                    />
                                </Link>
                            </MenuItem> */}
                        </Menu>
                    </div>
                </div>
            </nav>
        );
    }

    private LinkToAuth () {
        store.dispatch(push(`/auth`));
    }

   private UserInfomationPaper = () => {
       this.setState({
           footNumber: this.state.footNumber + 1
       });
   }

    private handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({
            setAnchorEl: event.currentTarget
        });
    };

    private handleClose = () => {
        this.setState({
            setAnchorEl: null
        });
    };

    private changeLang = (e: React.ChangeEvent< {value: string}>) => {
        if (e.target.value === 'ko') {
            if (this.props.localCode === 'en') {
                this.setState({
                    changeLang: e.target.value
                }, () => {
                    this.props.saveLocalCode(this.state.changeLang);
                });
            }
        } else if (e.target.value === 'en') {
            if (this.props.localCode === 'ko') {
                this.setState({
                    changeLang: e.target.value
                }, () => {
                    this.props.saveLocalCode(this.state.changeLang);
                });
            }
        }
    }

}

export default BaseNavBar;
