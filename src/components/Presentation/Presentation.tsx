import * as React from 'react';
import PresentationDataList from './PresentationDataList';

import './Presentation.scss';

type PresentationStates = {
};

class Presentation extends React.Component<{}, PresentationStates> {

    constructor(props: {}) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className='LayoutEditor-Template'>
                <PresentationDataList />
            </div>
        );
    }

}

export default Presentation;