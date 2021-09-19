import * as React from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { RouteComponentProps } from 'react-router';

import store from '@app/store';
import { push } from 'connected-react-router';

import * as Editor from '../../../../public/media/editor.png';

import './HomeInfo.scss';

type HomeInfoProps = {} & RouteComponentProps;

type HomeInfotStates = {
};

class HomeInfo extends React.Component<HomeInfoProps, HomeInfotStates> {

    constructor(props: HomeInfoProps) {
        super(props);
        this.state = {
        };
    }

    render() {

        return (
        <>
            <div className='LayoutEditor-HomeInfo'>
                <div className='LayoutEditor-HomeInfo-Body'>
                    <div className='HomeInfo-Body-Title'>
                        <FormattedMessage
                            id='app-home-body.title'
                            values={{br: <br/>}}
                        />
                    </div>

                    <div className='HomeInfo-Body-Button'>
                        <button className='Button-Info' onClick={this.LinkToEditor}>
                        <FormattedMessage
                            id='app-home-body.startButton'
                            defaultMessage='Start'
                        />
                        </button>
                    </div>
                </div>
            </div>
        </>
        );
    }

    private LinkToEditor = () => {
        store.dispatch(push(`/layoutEditor`));
    }
}

export default HomeInfo;