import * as React from 'react';
import { apiPresentation, PresentationAPIResult } from '@app/apis/presentation';
import PresentationDataList from './PresentationDataList';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import store from '@app/store';
import { push } from 'connected-react-router';

type PresentationStates = {
    presentations: PresentationAPIResult[];
};

class Presentation extends React.Component<{}, PresentationStates> {

    constructor(props: {}) {
        super(props);
        this.onPresentationFetch = this.onPresentationFetch.bind(this);
        this.state = {
            presentations: []
        };
    }

    render() {
        return (
            <div>
                <PresentationDataList
                    head={[]}
                    defaultSort={{
                    sort: 'updateDate',
                    order: 'DESC'
                    }}
                    filter={{
                        key: 'isSystem',
                        operator: '=',
                        value: 'true'
                    }}
                    // filter={{
                    //     key: 'owner',
                    //     operator: '=',
                    //     value: 'mine'
                    // }}
                api={apiPresentation}
                onApiFetch={this.onPresentationFetch}
                isSend={true}
                saveSelectMedia={() => ''}
                isSelect={false} />
            </div>
        );
    }


    private onPresentationsClick(e: React.SyntheticEvent) {
        const presentationsId = e.currentTarget.getAttribute('data-presentations');
        if (presentationsId) {
            store.dispatch(push(`/presentations/${presentationsId}`));
        }
    }

    private onPresentationFetch(presentations: PresentationAPIResult[]) {
        this.setState({ presentations });
    }
}

export default Presentation;