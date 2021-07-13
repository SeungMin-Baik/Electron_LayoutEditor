import * as React from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import InfoIcon from '@material-ui/icons/Info';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import AirplayRoundedIcon from '@material-ui/icons/AirplayRounded';
import { faDesktop } from '@fortawesome/pro-solid-svg-icons/faDesktop';

import { AppDataList } from '@app/components/AppPartial/DataList';

import {  DeviceDatabaseFindAllReq, DeviceDatabaseDeleteReq } from '@app/utils/renderer/initialize/DatabaseReq';

import { APIList, APIListParams } from '@app/apis';
import isObject from 'lodash-es/isObject';

import config from '@app/config';
import store from '@app/store';

import * as moment from 'moment';

import './HomeInfoBody.scss';

/** States of `DataListTable` component. */
type HomeInfoBodyProps = {
    /** Table head items. */
    head: string[] | JSX.Element[];
    /** Default sort. */
    defaultSort: {
        /** Sort */
        sort: string;
        /** Order */
        order: 'ASC' | 'DESC'
    };
    filter: {
        key: string;
        operator: '=';
        value: string;
    };

    /** Method to fetch data. */
    api: (params: APIListParams) => Promise<APIList<any>>;
    /** On api fetch. */
    onApiFetch?: (data: any[]) => void;
};

/** States of `DataListTable` component. */
type HomeInfoBodyStates = {
    /** Fetched data list result. */
    apiRes: APIList<any>;
    /** Status of api result. */
    apiResStatus: 'LOAD' | 'ERR' | '';
    ImageData: Array<any>;
    findDataInfo: Array<any>;
};

class HomeInfoBody extends React.Component<HomeInfoBodyProps, HomeInfoBodyStates> {
    /** Default data result. */
    private readonly DEFAULT_API_RES: APIList<any> = {
        data: [],
        items: {
            begin: 0,
            end: 0,
            total: 0
        }
    };
    /** Options for per page. */
    private readonly PER_PAGE_OPTIONS = [20, 15, 10];
    constructor(props: HomeInfoBodyProps) {
        super(props);
        this.state = {
            apiRes: this.DEFAULT_API_RES,
            apiResStatus: '',
            ImageData: [],
            findDataInfo: []
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.callApiToFetch();
        this.findData();
    }

    render() {
        return (
            <>
            <div className='cbkApp-HomeInfoBodyTable-Middle'>
                <div className='cbkApp-HomeInfoBodyTable-Devicelist'>
                    <div className='HomeInfoBodyTable-Devicelist-title'>
                        <FormattedMessage
                            id='app-Home.device-list'
                            defaultMessage='Device List'
                        />
                    </div>
                    <div className='HomeInfoBodyTable-Devicelist-TableHead'>
                        <div className='TableHead-Info-Name'>
                            <FormattedMessage
                                id='app-Home.device-list'
                                defaultMessage='Device Name'
                            />
                        </div>
                        <div className='TableHead-Info-Date'>
                            <FormattedMessage
                                id='app-Home.updateDate'
                                defaultMessage='Update date'
                            />
                        </div>
                        <div className='TableHead-Info-Status'>
                            <FormattedMessage
                                id='app-Home.device-state'
                                defaultMessage='State'
                            />
                        </div>
                    </div>
                    <div className='HomeInfoBodyTable-Devicelist-TableData'>
                        {
                            this.state.findDataInfo ?
                            this.state.findDataInfo.length > 0 ?
                                this.state.findDataInfo.map(dev => {
                                    return (
                                    <div className='HomeInfoBodyTable-Devicelist-TableData-Info'>
                                        <div className='TableData-Info-Name'>
                                            <div className='Name-icon'>
                                                <AirplayRoundedIcon />
                                            </div>
                                            <div className='Name-text'>
                                                {dev.FileData.name}
                                            </div>
                                        </div>
                                        <div className='TableData-Info-Date'> {moment(dev.timestamp).format('YYYY-MM-DD. HH:mm')} </div>
                                        <div className='TableData-Info-Status'>
                                            {
                                                dev.FileData.activated === true ?
                                                    <>
                                                        <FiberManualRecordRoundedIcon
                                                            style={{ color: '#00e2a5' }}
                                                        />
                                                    </>
                                                :
                                                    <>
                                                        <FiberManualRecordRoundedIcon
                                                            style={{ color: '#ff3c00' }}
                                                        />
                                                    </>
                                            }
                                        </div>
                                    </div>
                                    );
                                })
                            :
                            <div className='HomeInfoBodyTable-Devicelist-NullData'>
                                <FormattedMessage
                                    id='app-common.noData'
                                    defaultMessage='No Data'
                                />
                            </div>
                            :
                            <div className='HomeInfoBodyTable-Devicelist-NullData'>
                                <FormattedMessage
                                    id='app-common.noData'
                                    defaultMessage='No Data'
                                />
                            </div>
                        }
                    </div>
                </div>

                <div className='cbkApp-HomeInfoBodyTable-Dummy' />

                <div className='cbkApp-HomeInfoBodyTable-Store'>
                    <div className='HomeInfoBodyTable-Store-Title'>
                        <FormattedMessage
                            id='app-menu.item.cublick-store'
                            defaultMessage='Store'
                        />
                    </div>
                    <div className='HomeInfoBodyTable-Store-Grid'>
                        <GridList cols={5} className='gridList'>
                                {
                                    this.state.ImageData.map(ImgData => (
                                        <GridListTile key={ImgData.img}>
                                            <img src={ImgData.img} alt={ImgData.title} className='thumnail'/>
                                                {/* <GridListTileBar
                                                    className='titleBar'
                                                    title={ImgData.title}
                                                    subtitle={<span>by: {ImgData.author}</span>}
                                                    actionIcon={
                                                        <IconButton aria-label={`info about ${ImgData.title}`} className='icon'>
                                                            <InfoIcon />
                                                        </IconButton>
                                                    }
                                                /> */}
                                        </GridListTile>
                                    ))
                                }
                        </GridList>
                    </div>
                </div>
            </div>
        </>
        );
    }


    /**
     * Call provided api to fetch data.
     */
    private callApiToFetch() {
        this.setState({ apiResStatus: 'LOAD' }, () => {
            // Call api with params.
            this.props.api({
                perPage: 4,
                order: this.props.defaultSort.order,
                sort: `-${this.props.defaultSort.sort}`,
                filter: [this.props.filter]
            })
            .then(async apiRes => {
                // Validate api result, and throw error.
                if (
                    !apiRes ||
                    !apiRes.items || !isObject(apiRes.items) ||
                    !apiRes.pages || !isObject(apiRes.pages)
                ) { throw new Error(); }

                // Set api result to state.
                this.setState({
                    apiRes,
                    apiResStatus: ''
                });

                // Call api fatch callback.
                this.props.onApiFetch(apiRes.data);

                let thumData: any = [];

                await apiRes.data.map(async (imgData: any) => {
                    thumData = thumData.concat({
                        img: config.EXTERNAL.CUBLICK.PRESENTATION.THUMBNAIL(imgData.id, store.getState().appAuth.token),
                        title: imgData.name,
                        author: imgData.owner.displayName
                    });

                    this.setState({ ImageData: thumData });
                });
            })
            .catch(() => this.setState({
                apiRes: this.DEFAULT_API_RES,
                apiResStatus: 'ERR'
            }));
        });
    }

    private findData () {
        DeviceDatabaseFindAllReq();
        // setTimeout(() => {
        //     this.setState({
        //         findDataInfo: store.getState().appDevice.deviceList.list
        //     });
        // }, 100);
    }
}

export default HomeInfoBody;
