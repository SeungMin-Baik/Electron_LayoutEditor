import * as React from 'react';

import * as path from 'path';
import config from '@app/config/electron-config';

import Button from '@material-ui/core/Button';

import { ClientAssetDataInsertReq } from '@app/utils/renderer/initialize/DatabaseReq';

import { getThumbnailtReq } from '@app/utils/renderer/initialize/getThumbnailReq';
import { FormattedMessage } from 'react-intl';

// Stylesheet
import './AssetUploadDialog.scss';

type AssetUploadDialogProps = {
    closeDialog: Function;
    title: string;
};

type AssetUploadDialogStates = {
    selectedFile: any;
};

class AssetUploadDialog extends React.Component<AssetUploadDialogProps, AssetUploadDialogStates> {
    constructor(props: AssetUploadDialogProps) {
        super(props);
        this.state = {
            selectedFile: {},
        };
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        return (
            <>
                <div className='LayoutEditor-AssetUploadDialog'>
                    <div className='AssetUploadDialog-Background'></div>
                    <div className='AssetUploadDialog-Content'>
                        <div className='AssetUploadDialog-Content-Title'>
                            <div className='content-title-info'>{this.props.title}</div>
                        </div>
                        <div className='AssetUploadDialog-Content-Info'>
                            <div className='AssetUploadDialog-Content-TextField'>
                                <input type='file' name='file' onChange={e => this.handleFileInput(e)} />
                                {
                                    this.state.selectedFile.name ?
                                        <div> {this.state.selectedFile.name} </div>
                                        : null
                                }
                            </div>
                        </div>

                        <div className='AssetUploadDialog-Content-Foot'>
                            <div className='AssetUploadDialog-Foot-SaveAndClose'>
                                <Button variant='contained' onClick={this.saveFile} style={{background: '#00e2a5', color: '#ffffff'}}>
                                    <FormattedMessage
                                        id='app-common.save'
                                        defaultMessage='Save'
                                    />
                                </Button>
                            </div>
                            <div className='AssetUploadDialog-Foot-SaveAndClose'>
                                <Button variant='contained' color='secondary' onClick={() => this.props.closeDialog(false, true)}>
                                    <FormattedMessage
                                        id='app-common.close'
                                        defaultMessage='Close'
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    private handleFileInput = (e) => {
        const strArray = e.target.files[0].type.split('/');
        const md5 = require('md5');

        const fileType = e.target.files[0].type;
        if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg') {

            const files = e.target.files[0];
            const strArray = e.target.files[0].type.split('/');
            const img = new Image();
            img.src = window.URL.createObjectURL(e.target.files[0]);

            img.onload = () => {
                this.setState({
                    selectedFile: {
                        width: img.width,
                        height: img.height,
                        name: files.name,
                        path: files.path,
                        fileType: '.' + strArray[1],
                        mimeType: strArray[0],
                        md5: (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                            (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                            (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                            (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                            (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                            (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                            (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                            (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)),

                        id: (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                            (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                            (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                            (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                            (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                            (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1))
                    }

                });
            };
        }
        else {
            this.setState({
                selectedFile: {
                    name: e.target.files[0].name,
                    path: e.target.files[0].path,
                    fileType: '.' + strArray[1],
                    mimeType: strArray[0],
                    md5: (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                        (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                        (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                        (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                        (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                        (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                        (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                        (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)),

                    id: (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                        (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                        (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                        (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                        (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
                        (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1))
                }
            });

        }

    }

    private saveFile = () => {
        const i = 1;
        const fs = require('fs-extra');
        console.log(this.state.selectedFile);
        ClientAssetDataInsertReq(this.state.selectedFile);
        fs.copy(this.state.selectedFile.path, path.join(config.APP.DIR_PATH.FILE_PATH) + '/' + this.state.selectedFile.id, function (err) {
            if (err) {
                return console.error(err);
            } else {
                console.log('fs copy success');
            }
        });

        setTimeout(() => {
            getThumbnailtReq(config.APP.DIR_PATH.FILE_PATH + '/' + this.state.selectedFile.id, this.state.selectedFile);
        }, i * 200);

        setTimeout(() => {
            this.props.closeDialog(false, true);
        }, i * 400);

    }

}

export default AssetUploadDialog;