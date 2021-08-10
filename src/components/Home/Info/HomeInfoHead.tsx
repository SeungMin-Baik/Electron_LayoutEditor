import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import PermMediaOutlinedIcon from '@material-ui/icons/PermMediaOutlined';
import EmojiSymbolsOutlinedIcon from '@material-ui/icons/EmojiSymbolsOutlined';
import { faEdit } from '@fortawesome/pro-regular-svg-icons/faEdit';

import './HomeInfoHead.scss';

import store from '@app/store';

import {
    AssetDatabaseFindAllReq,
    PresentationDatabaseFindAllReq,
} from '@app/utils/renderer/initialize/DatabaseReq';


type HomeInfoHeadProps = {};

type HomeInfoHeadStates = {
    findDeviceData: Array<any>;
    findAssetData: Array<any>;
    findPresentationData: Array<any>;
    findPlaylistData: Array<any>;
    language: any
};

class HomeInfoHead extends React.Component<HomeInfoHeadProps, HomeInfoHeadStates> {
    constructor(props: HomeInfoHeadProps) {
        super(props);
        this.findData = this.findData.bind(this);
        this.findDataInDb = this.findDataInDb.bind(this);
        this.state = {
            findDeviceData: [],
            findAssetData: [],
            findPresentationData: [],
            findPlaylistData: [],
            language: ''
        };
    }

    componentWillMount() {
        this.findDataInDb();
    }

    componentDidMount() {
        setTimeout(() => {
            this.findData();
        }, 2000);
    }

    render() {
        return (
    <>
        <div className='homeInfoHead'>

            <Link
                className='infoItem'
                to='/LayoutEditor'>
                    <div className='infoText'>
                        <FormattedMessage
                            id='app-HomeInfo.layoutEditor'
                            defaultMessage='Link to LayoutEditor'
                        />
                    </div>
                    <div className='infoIcon'>
                        <FontAwesomeIcon className='infoIcon-info' icon={faEdit} />
                    </div>
            </Link>

            <Link
                className='infoItem'
                to='/asset'>
                    <div className='infoText'>
                        <FormattedMessage
                            id='app-HomeInfo.asset'
                            defaultMessage='Asset' />
                                <div className='infoData'>
                                    {
                                        this.state.findAssetData ?
                                            this.state.findAssetData.length
                                        : 0
                                    }
                                </div>
                    </div>
                    <div className='infoIcon'>
                        <PermMediaOutlinedIcon className='infoIcon-info' />
                    </div>
            </Link>

            <Link
                className='infoItem'
                to='/presentation'>
                    <div className='infoText'>
                        <FormattedMessage
                            id='app-HomeInfo.pesentation'
                            defaultMessage='Template' />
                                <div className='infoData'>
                                    {
                                        this.state.findPresentationData ?
                                            this.state.findPresentationData.length
                                        : 0
                                    }
                                </div>
                    </div>
                    <div className='infoIcon'>
                        <EmojiSymbolsOutlinedIcon className='infoIcon-info' />
                    </div>
            </Link>

        </div>
    </>
        );
    }

    private findDataInDb () {
        AssetDatabaseFindAllReq();
        PresentationDatabaseFindAllReq();
    }

    private findData () {
        this.setState({
            findAssetData: store.getState().appAssetData.assetData.data,
            findPresentationData: store.getState().appPresentation.presentationData.data,
        });
    }
}

export default HomeInfoHead;