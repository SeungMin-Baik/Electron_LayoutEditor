import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import './HomeInfoFoot.scss';

type HomeInfoFootStates = {};

class HomeInfoFoot extends React.Component<{}, HomeInfoFootStates> {

    render() {
        return (
            <div className='Adress'>
                <div>  @ Copyright 2021 Seoungmin Baik. All rights Reserved. </div>
                <div> https://github.com/baikseungmin/LayoutEditor_Project.git </div>
            </div>
        );
    }
}

export default HomeInfoFoot;