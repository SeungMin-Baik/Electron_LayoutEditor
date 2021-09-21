import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import InfoIcon from '@material-ui/icons/Info';
import { Tooltip } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import Fab from '@material-ui/core/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/pro-solid-svg-icons/faTrashAlt';

import AssetUploadDialog from '../Dialog/AssetUploadDialog';

import { AssetDatabaseFindAllReq, AssetDatabaseDeletetReq } from '@app/utils/renderer/initialize/DatabaseReq';
import electronConfig from '@app/config/electron-config';

import Confirm from '@app/components/AppPartial/Confirm';

import * as imageLoad from '../../../../public/media/image-loading.png';

import store from '@app/store';
import * as fs from 'fs';

import './AssetDataList.scss';

/** States of `DataListTable` component. */
type AssetDataListProps = {
    filters?: {
        value: string;
    };
    isEditor?: boolean
    onDragStart?: Function;
    onDragEnd?: Function;
} & InjectedIntlProps;

/** States of `DataListTable` component. */
type AssetDataListStates = {
    isVisible: boolean;
    findClientData: any;
    findThumbnails: Array<any>;
    openDelConfirm: boolean;
    saveTitleValue: string;
};

class AssetDataList extends React.Component<AssetDataListProps, AssetDataListStates> {
    private waitConfirmData: any = '';
    constructor(props: AssetDataListProps) {
        super(props);
        this.onDialog = this.onDialog.bind(this);
        this.findData = this.findData.bind(this);
        this.findThumbnail = this.findThumbnail.bind(this);
        this.state = {
            isVisible: false,
            findClientData: [],
            findThumbnails: [],
            openDelConfirm: false,
            saveTitleValue: ''
        };
    }


    componentDidMount() {
        this.findData();
        this.findThumbnail();
    }


    render() {
        const { formatMessage } = this.props.intl;

        const body = (
                <div className={this.props.isEditor ? 'LayoutEditor-AssetDataListTable-editor' : 'LayoutEditor-AssetDataListTable'}>
                    <GridList cols={this.props.isEditor ? 4 : 6} className='gridList'>
                        {
                            this.state.findClientData.length > 0 ?
                            this.state.findClientData.filter(ClientData => ClientData.FileData.name.indexOf(this.state.saveTitleValue) !== -1).map(ClientData => (
                                <Tooltip title={ClientData.FileData.name} placement='top' disableHoverListener={this.props.isEditor ? false : true}>
                                    <GridListTile
                                        key={ClientData._id}
                                        draggable='true'
                                        onDragStart={(e) => this.props.onDragStart(e, ClientData)}
                                        onDragEnd={(e) => this.props.onDragEnd(e, ClientData)}
                                    >
                                        {
                                            !this.props.isEditor ?
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
                                                } alt={ClientData.FileData.name} />
                                        </div>
                                        {
                                            !this.props.isEditor ?
                                                <GridListTileBar
                                                    title={ClientData.FileData.name}
                                                    subtitle={<span>by: Guest </span>}
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
                                <div className='AssetDataListTable-nullData'>
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
                    <>
                        {
                            !this.props.isEditor ?
                                <div className='LayoutEditor-Head'>
                                    <div className='LayoutEditor-Head-Search'>
                                        <TextField
                                            className='Search-Info'
                                            onChange={this.handleSearchValue}
                                            autoComplete='off'
                                            label={
                                                formatMessage({
                                                    id: 'app-common.search',
                                                    defaultMessage: 'Search'
                                                })
                                            }
                                        >
                                        </TextField>
                                    </div>
                                    <div className='LayoutEditor-Head-Upload'>
                                        <button className='Upload-Button' onClick={e => this.onDialog(true)}>
                                            <FormattedMessage
                                                id='app-asset-upload'
                                                defaultMessage='Upload'
                                            />
                                        </button>
                                    </div>
                                </div>
                            : null
                        }
                    </>
                }
                {
                    body
                }
            </>
        );
    }


    private onDialog = (isVisible: boolean, refresh?: boolean) => {
        if (refresh) {
            this.findData();
            this.findThumbnail();
        }
        this.setState({ isVisible });
    }

    private findData = () => {
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

    private findThumbnail = () => {
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

    private deleteAssetMessage = () => {
        AssetDatabaseDeletetReq(this.waitConfirmData);
        setTimeout(() => {
            this.setState({
                findClientData: this.state.findClientData.filter(x => x._id !== this.waitConfirmData)
            });
        }, 100);
    }

    /* For Search */
    private handleSearchValue = (e: React.ChangeEvent<{ value: any }>) => {
        this.setState({
            saveTitleValue: e.target.value
        });
    }
}

export default injectIntl(AssetDataList);
