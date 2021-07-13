import * as React from 'react';
import { apiAsset, AssetAPIResult } from '@app/apis/asset';

import { Switch, Route, RouteComponentProps } from 'react-router';
import ImageDataList from './AssetDataList';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import store from '@app/store';
import { push } from 'connected-react-router';

import AssetTab, { AssetTabName } from './AssetTab';


type AssetProps = {} & RouteComponentProps;

type AssetStates = {
    assets: AssetAPIResult[];
    tab: AssetTabName;
    DataStatus: 'LOAD' | 'ERR' | '';
};

// Asset 부분 routing 및 최상단 부모 컴포넌트
class Asset extends React.Component<AssetProps, AssetStates> {
    private _isMounted: boolean = false;
    constructor(props: AssetProps) {
        super(props);
        this.onAssetFetch = this.onAssetFetch.bind(this);
        this.state = {
            assets: [],
            tab: '',
            DataStatus: 'LOAD'
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        console.log(this.state.assets);
        return (
            <>
                <div>
                    <AssetTab
                        // disabled={!!this.state.DataStatus}
                        change={tab => this.setState({ tab })}
                    />
                </div>

                <div>
                    {this.renderContent(this.state.tab)}
                </div>
            </>
        );
    }

    /**
     * Render tab inside content.
     * @param tab   Current selected tab.
     */

    private renderContent(tab: AssetTabName): JSX.Element {
        // Scroll page to top.
        window.scrollTo(0, 0);

        // Render according page content.
        switch (tab) {
            case 'ASSET':
                return (
                    <ImageDataList
                        head={[]}
                        defaultSort={{
                            sort: 'updateDate',
                            order: 'DESC'
                        }}
                        filters={{
                            key: 'owner',
                            operator: '=',
                            value: 'other'
                        }}
                        api={apiAsset}
                        onApiFetch={this.onAssetFetch}
                        saveSelectMedia={() => ''}
                        isSelect={false}
                        isSend={true}
                        onClick={this.onClick}
                        onDragStart={this.onClick}
                        onDragEnd={this.onClick} />
                );
            default:
                return null;
        }
    }


    private onAssetClick(e: React.SyntheticEvent) {
        const assetId = e.currentTarget.getAttribute('data-assetId');
        if (assetId) {
            store.dispatch(push(`/asset/${assetId}`));
        }
    }

    private onAssetFetch(assets: AssetAPIResult[]) {
        this.setState({ assets });
    }

    private onWidgetClick(e: React.SyntheticEvent) {
        const widgetId = e.currentTarget.getAttribute('data-widgets');
        if (widgetId) {
            store.dispatch(push(`/widget/${widgetId}`));
        }
    }

    private onClick(e: React.SyntheticEvent) {
        console.log(e);
    }
}

export default Asset;