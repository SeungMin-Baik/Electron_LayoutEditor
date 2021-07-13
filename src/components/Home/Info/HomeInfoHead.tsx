import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/pro-regular-svg-icons/faList';
import { faFolders } from '@fortawesome/pro-regular-svg-icons/faFolders';
import { faIcons } from '@fortawesome/pro-regular-svg-icons/faIcons';
import { faDesktop } from '@fortawesome/pro-solid-svg-icons/faDesktop';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DevicesOutlinedIcon from '@material-ui/icons/DevicesOutlined';
import PermMediaOutlinedIcon from '@material-ui/icons/PermMediaOutlined';
import EmojiSymbolsOutlinedIcon from '@material-ui/icons/EmojiSymbolsOutlined';

import './HomeInfoHead.scss';

import store from '@app/store';

import { DeviceDatabaseFindAllReq,
        AssetDatabaseFindAllReq,
        PresentationDatabaseFindAllReq,
        PlaylistDatabaseFindAllReq,
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
                to='/device'>
                    <div className='infoText'>
                        <FormattedMessage
                            id='app-HomeInfo.totalDevices'
                            defaultMessage='Total Devices' />
                                <div className='infoData'>
                                    {
                                        this.state.findDeviceData ?
                                            this.state.findDeviceData.length
                                        : 0
                                    }
                                </div>
                    </div>
                    <div className='infoIcon'>
                        <DevicesOutlinedIcon className='infoIcon-info' />
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
        DeviceDatabaseFindAllReq();
        AssetDatabaseFindAllReq();
        PresentationDatabaseFindAllReq();
        PlaylistDatabaseFindAllReq();
    }

    private findData () {
        this.setState({
            findAssetData: store.getState().appAssetData.assetData.data,
            findPresentationData: store.getState().appPresentation.presentationData.data,
        });
    }
}

export default HomeInfoHead;