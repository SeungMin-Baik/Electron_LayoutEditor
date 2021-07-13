import * as React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop } from '@fortawesome/pro-solid-svg-icons/faDesktop';
import { faList } from '@fortawesome/pro-regular-svg-icons/faList';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faBars } from '@fortawesome/pro-solid-svg-icons/faBars';
import { faCommentAltLines } from '@fortawesome/pro-regular-svg-icons/faCommentAltLines';
import { faShoppingCart } from '@fortawesome/pro-regular-svg-icons/faShoppingCart';
import { faFolders } from '@fortawesome/pro-regular-svg-icons/faFolders';
import { faIcons } from '@fortawesome/pro-regular-svg-icons/faIcons';
import { faEdit } from '@fortawesome/pro-regular-svg-icons/faEdit';
import { faHome } from '@fortawesome/pro-regular-svg-icons/faHome';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


// Stylesheet
import './BaseMenuDrawer.scss';

// Images
import * as MenuLogo from '../../../../public/media/logo.white.png';
import store from '@app/store';


/** Props of `BaseMenuDrawer` component. */
type BaseMenuDrawerProps = {
};

type BaseMenuDrawerStates = {
    handleMenuBar: boolean;
};

class BaseMenuDrawer extends React.Component<BaseMenuDrawerProps, BaseMenuDrawerStates> {
    /** Menu drawer contents list. */
    private menuList = [

        {
            id: 'app-menu.item.asset',
            defaultName: 'Asset',
            icon: faFolders,
            link: '/asset'

        },

        {
            id: 'app-menu.item.presentation',
            defaultName: 'Presentation',
            icon: faIcons,
            link: '/presentation'
        },

        {
            id: 'app-menu.item.layout-Editor',
            defaultName: 'Layout Editor',
            icon: faEdit,
            link: '/layoutEditor'
        },

    ];
    constructor(props: BaseMenuDrawerProps & InjectedIntlProps) {
        super(props);
        this.onHandleMenuBar = this.onHandleMenuBar.bind(this);
        this.state = {
            handleMenuBar: true
        };
    }

    componentDidUpdate() {
        console.log(`/${window.location.pathname.substring(4)}`);
    }

    render() {
        const BasemenuDrawerList = (
            <List className='menu-list'>
                {this.menuList.map(menu => {
                    return (
                        <Link
                            className='menu-item-wrap'
                            to={menu.link}
                            key={`menu-${menu.id}`}
                        >
                            <ListItem
                                className={
                                    (`/${window.location.pathname.substring(4)}` === menu.link) || `/${window.location.pathname.substring(4)}`.indexOf(menu.link) > -1
                                    ? 'menu-item-select' : 'menu-item'
                                }
                                button
                            >
                                <ListItemIcon className='item-icon'>
                                    <FontAwesomeIcon icon={menu.icon} size='xs' />
                                </ListItemIcon>
                                {
                                    this.state.handleMenuBar ?
                                        <ListItemText
                                            className='item-text'
                                            primary={
                                                <FormattedMessage
                                                    id={menu.id}
                                                    defaultMessage={menu.defaultName}
                                                    values={{br: <br/>}}
                                                />
                                            }
                                        />
                                        : null
                                }
                            </ListItem>
                        </Link>
                    );
                }
                )}
            </List>
        );

        return (
            <>
                {/* Menu */}
                {
                    this.state.handleMenuBar ?
                        <>
                            <aside className='cbkApp-Menu-Drawer'>
                                <div className='cbkApp-Menu'>

                                    {/* Menu - Brand logo */}
                                    <div className='menu-brand'>
                                        <Link to='/'>
                                            <span className='brand-logo'>
                                                <FontAwesomeIcon icon={faHome} />
                                            </span>
                                        </Link>
                                    </div>

                                    {/* Menu - List */}
                                    <div className='menu-list-wrap'>
                                        {BasemenuDrawerList}
                                    </div>

                                </div>
                            </aside>

                            {/* Menu padding */}
                            {
                                `/${window.location.pathname.substring(4)}` !== '/layoutEditor' ?
                                    <div className='cbkApp-Menu-Drawer-Pad' />
                                :
                                    <div className='cbkApp-Menu-Drawer-Pad-Editor' />
                            }

                        </>
                        :
                        <>
                            <aside className='cbkApp-Menu-Drawer-Reduction'>
                                <div className='cbkApp-Menu'>

                                    {/* Menu - Brand logo */}
                                    <div className='menu-brand'>
                                        <span className='Bars' onClick={this.onHandleMenuBar}> <FontAwesomeIcon icon={faBars} /> </span>
                                    </div>

                                    {/* Menu - List */}
                                    <div className='menu-list-wrap'>
                                        {BasemenuDrawerList}
                                    </div>

                                </div>
                            </aside>

                            {/* Menu padding */}
                            <div className='cbkApp-Menu-Drawer-Pad-Reduction' />
                        </>
                }
            </>
        );
    }

    private onHandleMenuBar() {
        this.setState({
            handleMenuBar: !this.state.handleMenuBar
        });
    }
}

export default BaseMenuDrawer;
