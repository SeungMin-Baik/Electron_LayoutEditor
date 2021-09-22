import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/pro-solid-svg-icons/faTrashAlt';
import { faEdit } from '@fortawesome/pro-solid-svg-icons/faEdit';
import IconButton from '@material-ui/core/IconButton';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import InfoIcon from '@material-ui/icons/Info';
import TextField from '@material-ui/core/TextField';
import { Tooltip } from '@material-ui/core';

import { push } from 'connected-react-router';

import Fab from '@material-ui/core/Fab';

import { PresentationDatabaseFindAllReq, PresentationDatabaseDeletetReq } from '@app/utils/renderer/initialize/DatabaseReq';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import Confirm from '@app/components/AppPartial/Confirm';

import * as fs from 'fs';
import electronConfig from '@app/config/electron-config';
import store from '@app/store';

import * as imageLoad from '../../../../public/media/image-loading.png';


import './PresentationDataList.scss';

/** States of `DataListTable` component. */
type PresentationDataListProps = {
    isEditor?: boolean;
    onDragStart?: Function;
    onDragEnd?: Function;
} & InjectedIntlProps;

/** States of `DataListTable` component. */
type PresentationDataListStates = {
    findClientData: any;
    findThumbnails: Array<any>;
    openDelConfirm: boolean;
    saveTitleValue: string;
};

class PresentationDataList extends React.Component<PresentationDataListProps, PresentationDataListStates> {
    private waitConfirmData: any = {};
    constructor(props: PresentationDataListProps) {
        super(props);
        this.findData = this.findData.bind(this);
        this.findThumbnail = this.findThumbnail.bind(this);
        this.deletePresentationMessage = this.deletePresentationMessage.bind(this);
        this.handleDelConfirm = this.handleDelConfirm.bind(this);
        this.state = {
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
            <div className={this.props.isEditor ? 'LayoutEditor-PresentationDataListTable-editor' : 'LayoutEditor-PresentationDataListTable'}>
                <GridList cols={6} className='gridList'>
                    {
                        this.state.findClientData.length > 0 ?
                        this.state.findClientData.filter(ClientData => ClientData.FileData.name.indexOf(this.state.saveTitleValue) !== -1).map(ClientData => (
                            <Tooltip title={ClientData.FileData.name} placement='top' disableHoverListener={this.props.isEditor ? false : true}>
                                <GridListTile
                                    key={ClientData._id}
                                    onDragStart={this.props.isEditor ? (e) => this.props.onDragStart(e, ClientData) : null}
                                    onDragEnd={this.props.isEditor ? (e) => this.props.onDragEnd(e, ClientData) : null }
                                >
                                    {
                                        !this.props.isEditor ?
                                            <div className='actionSection'>
                                                <div className='editButton' onClick={() => this.linkToEditPstn(ClientData._id)}>
                                                    <Fab variant='round' size='small' className='editButton-fab'>
                                                        <FontAwesomeIcon className='editButton-info' icon={faEdit} />
                                                    </Fab>
                                                </div>
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
                                        />
                                    </div>
                                    {
                                        !this.props.isEditor ?
                                            <GridListTileBar
                                                title={ClientData.FileData.name}
                                                subtitle={<span>by: Guest</span>}
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
                    </div>
                : null
            }
            {
                body
            }
            </>
        );
    }


    private findData = () => {
        PresentationDatabaseFindAllReq();
        setTimeout(() => {
            this.setState({
                findClientData: store.getState().appPresentation.presentationData.data
            });
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

    private deletePresentationMessage = () => {
        PresentationDatabaseDeletetReq(this.waitConfirmData);
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

    private linkToEditPstn = (prstId: string) => {
        store.dispatch(push(`/layoutEditor/${prstId}`));
    }
}

export default injectIntl(PresentationDataList);



