import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons/faChevronRight';
import { faTrashAlt } from '@fortawesome/pro-solid-svg-icons/faTrashAlt';
import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import InfoIcon from '@material-ui/icons/Info';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import isObject from 'lodash-es/isObject';

import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';

import { APIList, APIListParams } from '@app/apis';
import { getPresentationDesign } from '@app/apis/presentation/presentationApi';
import { PresentationDatabaseFindAllReq, ServerPresentationDataInsertReq, PresentationDatabaseDeletetReq } from '@app/utils/renderer/initialize/DatabaseReq';
import { writeAssetAsThumbnail, writePresentationAsThumbnail } from '@app/utils/renderer/fileManager/writeFile';
import { writeMediaAsFile } from '@app/utils/renderer/fileManager/writeFile';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import CircularProgress from '@material-ui/core/CircularProgress';

import Confirm from '@app/components/AppPartial/Confirm';

import * as fs from 'fs';
import config from '@app/config';
import electronConfig from '@app/config/electron-config';
import store from '@app/store';

import * as imageLoad from '../../../public/media/image-loading.png';

import PresentationPreviewDialog from './Dialog/PresentationPreviewDialog';


import './PresentationDataList.scss';
import { timeStamp } from 'console';

/** States of `DataListTable` component. */
type PresentationDataListProps = {
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
    isSend: boolean;
    saveSelectMedia?: Function;
    isSelect?: boolean;
    isEditor?: boolean;
    onClick?: Function;
    onDragStart?: Function;
    onDragEnd?: Function;
} & InjectedIntlProps;

/** States of `DataListTable` component. */
type PresentationDataListStates = {
    /** Page number to fetch data. */
    apiListPage: number;
    /** Data counts to fetch per page. */
    apiListPerPage: number;
    /** Fetched data list result. */
    apiRes: APIList<any>;
    /** Status of api result. */
    apiResStatus: 'LOAD' | 'ERR' | '';
    ImageData: Array<any>;
    setTab: any;
    isPreviewVisible: boolean;
    findClientData: any;
    findThumbnails: Array<any>;
    selectedPrstnId: string;
    selectedPrstnlayoutInfo: Array<any>;
    selectedImg: string;
    openDelConfirm: boolean;
    openDownConfirm: boolean;
    prstId: string;
};

// 프레젠테이션들을 표출해주는 grid list 컴포넌트
class PresentationDataList extends React.Component<PresentationDataListProps, PresentationDataListStates> {
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
    private waitConfirmData: any = {};
    constructor(props: PresentationDataListProps) {
        super(props);
        this.onPageChange = this.onPageChange.bind(this);
        this.onPerPageChange = this.onPerPageChange.bind(this);
        this.ClickServerImg = this.ClickServerImg.bind(this);
        this.handleChangeTab = this.handleChangeTab.bind(this);
        this.findData = this.findData.bind(this);
        this.findThumbnail = this.findThumbnail.bind(this);
        this.ClickClientImg = this.ClickClientImg.bind(this);
        this.deletePresentationMessage = this.deletePresentationMessage.bind(this);
        this.handleDelConfirm = this.handleDelConfirm.bind(this);
        this.state = {
            apiListPage: 1,
            apiListPerPage: 20,
            apiRes: this.DEFAULT_API_RES,
            apiResStatus: '',
            ImageData: [],
            setTab: 0,
            isPreviewVisible: false,
            findClientData: [],
            findThumbnails: [],
            selectedPrstnId: null,
            selectedPrstnlayoutInfo: null,
            selectedImg: '',
            openDelConfirm: false,
            openDownConfirm: false,
            prstId: ''
        };
    }

    componentWillMount() {
        this.getParamsFromUrl();
    }

    componentDidMount() {
        this.findData();
        this.findThumbnail();
    }

    componentDidUpdate(prev) {
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
                        <CircularProgress color='secondary' />
                        {/* <FormattedMessage
                            id='app-partial.datalist.msg-load'
                            defaultMessage='Loading'
                        /> */}
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

                {/* Pagination : Item range */}
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

        const tab = (
            <div className='cbkapp-common-changePresentation-Tap'>
                <Tabs
                    value={this.state.setTab}
                    indicatorColor='primary'
                    textColor='primary'
                    onChange={this.handleChangeTab}
                    aria-label='Choose asset List'
                >
                    <Tab className='Tab-Info' label='Client'/>
                    {
                        !this.props.isSelect ?
                            <Tab className='Tab-Info' label='Store' disabled />
                        : null
                    }
                </Tabs>
            </div>
        );


        const tbody = (

            this.state.setTab === 1 ?
                <div className='cbkApp-PresentationDataListTable'>
                    <GridList cols={6} className='gridList'>

                        {
                            this.state.ImageData.map(ServerData => (
                                <GridListTile key={ServerData.img}>
                                    <div className='Thumbnail-Server'>
                                        <img
                                            data-all={JSON.stringify({
                                                id: ServerData.id,
                                                mimeType: ServerData.mimeType,
                                                name: ServerData.name,
                                                md5: ServerData.md5,
                                                fileType: ServerData.fileType,
                                                srcLink: ServerData.srcLink,
                                                type: ServerData.type,
                                                code: ServerData.code,
                                                colorLabel: ServerData.colorLabel,
                                            })}
                                            className='imageInfo'
                                            src={ServerData.img} alt={ServerData.title} onClick={e => this.handleDownConfirm(true, 'INIT', e)} />
                                    </div>
                                    <GridListTileBar
                                        title={ServerData.title}
                                        subtitle={<span>by: Server</span>}
                                        actionIcon={
                                            <IconButton aria-label={`info about ${ServerData.title}`} className='icon'>
                                                <InfoIcon />
                                            </IconButton>
                                        }
                                    />
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

                <div className={this.props.isEditor ? 'cbkApp-PresentationDataListTable-editor' : 'cbkApp-PresentationDataListTable'}>
                    <GridList cols={6} className='gridList'>
                        {
                            this.state.findClientData.length > 0 ?
                            this.state.findClientData.map(ClientData => (
                                <GridListTile
                                    key={ClientData._id}
                                    onDragStart={this.props.isEditor ? (e) => this.props.onDragStart(e, ClientData) : null}
                                    onDragEnd={this.props.isEditor ? (e) => this.props.onDragEnd(e, ClientData) : null }
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
                                                mimeType: '',
                                                name: ClientData.FileData.name,
                                                md5: '',
                                                fileType: '',
                                                srcLink: '',
                                                isLocal: ClientData.FileData.isLocal,
                                                code: 1,
                                                colorLabel: '#0a84d2',
                                                type: 'PRESENTATION'
                                            })}
                                            className='imageInfo'
                                            src={
                                                this.state.findThumbnails.indexOf(ClientData._id + '_thumb.png') === - 1 ?
                                                imageLoad :
                                                electronConfig.APP.DIR_PATH.THUMBNAIL_PATH + '/' + this.state.findThumbnails.filter(x => x === (ClientData._id + '_thumb.png'))
                                            }
                                            alt={ClientData.FileData.name}
                                            onClick={e => this.ClickClientImg(e, ClientData._id)}
                                        />
                                    </div>
                                    {
                                        !this.props.isEditor ?
                                            <GridListTileBar
                                                className={this.state.selectedImg === ClientData._id ? 'selected' : ''}
                                                title={ClientData.FileData.name}
                                                subtitle={<span>by: Client</span>}
                                                actionIcon={
                                                    <IconButton aria-label={`info about ${ClientData.FileData.name}`} className='icon'>
                                                        <InfoIcon />
                                                    </IconButton>
                                                }
                                            />
                                        : null
                                    }

                                </GridListTile>
                            ))
                            :
                                <div className='PresentationDataListTable-nullData'>
                                    <FormattedMessage
                                        id='app-common.noData'
                                        defaultMessage='No Data'
                                    />
                                </div>
                        }
                    </GridList>

                </div>


        );


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
                this.state.isPreviewVisible ?
                    <PresentationPreviewDialog title='Preview' closeDialog={this.closePreviewDialog} prstId={this.state.prstId} />
                : null
            }
                {
                    this.props.isEditor ?
                        null
                    : this.props.isSelect ?
                        null
                    : tab
                }
                {tbody}
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
            getPresentationDesign(this.waitConfirmData.id)
                // .then(res => console.log(res))
                .then(res => {
                    ServerPresentationDataInsertReq(res),
                    writeMediaAsFile('PRESENTATION', res),
                    writePresentationAsThumbnail(this.waitConfirmData.id);
                    res.assets.map(asset => {
                        writeAssetAsThumbnail(asset.id);
                    });
                })
                .then(() => { this.findData(); this.findThumbnail(); })
                .catch((err: Error) => {
                    console.log('write Presentation err');
                });
        }
    }

    private ClickClientImg(e: React.SyntheticEvent, id?: string) {
        const Clientdata = JSON.parse((e.target as any).dataset.all);

        if (this.props.isSelect === true) {
            this.setState({ selectedImg: Clientdata.id });
            this.props.saveSelectMedia(Clientdata);
        } else {
            this.setState({prstId: id}, () => {
                this.setState({
                    isPreviewVisible: true
                });
            });
        }
    }

    private closePreviewDialog = (open: boolean) => {
        this.setState({
            isPreviewVisible: open
        });
    }

    /**
     * Call provided api to fetch data.
     */
    private callApiToFetch() {
        this.attachParamsAtUrl();
        this.setState({ apiResStatus: 'LOAD' }, () => {
            // Call api with params.
            this.props.api({
                page: this.state.apiListPage || 1,
                perPage: this.state.apiListPerPage || 20,
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
                    console.log(apiRes.data);
                    // Call api fatch callback.
                    this.props.onApiFetch(apiRes.data);

                    let thumData: any = [];

                    await apiRes.data.map(async (imgData: any) => {
                        // console.log(imgData);
                        thumData = thumData.concat({
                            img: config.EXTERNAL.CUBLICK.PRESENTATION.THUMBNAIL(imgData.id, store.getState().appAuth.token),
                            title: imgData.name,
                            author: imgData.owner.displayName,
                            id: imgData.id,
                            type: 'presentation',
                            name: imgData.name,
                            mimeType: '',
                            fileType: '',
                            md5: '',
                            srcLink: '',
                            code: 1,
                            colorLabel: '#0a84d2'

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

    private handleChangeTab(e: React.ChangeEvent, newValue: any) {
        if (newValue === 1) {
            this.callApiToFetch();
        } else if (newValue === 0) {
            this.findData();
            this.findThumbnail();
        }
        this.setState({
            setTab: newValue
        });

    }

    private findData() {
        PresentationDatabaseFindAllReq();
        setTimeout(() => {
            this.setState({
                findClientData: store.getState().appPresentation.presentationData.data
            });
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

    private handleDelConfirm = (open: any, del: any, presentationId?: string) => {
        if (del === 'INIT') {
            this.waitConfirmData = presentationId;
        } else if (del === true) {
            this.deletePresentationMessage();
        }
        this.setState({
                openDelConfirm: open
        });
    }

    private deletePresentationMessage() {
        PresentationDatabaseDeletetReq(this.waitConfirmData);
        setTimeout(() => {
            this.setState({
                findClientData: this.state.findClientData.filter(x => x._id !== this.waitConfirmData)
            });
        }, 100);
    }
}

export default injectIntl(PresentationDataList);



