import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/pro-solid-svg-icons/faTrashAlt';
import IconButton from '@material-ui/core/IconButton';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import InfoIcon from '@material-ui/icons/Info';

import Fab from '@material-ui/core/Fab';

import { PresentationDatabaseFindAllReq, PresentationDatabaseDeletetReq } from '@app/utils/renderer/initialize/DatabaseReq';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import Confirm from '@app/components/AppPartial/Confirm';

import * as fs from 'fs';
import config from '@app/config';
import electronConfig from '@app/config/electron-config';
import store from '@app/store';

import * as imageLoad from '../../../public/media/image-loading.png';

import PresentationPreviewDialog from './Dialog/PresentationPreviewDialog';


import './PresentationDataList.scss';

/** States of `DataListTable` component. */
type PresentationDataListProps = {
    filter: {
        key: string;
        operator: '=';
        value: string;
    };
    saveSelectMedia?: Function;
    isSelect?: boolean;
    isEditor?: boolean;
    onDragStart?: Function;
    onDragEnd?: Function;
} & InjectedIntlProps;

/** States of `DataListTable` component. */
type PresentationDataListStates = {
    isPreviewVisible: boolean;
    findClientData: any;
    findThumbnails: Array<any>;
    selectedPrstnId: string;
    selectedPrstnlayoutInfo: Array<any>;
    selectedImg: string;
    openDelConfirm: boolean;
    prstId: string;
};

// 프레젠테이션들을 표출해주는 grid list 컴포넌트
class PresentationDataList extends React.Component<PresentationDataListProps, PresentationDataListStates> {
    private waitConfirmData: any = {};
    constructor(props: PresentationDataListProps) {
        super(props);
        this.findData = this.findData.bind(this);
        this.findThumbnail = this.findThumbnail.bind(this);
        this.ClickClientImg = this.ClickClientImg.bind(this);
        this.deletePresentationMessage = this.deletePresentationMessage.bind(this);
        this.handleDelConfirm = this.handleDelConfirm.bind(this);
        this.state = {
            isPreviewVisible: false,
            findClientData: [],
            findThumbnails: [],
            selectedPrstnId: null,
            selectedPrstnlayoutInfo: null,
            selectedImg: '',
            openDelConfirm: false,
            prstId: ''
        };
    }

    componentDidMount() {
        this.findData();
        this.findThumbnail();
    }


    render() {
        const body = (
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
                this.state.isPreviewVisible ?
                    <PresentationPreviewDialog title='Preview' closeDialog={this.closePreviewDialog} prstId={this.state.prstId} />
                : null
            }
            {
                body
            }
            </>
        );
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



