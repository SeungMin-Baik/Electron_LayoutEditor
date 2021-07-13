import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// Stylesheets
import './AssetTab.scss';

/** Device detail tab. */
export type AssetTabName = '' | 'ASSET' | 'WIDGET';

/** Props of `DeviceDetailTab` component. */
type AssetTabProps = {
    /** Is tabs need to disabled? */

    // disabled: boolean;

    /** On device tab change. */
    change: (tab: AssetTabName) => void;
} & InjectedIntlProps;

/** States of `DeviceDetailTab` component. */
type AssetTabStates = {
    /** Tab index. */
    tabIndex: number;
};

// Asset의 Tab에 대한 Tab 정의 컴포넌트
class AssetsTab extends React.Component<AssetTabProps, AssetTabStates> {
    constructor(props: AssetTabProps) {
        super(props);
        this.onTabChanged = this.onTabChanged.bind(this);
        this.state = {
            tabIndex: -1
        };
    }

    componentDidMount() {
        this.setState({ tabIndex: 0 }, () => {
            this.onTabChanged(null, 0);
        });
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            this.state.tabIndex >= 0 ?
                <div className='cbkApp-Asset-tab'>
                    <Tabs
                        value={this.state.tabIndex}
                        onChange={this.onTabChanged}
                        indicatorColor='primary'
                        textColor='primary'
                        variant='fullWidth'
                        action={
                            () => setTimeout(() => {
                                // Force emit window resize event after tab mounted,
                                // to update indicator position and size.
                                // Seems to bug of React-Mui.
                                // ref: https://github.com/mui-org/material-ui/issues/9337
                                window.dispatchEvent(new CustomEvent('resize'));
                            }, 0)
                        }
                    >
                        <Tab className='Detail-Set'
                            label={
                                formatMessage({
                                    id: 'app-asset.tab.asset',
                                    defaultMessage: 'Asset'
                                })
                            }
                            // disabled={this.props.disabled}
                        />

                        {/* <Tab className='Detail-Set'
                            label={
                                formatMessage({
                                    id: 'app-asset.tab.widget',
                                    defaultMessage: 'Widget'
                                })
                            }
                        /> */}
                    </Tabs>
                </div>
            :
                null
        );
    }


    /**
     * On tab selection changed.
     */
    private onTabChanged(e: React.SyntheticEvent, tabIndex: number) {
        let cmd: AssetTabName = '';
        switch (tabIndex) {
            case 0:  cmd = 'ASSET'; break;
            case 1:  cmd = 'WIDGET'; break;
            default: cmd = ''; break;
        }

        this.props.change(cmd);
        this.setState({ tabIndex });
    }
}

export default injectIntl(AssetsTab);
