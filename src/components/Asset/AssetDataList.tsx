import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons/faChevronRight';
import { faTrashAlt } from '@fortawesome/pro-solid-svg-icons/faTrashAlt';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import InfoIcon from '@material-ui/icons/Info';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import isObject from 'lodash-es/isObject';
import { Tooltip } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';

import AssetUploadDialog from './AssetUploadDialog';

import { AssetDatabaseFindAllReq, ServerAssetDataInsertReq, AssetDatabaseDeletetReq } from '@app/utils/renderer/initialize/DatabaseReq';
import { writeMediaAsFile } from '@app/utils/renderer/fileManager/writeFile';
import { getThumbnailtReq } from '@app/utils/renderer/initialize/getThumbnailReq';
import electronConfig from '@app/config/electron-config';

import { APIList, APIListParams } from '@app/apis';
import { getAsset } from '@app/apis/asset';

import Confirm from '@app/components/AppPartial/Confirm';

import * as imageLoad from '../../../public/media/image-loading.png';

import config from '@app/config';
import store from '@app/store';
import * as fs from 'fs';

import './AssetDataList.scss';
import * as INPUTSOURCE from '../../../public/media/inputcamera.png';

/** States of `DataListTable` component. */
type AssetDataListProps = {
    /** Table head items. */
    head: string[] | JSX.Element[];
    /** Default sort. */
    defaultSort: {
        /** Sort */
        sort: string;
        /** Order */
        order: 'ASC' | 'DESC'
    };
    filters?: {
        key: string;
        operator: '=';
        value: string;
    };
    /** Method to fetch data. */
    api: (params: APIListParams) => Promise<APIList<any>>;
    /** On api fetch. */
    onApiFetch?: (data: any[]) => void;
    saveSelectMedia: Function;
    isEditor?: boolean;
    isSend: boolean;
    isSelect: boolean;
    onClick?: Function;
    onDragStart?: Function;
    onDragEnd?: Function;
} & InjectedIntlProps;

/** States of `DataListTable` component. */
type AssetDataListStates = {
    /** Page number to fetch data. */
    apiListPage: number;
    /** Data counts to fetch per page. */
    apiListPerPage: number;
    /** Fetched data list result. */
    apiRes: APIList<any>;
    /** Status of api result. */
    apiResStatus: 'LOAD' | 'ERR' | '';
    ImageData: Array<any>;
    isVisible: boolean;
    setTab: any;
    findClientData: any;
    findThumbnails: Array<any>;
    selectedImg: string;
    openDelConfirm: boolean;
    openDownConfirm: boolean;
};

// Asset의 이미지, 동영상 등의 Grid List를 출력해주는 컴포넌트
class AssetDataList extends React.Component<AssetDataListProps, AssetDataListStates> {
    /** Default data result. */
    private readonly DEFAULT_API_RES: APIList<any> = {
        data: [],
        pages: {
            current: 0,
            hasNext: false,
            hasPrev: false,
            next: 0,
            prev: 0,
            total: 0
        },
        items: {
            begin: 0,
            end: 0,
            total: 0
        }
    };
    /** Options for per page. */
    private readonly PER_PAGE_OPTIONS = [20, 15, 10];
    private waitConfirmData: any = '';
    constructor(props: AssetDataListProps) {
        super(props);
        this.onPageChange = this.onPageChange.bind(this);
        this.onPerPageChange = this.onPerPageChange.bind(this);
        this.ClickServerImg = this.ClickServerImg.bind(this);
        this.ClickClientImg = this.ClickClientImg.bind(this);
        this.onDialog = this.onDialog.bind(this);
        this.handleChangeTab = this.handleChangeTab.bind(this);
        this.findData = this.findData.bind(this);
        this.findThumbnail = this.findThumbnail.bind(this);
        this.state = {
            apiListPage: 1,
            apiListPerPage: 20,
            apiRes: this.DEFAULT_API_RES,
            apiResStatus: '',
            ImageData: [],
            isVisible: false,
            setTab: 0,
            findClientData: [],
            findThumbnails: [],
            selectedImg: '',
            openDelConfirm: false,
            openDownConfirm: false
        };
    }

    componentWillMount() {
        this.getParamsFromUrl();
    }

    componentDidMount() {
        this.findData();
        this.findThumbnail();
        if (this.props.isEditor) {
            if (this.props.filters.value !== 'FRAME') {
                this.setState({
                    setTab: 0
                });
            } else {
                this.callApiToFetch(true);
                this.setState({
                    setTab: 1
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isEditor) {
            if (this.props.filters.value !== prevProps.filters.value && this.props.filters.value !== 'FRAME') {
                this.findData();
                this.findThumbnail();
                this.setState({
                    setTab: 0
                });
            }
            if (this.props.filters.value !== prevProps.filters.value && this.props.filters.value === 'FRAME') {
                this.callApiToFetch(true);
                this.setState({
                    setTab: 1
                });
            }
        }
    }

    render() {
        /** Messages for table body. */
        const tBodyMsg = (
            this.state.apiResStatus === 'ERR' ?
                // On error
                <>
                    <FormattedMessage
                        id='app-partial.datalist.msg-error'
                        defaultMessage='Error'
                    />
                </>
                :
                this.state.apiResStatus === 'LOAD' ?
                    // On loading
                    <>
                        {/* <FormattedMessage
                            id='app-partial.datalist.msg-load'
                            defaultMessage='Loading'
                        /> */}
                        <CircularProgress color='secondary' />
                    </>
                    :
                    !this.state.apiRes.data.length ?
                        // Empty data
                        <>
                            <FormattedMessage
                                id='app-partial.datalist.msg-empty'
                                defaultMessage='Empty data'
                            />
                        </>
                        :
                        null
        );

        /** Table footer. */
        const tfoot = (
            <div className='pagination'>

                {/* Pagination : Per-page */}
                {/* <div className='pagination-perpage'>
                    <FormattedMessage
                        id='app-partial.datalist.perPage'
                        defaultMessage='Items per page'
                    />
                    <span>:</span>
                    <Select
                        className='perpage-select'
                        value={this.state.apiListPerPage}
                        onChange={this.onPerPageChange}
                    >
                        {this.PER_PAGE_OPTIONS.map(pp =>
                            <MenuItem key={pp} value={pp}>
                                {pp}
                            </MenuItem>
                        )}
                    </Select>
                </div> */}
                {
                    !this.props.isEditor ?
                        <div className='pagination-perpage'>
                            <FormattedMessage
                                id='app-partial.datalist.perPage'
                                defaultMessage='Items per page'
                            />
                            <span>:</span>
                            <Select
                                className='perpage-select'
                                value={this.state.apiListPerPage}
                                onChange={this.onPerPageChange}
                            >
                                {this.PER_PAGE_OPTIONS.map(pp =>
                                    <MenuItem key={pp} value={pp}>
                                        {pp}
                                    </MenuItem>
                                )}
                            </Select>
                        </div>
                        : null
                }

                {/* Pagination : Item range */}
                {
                    this.props.isEditor && this.props.filters.value === 'FRAME' ?
                        null
                    :
                        <div className='pagination-range'>
                            <span>
                                {this.state.apiRes.items.begin}
                                &nbsp;-&nbsp;
                                {this.state.apiRes.items.end}
                            </span>
                            <FormattedMessage
                                id='app-partial.datalist.of'
                                defaultMessage='of'
                            />
                            <span>{this.state.apiRes.items.total}</span>
                        </div>
                }

                {/* Pagination : Button */}
                <div className='pagination-button'>
                    <IconButton onClick={e => this.onPageChange(
                        e, this.state.apiRes.pages.prev
                    )}
                        disabled={!this.state.apiRes.pages.hasPrev}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </IconButton>
                    <IconButton onClick={e => this.onPageChange(
                        e, this.state.apiRes.pages.next
                    )}
                        disabled={!this.state.apiRes.pages.hasNext}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </IconButton>
                </div>
            </div>
        );
        const { formatMessage } = this.props.intl;
        return (
            <>
                {
                    this.state.openDelConfirm ?
                        <Confirm isOpen={this.handleDelConfirm} type='DELETE' />
                    : null
                }
                {
                    this.state.openDownConfirm ?
                        <Confirm isOpen={this.handleDownConfirm} type='DOWNLOAD' />
                    : null
                }
                {
                    this.state.isVisible ?
                        <AssetUploadDialog
                            title={
                                formatMessage({
                                    id: 'app-asset.upload',
                                    defaultMessage: 'Asset Upload'
                                })
                            }
                            closeDialog={this.onDialog}
                        />
                        : null
                }
                {
                    this.props.isEditor ?
                        null
                    :
                    <div className='cbkapp-common-changeAsset-Tap'>
                        <Tabs
                            value={this.state.setTab}
                            indicatorColor='primary'
                            textColor='primary'
                            onChange={this.handleChangeTab}
                            aria-label='Choose asset List'
                        >
                            <Tab className='Tab-Info' label='Client' />
                            {
                                !this.props.isSelect ?
                                    <Tab className='Tab-Info' label='Free Image' disabled/>
                                : null
                            }
                            {/* {
                                !this.props.isSelect ?
                                    <Tab className='Tab-Info' label='Figure'/>
                                : null
                            } */}
                        </Tabs>
                    </div>
                }


                {

                    this.state.setTab === 1 ?
                        <div className={this.props.isEditor ? 'cbkApp-ImageDataListTable-editor' : 'cbkApp-ImageDataListTable'}>

                            <GridList cols={this.props.isEditor ? 4 : 6} className={'gridList'}>
                                {
                                    this.state.ImageData.map(ServerData => (
                                            <GridListTile key={ServerData.img}
                                                draggable='true'
                                                onDragStart={(e) => this.props.onDragStart(e, ServerData)}
                                                onDragEnd={(e) => this.props.onDragEnd(e, ServerData)}>
                                                <div className='Thumbnail-Server'>
                                                    <img
                                                        data-all={JSON.stringify({
                                                            id: ServerData.id,
                                                            mimeType: ServerData.mimeType,
                                                            name: ServerData.name,
                                                            width: ServerData.width,
                                                            height: ServerData.height,
                                                            md5: ServerData.md5,
                                                            fileType: ServerData.fileType,
                                                            srcLink: ServerData.srcLink,
                                                            type: ServerData.type,
                                                            code: ServerData.code,
                                                            colorLabel: ServerData.colorLabel
                                                        })}
                                                        className='imageInfo'
                                                        src={ServerData.img} alt={ServerData.title}
                                                        onClick={e => {
                                                            this.props.isEditor && this.props.filters.value === 'FRAME' ?
                                                                null
                                                            :
                                                                this.handleDownConfirm(true, 'INIT', e);
                                                        }}
                                                    />
                                                </div>

                                            {
                                                this.props.isEditor && this.props.filters.value === 'FRAME' ?
                                                    null
                                                :
                                                    <GridListTileBar
                                                        title={ServerData.title}
                                                        subtitle={<span>by: Server </span>}
                                                        actionIcon={
                                                            <IconButton aria-label={`info about ${ServerData.title}`} className='icon'>
                                                                <InfoIcon />
                                                            </IconButton>
                                                        }
                                                    />
                                            }
                                            </GridListTile>
                                    ))
                                }
                            </GridList>



                            <div className='overlay-msg'
                                style={{
                                    opacity: this.state.apiResStatus ||
                                        this.state.apiRes.data && !this.state.apiRes.data.length ?
                                        1 : 0
                                }}
                            >
                                <div>{tBodyMsg}</div>
                            </div>

                            {/* if empty data. */}
                            {
                                !this.state.apiRes.data.length ?
                                    <div className='overlay-msg-dummy'></div>
                                    :
                                    null
                            }
                            {tfoot}
                        </div>
                        :
                        <>
                            {
                                !this.props.isEditor ?
                                    <div className='cbkApp-upload-button'>
                                        <Button variant='outlined' size='large' onClick={e => this.onDialog(true)}>
                                            <FormattedMessage
                                                id='app-asset-upload'
                                                defaultMessage='UPLOAD'
                                            />
                                        </Button>
                                    </div>
                                : null
                            }
                            <div className={this.props.isEditor ? 'cbkApp-ImageDataListTable-editor' : 'cbkApp-ImageDataListTable'}>
                                <GridList cols={this.props.isEditor ? 4 : 6} className='gridList'>

                                    {
                                        this.props.isEditor && this.props.filters.value === 'INPUT_SOURCE' ?

                                        <>
                                            <Tooltip title={'열화상 카메라'} placement='top'>
                                                <GridListTile
                                                    onDragStart={(e) => this.props.onDragStart(e, 'Input')}
                                                    onDragEnd={(e) => this.props.onDragEnd(e)}>
                                                    <img src={INPUTSOURCE} />
                                                </GridListTile>
                                            </Tooltip>
                                        </>

                                        :

                                        this.state.findClientData.length > 0 ?
                                        this.state.findClientData.map(ClientData => (
                                            <Tooltip title={ClientData.FileData.name} placement='top' disableHoverListener={this.props.isEditor ? false : true}>
                                                <GridListTile
                                                    key={ClientData._id}
                                                    draggable='true'
                                                    onDragStart={(e) => this.props.onDragStart(e, ClientData)}
                                                    onDragEnd={(e) => this.props.onDragEnd(e, ClientData)}
                                                >
                                                    {
                                                        this.props.isSend ?
                                                            <div className='actionSection'>
                                                                <div className='deleteButton' onClick={() => this.handleDelConfirm(true, 'INIT', ClientData._id)}>
                                                                    <Fab variant='round' size='small' className='deleteButton-fab'>
                                                                        <FontAwesomeIcon className='deleteButton-info' icon={faTrashAlt} />
                                                                    </Fab>
                                                                </div>
                                                            </div>
                                                            : null
                                                    }
                                                    <div className='Thumbnail-Client'>
                                                        <img
                                                            data-all={JSON.stringify({
                                                                id: ClientData._id,
                                                                mimeType: ClientData.FileData.mimeType,
                                                                name: ClientData.FileData.name,
                                                                md5: ClientData.FileData.md5,
                                                                fileType: ClientData.FileData.fileType,
                                                                srcLink: ClientData.FileData.srcLink,
                                                                width: ClientData.FileData.width,
                                                                height: ClientData.FileData.height,
                                                                code: 0,
                                                                colorLabel: '#3dda44',
                                                                type: 'ASSET',
                                                            })}
                                                            className='imageInfo'
                                                            src={
                                                                this.state.findThumbnails.indexOf(ClientData._id + '_thumb.png') === - 1 ?
                                                                imageLoad :
                                                                electronConfig.APP.DIR_PATH.THUMBNAIL_PATH + '/' + this.state.findThumbnails.filter(x => x === (ClientData._id + '_thumb.png'))
                                                            } alt={ClientData.FileData.name} onClick={this.ClickClientImg} />
                                                    </div>
                                                    {
                                                        !this.props.isEditor ?
                                                            <GridListTileBar
                                                                className={this.state.selectedImg === ClientData._id ? 'selected' : ''}
                                                                title={ClientData.FileData.name}
                                                                subtitle={<span>by: Client </span>}
                                                                actionIcon={
                                                                    <IconButton aria-label={`info about ${ClientData.FileData.name}`} className='icon'>
                                                                        <InfoIcon />
                                                                    </IconButton>
                                                                }
                                                            />
                                                        : null
                                                    }

                                                </GridListTile>
                                            </Tooltip>
                                        ))
                                        :
                                            <div className='ImageDataListTable-nullData'>
                                                <FormattedMessage
                                                    id='app-common.noData'
                                                    defaultMessage='No Data'
                                                />
                                            </div>
                                    }
                                </GridList>
                            </div>
                        </>
                }
            </>
        );
    }

    private handleDownConfirm = (open: any, download: any, e?: React.SyntheticEvent) => {
        if (download === 'INIT') {
            const data = JSON.parse((e.target as any).dataset.all);
            this.waitConfirmData = data;
        } else if (download === true) {
            this.ClickServerImg();
        }
        this.setState({
                openDownConfirm: open
        });
    }

    private ClickServerImg() {
        if (!this.props.isSelect) {
            getAsset(this.waitConfirmData.id)
                // .then(res => console.log(res))
                .then(res => { ServerAssetDataInsertReq(res), writeMediaAsFile('ASSET', res); })
                .then(() => { this.findThumbnail(); this.findData(); })
                .catch((err: Error) => {
                    console.log('write Asset err');
                });
        }
    }

    private ClickClientImg(e: React.SyntheticEvent) {
        const Clientdata = JSON.parse((e.target as any).dataset.all);
        console.log(Clientdata);
        if (this.props.isSelect === true) {
            this.setState({ selectedImg: Clientdata.id });
        }

        this.props.saveSelectMedia(Clientdata);
    }

    /**
     * Call provided api to fetch data.
     */
    private callApiToFetch(isFigure?: boolean) {
        this.attachParamsAtUrl();
        this.setState({ apiResStatus: 'LOAD' }, () => {
            // Call api with params.
            this.props.api({
                page: this.state.apiListPage || 1,
                perPage: this.state.apiListPerPage || 20,
                order: this.props.defaultSort.order,
                sort: `-${this.props.defaultSort.sort}`,
                filter: isFigure ? [{ key: 'mimeType', operator: '=', value: 'FRAME' }] : this.props.filters ? [this.props.filters] : null
            })
                .then(async apiRes => {
                    console.log(apiRes);
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
                    // this.props.onApiFetch(apiRes.data);
                    this.props.onApiFetch ? this.props.onApiFetch(apiRes.data) : null;
                    let imageData: any = [];

                    await apiRes.data.map(async (imgData: any) => {
                        imageData = imageData.concat({
                            img: config.EXTERNAL.CUBLICK.ASSET.THUMBNAIL(imgData.id, store.getState().appAuth.token),
                            title: imgData.name,
                            author: imgData.owner.displayName,
                            id: imgData.id,
                            mimeType: imgData.mimeType,
                            name: imgData.name,
                            width: imgData.width,
                            height: imgData.height,
                            md5: imgData.md5,
                            fileType: imgData.fileType,
                            type: 'asset',
                            code: 0,
                            colorLabel: '#3dda44'
                        });
                        this.setState({ ImageData: imageData });
                    });
                })
                .catch(() => this.setState({
                    apiRes: this.DEFAULT_API_RES,
                    apiResStatus: 'ERR'
                }));
        });
    }


    /**
     * On page change.
     * @param e     Page change event.
     * @param page  Page number to change.
     */
    private onPageChange(e: React.SyntheticEvent, page: number) {
        this.setState(
            { apiListPage: page },
            this.callApiToFetch
        );
    }


    /**
     * On per-page change.
     * @param e Per-page change event.
     */
    private onPerPageChange(e: React.SyntheticEvent) {
        this.setState(
            { apiListPerPage: (e.target as any).value },
            this.callApiToFetch
        );
    }


    /**
     * Attach list parameter to URL.
     */
    private attachParamsAtUrl() {
        // Create URL search parameter.
        const searchParams = new URLSearchParams();
        searchParams.set('p', `${this.state.apiListPage}`);
        searchParams.set('pr', `${this.state.apiListPerPage}`);

        // Replace URL history state with param url.
        const url = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.replaceState(null, '', url);
    }


    /**
     * Get list parameter from URL.
     */
    private getParamsFromUrl() {
        // Get search parameter.
        const searchParams = new URLSearchParams(window.location.search);

        // Set list params.
        this.setState({
            apiListPage:
                !isNaN(+searchParams.get('p')) && +searchParams.get('p') > 0 ?
                    +searchParams.get('p') : 1,
            apiListPerPage:
                !isNaN(+ searchParams.get('pr')) && +searchParams.get('pr') > 0 ?
                    +searchParams.get('pr') : 20
        });
    }

    private onDialog(isVisible: boolean, refresh?: boolean) {
        if (refresh) {
            this.findData();
            this.findThumbnail();
        }
        this.setState({ isVisible });
    }

    private handleChangeTab(e: React.ChangeEvent, newValue: any) {
        if (newValue === 1) {
            this.callApiToFetch();
        } else if (newValue === 0) {
            this.findData();
            this.findThumbnail();
        } else if (newValue === 2) {
            this.callApiToFetch(true);
        }
        this.setState({
            setTab: newValue
        });
    }

    private findData() {
        AssetDatabaseFindAllReq();
        setTimeout(() => {
            const clientData = [];
            if (this.props.isEditor) {
                store.getState().appAssetData.assetData.data.map((data) => {
                    if (data.FileData.mimeType === this.props.filters.value) {
                        clientData.push(data);
                    }
                });
                this.setState({
                    findClientData: clientData,
                });
            }
            else {
                this.setState({
                    findClientData: store.getState().appAssetData.assetData.data
                });
            }
        }, 100);
    }

    private findThumbnail() {
        let thumbfiles = [];
        try {
            thumbfiles = fs.readdirSync(electronConfig.APP.DIR_PATH.THUMBNAIL_PATH);
        } catch (err) {
            console.error(err);
        }
        setTimeout(() => {
            this.setState({
                findThumbnails: thumbfiles
            });
        }, 100);
    }

    private handleDelConfirm = (open: any, del: any, assetId: any) => {
        if (del === 'INIT') {
            this.waitConfirmData = assetId;
        } else if (del === true) {
            this.deleteAssetMessage();
        }
        this.setState({
            openDelConfirm: open
        });
    }

    private deleteAssetMessage() {
        AssetDatabaseDeletetReq(this.waitConfirmData);
        setTimeout(() => {
            this.setState({
                findClientData: this.state.findClientData.filter(x => x._id !== this.waitConfirmData)
            });
        }, 100);
    }
}

export default injectIntl(AssetDataList);
