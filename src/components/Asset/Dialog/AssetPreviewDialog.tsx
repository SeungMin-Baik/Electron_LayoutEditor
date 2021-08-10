import * as React from 'react';

import electronConfig from '@app/config/electron-config';

import {  AssetDatabaseFindOneReq } from '@app/utils/renderer/initialize/DatabaseReq';

import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import Button from '@material-ui/core/Button';
// import { CublickParser } from '@cublick/parser';
// import { CublickRenderer } from '@cublick/renderer';
import Grow from '@material-ui/core/Grow';
import { push } from 'connected-react-router';


// Stylesheet
import './AssetPreviewDialog.scss';
import store from '@app/store';

type AssetPreviewDialogProps = {
    closeDialog: Function;
    title: any;
    assetId: string;
} & InjectedIntlProps;

type AssetPreviewDialogState = {
    assetData: any;
};

class AssetPreviewDialog extends React.Component<AssetPreviewDialogProps, AssetPreviewDialogState> {
    private mainRender: any;
    constructor(props: AssetPreviewDialogProps) {
        super(props);
        this.state = {
            assetData: {}
        };
    }

    componentWillMount() {
        this.getAssetData();
    }

    componentDidMount() {
        // this.mainRender = new CublickRenderer(document.getElementById('DisplayerMain'), {
        //     electronCompatible: true,
        //     displayMode: 'ASPECT_RATIO',
        //     // customFonts: {
        //     //     fonts,
        //     //     sourceStylesheet
        //     // }
        // });
    }

    componentDidUpdate() {
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
        <>
            <div className='cbkApp-AssetPreviewDialog'>
                <div className='AssetPreviewDialog-background'></div>

                <Grow in={true}>
                <div className='AssetPreviewDialog-content'>
                    <div className='AssetPreviewDialog-content-title'>
                        <div className='content-title-info'> {this.props.title} </div>
                    </div>
                    <div className='AssetPreviewDialog-content-info'>
                        <div className='content-info-renderer'>
                            <div id='DisplayerMain' />
                        </div>
                        <div className='content-info-data'>
                            developing,,,
                            {
                                // this.state.assetData && Object.keys(this.state.assetData).length > 0 ?
                                // <>
                                //     <div className='info-data-cover'>
                                //         <div className='info-data-title'>
                                //             <FormattedMessage
                                //                 id='app-presentation.preview.name'
                                //                 defaultMessage='Name'
                                //             />
                                //         </div>
                                //         <div className='info-data-content'> {this.state.assetData.FileData.name} </div>
                                //     </div>

                                //     <div className='info-data-cover'>
                                //         <div className='info-data-title'>
                                //             <FormattedMessage
                                //                 id='app-presentation.preview.desc'
                                //                 defaultMessage='Desc'
                                //             />
                                //         </div>
                                //         <div className='info-data-content'> {this.state.assetData.FileData.desc} </div>
                                //     </div>

                                //     <div className='info-data-cover'>
                                //         <div className='info-data-title'>
                                //             <FormattedMessage
                                //                 id='app-presentation.preview.mode'
                                //                 defaultMessage='Mode'
                                //             />
                                //         </div>
                                //         <div className='info-data-content'> {this.state.assetData.FileData.orientation} </div>
                                //     </div>

                                //     <div className='info-data-cover'>
                                //         <div className='info-data-title'>
                                //             <FormattedMessage
                                //                 id='app-presentation.preview.ratio'
                                //                 defaultMessage='Ratio'
                                //             />
                                //         </div>
                                //         <div className='info-data-content'> {this.state.assetData.FileData.ratio} </div>
                                //     </div>

                                //     <div className='info-data-cover'>
                                //         <div className='info-data-title'>
                                //             <FormattedMessage
                                //                 id='app-presentation.preview.width'
                                //                 defaultMessage='Width'
                                //             />
                                //         </div>
                                //         <div className='info-data-content'> {this.state.assetData.FileData.width} </div>
                                //     </div>

                                //     <div className='info-data-cover'>
                                //         <div className='info-data-title'>
                                //             <FormattedMessage
                                //                 id='app-presentation.preview.height'
                                //                 defaultMessage='Height'
                                //             />
                                //         </div>
                                //         <div className='info-data-content'> {this.state.assetData.FileData.height} </div>
                                //     </div>

                                //     <div className='info-data-cover'>
                                //         <div className='info-data-title'>
                                //             <FormattedMessage
                                //                 id='app-presentation.preview.updateDate'
                                //                 defaultMessage='Update Date'
                                //             />
                                //         </div>
                                //         <div className='info-data-content'> {this.state.assetData.timestamp} </div>
                                //     </div>

                                // </>

                                // : null
                            }
                        </div>
                    </div>
                    <div className='AssetPreviewDialog-content-foot'>
                        <div className='AssetPreviewDialog-contentAdd-foot-button'>
                            <div className='AssetPreviewDialog-foot-saveAndclose'>
                                <Button className='AssetPreviewDialog-contentAdd-foot-close' variant='contained' color='secondary'
                                        onClick={e => this.props.closeDialog(false)}>
                                    <FormattedMessage
                                        id='app-common.close'
                                        defaultMessage='Close'
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                </Grow>

            </div>
        </>
        );
    }

    private getAssetData = () => {
        // AssetDatabaseFindOneReq(this.props.assetId);
        // setTimeout(() => {
        //     this.setState({
        //         assetData: store.getState().appAssetData.assetDataOne.dataOne
        //     }, () => {
        //         const parser = new CublickParser({
        //             apis: {
        //                 asset: `${electronConfig.APP.DIR_PATH.FILE_PATH}/{id}`,
        //                 assetThumbnail: `${electronConfig.APP.DIR_PATH.THUMBNAIL_PATH}/{id}_thumb`,
        //             }
        //         });

        //         const parsedAssetData = parser.parse(this.state.assetData.FileData);

        //         this.mainRender.renderPresentation(parsedAssetData, {
        //             contentDataInputType: 'PARSED'
        //         });
        //     });
        // }, 100);
    }


}

export default injectIntl(AssetPreviewDialog);
