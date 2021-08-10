import * as React from 'react';

import { RouteComponentProps } from 'react-router';
import ImageDataList from './AssetDataList';


type AssetProps = {} & RouteComponentProps;

type AssetStates = {
};

// Asset 부분 routing 및 최상단 부모 컴포넌트
class Asset extends React.Component<AssetProps, AssetStates> {
    constructor(props: AssetProps) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <>
                <div>
                    <ImageDataList
                        filters={{
                            key: 'owner',
                            operator: '=',
                            value: 'other'
                        }}
                        saveSelectMedia={() => ''}
                        isSelect={false}
                    />
                </div>
            </>
        );
    }
}

export default Asset;