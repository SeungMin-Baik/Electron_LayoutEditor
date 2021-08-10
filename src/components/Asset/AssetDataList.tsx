import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import InfoIcon from '@material-ui/icons/Info';
import { Tooltip } from '@material-ui/core';

import AssetUploadDialog from './Dialog/AssetUploadDialog';

import { AssetDatabaseFindAllReq, AssetDatabaseDeletetReq } from '@app/utils/renderer/initialize/DatabaseReq';
import electronConfig from '@app/config/electron-config';

import Confirm from '@app/components/AppPartial/Confirm';

import * as imageLoad from '../../../public/media/image-loading.png';

import config from '@app/config';
import store from '@app/store';
import * as fs from 'fs';

import './AssetDataList.scss';

/** States of `DataListTable` component. */
type AssetDataListProps = {
    filters?: {
        key: string;
        operator: '=';
        value: string;
    };
    saveSelectMedia: Function;
    isEditor?: boolean
    isSelect: boolean;
    onDragStart?: Function;
    onDragEnd?: Function;
} & InjectedIntlProps;

/** States of `DataListTable` component. */
type AssetDataListStates = {
    isVisible: boolean;
    findClientData: any;
    findThumbnails: Array<any>;
    selectedImg: string;
    openDelConfirm: boolean;
};

// Asset의 이미지, 동영상 등의 Grid List를 출력해주는 컴포넌트
class AssetDataList extends React.Component<AssetDataListProps, AssetDataListStates> {
    private waitConfirmData: any = '';
    constructor(props: AssetDataListProps) {
        super(props);
        this.ClickClientImg = this.ClickClientImg.bind(this);
        this.onDialog = this.onDialog.bind(this);
        this.findData = this.findData.bind(this);
        this.findThumbnail = this.findThumbnail.bind(this);
        this.state = {
            isVisible: false,
            findClientData: [],
            findThumbnails: [],
            selectedImg: '',
            openDelConfirm: false
        };
    }


    componentDidMount() {
        this.findData();
        this.findThumbnail();
    }


    render() {
        const { formatMessage } = this.props.intl;

        const body = (
                <div className={this.props.isEditor ? 'cbkApp-ImageDataListTable-editor' : 'cbkApp-ImageDataListTable'}>
                    <GridList cols={this.props.isEditor ? 4 : 6} className='gridList'>
                        {
                            this.state.findClientData.length > 0 ?
                            this.state.findClientData.map(ClientData => (
                                <Tooltip title={ClientData.FileData.name} placement='top' disableHoverListener={this.props.isEditor ? false : true}>
                                    <GridListTile
                                        key={ClientData._id}
                                        draggable='true'
                                        onDragStart={(e) => this.props.onDragStart(e, ClientData)}
                                        onDragEnd={(e) => this.props.onDragEnd(e, ClientData)}
                                    >
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
                    </>
                }
                {
                    body
                }
            </>
        );
    }

    private ClickClientImg(e: React.SyntheticEvent) {
        const Clientdata = JSON.parse((e.target as any).dataset.all);
        console.log(Clientdata);
        if (this.props.isSelect === true) {
            this.setState({ selectedImg: Clientdata.id });
        }

        this.props.saveSelectMedia(Clientdata);
    }


    private onDialog(isVisible: boolean, refresh?: boolean) {
        if (refresh) {
            this.findData();
            this.findThumbnail();
        }
        this.setState({ isVisible });
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
