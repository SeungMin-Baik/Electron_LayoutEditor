import * as React from 'react';
import PresentationDataList from './PresentationDataList';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import store from '@app/store';
import { push } from 'connected-react-router';

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
            <div>
                <PresentationDataList
                    filter={{
                        key: 'isSystem',
                        operator: '=',
                        value: 'true'
                    }}
                    saveSelectMedia={() => ''}
                    isSelect={false} />
            </div>
        );
    }

}

export default Presentation;