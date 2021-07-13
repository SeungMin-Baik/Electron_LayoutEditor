import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import './HomeInfoFoot.scss';

type HomeInfoFootStates = {};

class HomeInfoFoot extends React.Component<{}, HomeInfoFootStates> {

    render() {
        return (
            <div className='Adress'>
                @ Copyright 2021 Seoungmin Baik. All rights Reserved.
            </div>
        );
    }
}

export default HomeInfoFoot;