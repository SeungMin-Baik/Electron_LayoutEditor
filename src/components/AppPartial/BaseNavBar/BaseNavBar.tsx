import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import LanguageIcon from '@material-ui/icons/Language';
import EmailIcon from '@material-ui/icons/Email';
import GitHubIcon from '@material-ui/icons/GitHub';
import BookIcon from '@material-ui/icons/Book';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Tooltip } from '@material-ui/core';

import store from '@app/store';


// Stylesheet
import './BaseNavBar.scss';



type BaseNavBarProps = {
    /** CSS styles. */
    style?: React.CSSProperties;
    saveLocalCode: Function;
    localCode: string;
};

type BaseNavBarStates = {
    changeLang: string;
};

class BaseNavBar extends React.Component<BaseNavBarProps, BaseNavBarStates> {
    constructor(props: BaseNavBarProps) {
        super(props);
        this.state = {
            changeLang: '',
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
            <nav className='LayoutEditor-NavBar' style={this.props.style}>
                <div className='LayoutEditor-NavBar-content'>
                    <div className='LayoutEditor-NavBar-info'>
                        <div className='LayoutEditor-Language-Change'>
                            <LanguageIcon className='LayoutEditor-Language-Change-Icon'/>
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

                        <div className='LayoutEditor-NavBar-MyInfo'>
                            <Tooltip title='qortmdalsdl22@gmail.com'>
                                <EmailIcon className='LayoutEditor-NavBar-MyInfo-Icon' />
                            </Tooltip>

                            <Tooltip title='Github'>
                                <GitHubIcon className='LayoutEditor-NavBar-MyInfo-Icon' onClick={this.openGithub}/>
                            </Tooltip>

                            <Tooltip title='Blog'>
                                <BookIcon className='LayoutEditor-NavBar-MyInfo-Icon' onClick={this.openBlog}/>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

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

    private openGithub = () => {
        window.open('https://github.com/SeungMin-Baik', 'newWindow');
    }

    private openBlog = () => {
        window.open('https://velog.io/@qortmdalsdl', 'newWindow');
    }

}

export default BaseNavBar;
