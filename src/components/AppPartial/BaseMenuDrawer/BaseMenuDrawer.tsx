import * as React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
            id: 'app-menu.item.layout-Editor',
            defaultName: 'Layout Editor',
            icon: faEdit,
            link: '/layoutEditor'
        },

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

    ];
    constructor(props: BaseMenuDrawerProps & InjectedIntlProps) {
        super(props);
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
                    `/${window.location.pathname.substring(4)}` === '/' ?
                        null
                    :
                    <>
                        <aside className='LayoutEditor-Menu-Drawer'>
                            <div className='LayoutEditor-Menu'>

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
                            <div className='LayoutEditor-Menu-Drawer-Pad' />
                        }

                    </>
                }
            </>
        );
    }
}

export default BaseMenuDrawer;
