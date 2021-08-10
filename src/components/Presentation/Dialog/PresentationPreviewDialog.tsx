import * as React from 'react';

import electronConfig from '@app/config/electron-config';

import {  PresentationDatabaseFindOneReq } from '@app/utils/renderer/initialize/DatabaseReq';

import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import Button from '@material-ui/core/Button';
// import { CublickParser } from '@cublick/parser';
// import { CublickRenderer } from '@cublick/renderer';
import Grow from '@material-ui/core/Grow';
import { push } from 'connected-react-router';


// Stylesheet
import './PresentationPreviewDialog.scss';
import store from '@app/store';

type PresentationPreviewDialogProps = {
    closeDialog: Function;
    title: any;
    prstId: string;
} & InjectedIntlProps;

type PresentationPreviewDialogState = {
    prstnData: any;
};

class PresentationPreviewDialog extends React.Component<PresentationPreviewDialogProps, PresentationPreviewDialogState> {
    // private mainRender: CublickRenderer;
    constructor(props: PresentationPreviewDialogProps) {
        super(props);
        this.state = {
            prstnData: {}
        };
    }

    componentWillMount() {
        this.getPresentationData();
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
            <div className='cbkApp-PresentationPreviewDialog'>
                <div className='PresentationPreviewDialog-background'></div>

                <Grow in={true}>
                <div className='PresentationPreviewDialog-content'>
                    <div className='PresentationPreviewDialog-content-title'>
                        <div className='content-title-info'> {this.props.title} </div>
                    </div>
                    <div className='PresentationPreviewDialog-content-info'>
                        <div className='content-info-renderer'>
                            <div id='DisplayerMain' />
                        </div>
                        <div className='content-info-data'>
                            {
                                this.state.prstnData && Object.keys(this.state.prstnData).length > 0 ?
                                <>
                                    <div className='info-data-cover'>
                                        <div className='info-data-title'>
                                            <FormattedMessage
                                                id='app-presentation.preview.name'
                                                defaultMessage='Name'
                                            />
                                        </div>
                                        <div className='info-data-content'> {this.state.prstnData.FileData.name} </div>
                                    </div>

                                    <div className='info-data-cover'>
                                        <div className='info-data-title'>
                                            <FormattedMessage
                                                id='app-presentation.preview.desc'
                                                defaultMessage='Desc'
                                            />
                                        </div>
                                        <div className='info-data-content'> {this.state.prstnData.FileData.desc} </div>
                                    </div>

                                    <div className='info-data-cover'>
                                        <div className='info-data-title'>
                                            <FormattedMessage
                                                id='app-presentation.preview.mode'
                                                defaultMessage='Mode'
                                            />
                                        </div>
                                        <div className='info-data-content'> {this.state.prstnData.FileData.orientation} </div>
                                    </div>

                                    <div className='info-data-cover'>
                                        <div className='info-data-title'>
                                            <FormattedMessage
                                                id='app-presentation.preview.ratio'
                                                defaultMessage='Ratio'
                                            />
                                        </div>
                                        <div className='info-data-content'> {this.state.prstnData.FileData.ratio} </div>
                                    </div>

                                    <div className='info-data-cover'>
                                        <div className='info-data-title'>
                                            <FormattedMessage
                                                id='app-presentation.preview.width'
                                                defaultMessage='Width'
                                            />
                                        </div>
                                        <div className='info-data-content'> {this.state.prstnData.FileData.width} </div>
                                    </div>

                                    <div className='info-data-cover'>
                                        <div className='info-data-title'>
                                            <FormattedMessage
                                                id='app-presentation.preview.height'
                                                defaultMessage='Height'
                                            />
                                        </div>
                                        <div className='info-data-content'> {this.state.prstnData.FileData.height} </div>
                                    </div>

                                    <div className='info-data-cover'>
                                        <div className='info-data-title'>
                                            <FormattedMessage
                                                id='app-presentation.preview.updateDate'
                                                defaultMessage='Update Date'
                                            />
                                        </div>
                                        <div className='info-data-content'> {this.state.prstnData.timestamp} </div>
                                    </div>

                                </>

                                : null
                            }
                        </div>
                    </div>
                    <div className='PresentationPreviewDialog-content-foot'>
                        <div className='PresentationPreviewDialog-contentAdd-foot-button'>
                            <div className='PresentationPreviewDialog-foot-saveAndclose'>
                                <Button className='PresentationPreviewDialog-contentAdd-foot-save' variant='contained' color='secondary'
                                        onClick={this.linkToEditPstn}>
                                    <FormattedMessage
                                        id='app-common.edit'
                                        defaultMessage='Edit'
                                    />
                                </Button>
                            </div>
                            <div className='PresentationPreviewDialog-foot-saveAndclose'>
                                <Button className='PresentationPreviewDialog-contentAdd-foot-close' variant='contained' color='secondary'
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

    private linkToEditPstn = () => {
        store.dispatch(push(`/layoutEditor/${this.props.prstId}`));
    }

    private getPresentationData = () => {
        PresentationDatabaseFindOneReq(this.props.prstId);
        setTimeout(() => {
            this.setState({
                prstnData: store.getState().appPresentation.presentationDataOne.dataOne
            }, () => {
                // const parser = new CublickParser({
                //     apis: {
                //         asset: `${electronConfig.APP.DIR_PATH.FILE_PATH}/{id}`,
                //         assetThumbnail: `${electronConfig.APP.DIR_PATH.THUMBNAIL_PATH}/{id}_thumb`,
                //     }
                // });

                // const parsedPresentationData = parser.parse(this.state.prstnData.FileData);

                // this.mainRender.renderPresentation(parsedPresentationData, {
                //     contentDataInputType: 'PARSED'
                // });
            });
        }, 100);
    }


}

export default injectIntl(PresentationPreviewDialog);
