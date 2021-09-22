import * as React from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { RouteComponentProps } from 'react-router';

import store from '@app/store';
import { push } from 'connected-react-router';

import * as HomeImage1 from '../../../../public/media/home-1.png';
import * as HomeImage2 from '../../../../public/media/home-2.png';

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

                    <div className='HomeInfo-Body-Image'>
                        <img src={HomeImage1} style={{width: '25%', marginRight: '5vw'}}/>
                        <img src={HomeImage2} style={{width: '25%'}}/>
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