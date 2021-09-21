import * as React from 'react';

import { Switch, Route, RouteComponentProps } from 'react-router';

import LayoutEditorContainer from './LayoutEditorContainer';

import {  PresentationDatabaseFindOneReq } from '@app/utils/renderer/initialize/DatabaseReq';

import store from '@app/store';



/** Props of `PreviewContainer` component. */
type PreviewContainerProps = {
} & RouteComponentProps;

type PreviewContainerStates = {
    prstnId: string;
    prstnData: any;
};

class PreviewContainer extends React.Component<PreviewContainerProps, PreviewContainerStates> {
    constructor(props: PreviewContainerProps) {
        super(props);
        this.state = {
            prstnId: '',
            prstnData: {}
        };
    }

    componentDidMount() {
        this.getPrstnId();
    }

    componentDidUpdate() {
    }

    render() {
        return (
            <LayoutEditorContainer prstnId={this.state.prstnId} prstnData={this.state.prstnData}/>
        );
    }

    private getPrstnId = () => {
        const prstnId = (this.props.match.params as any)['id'];
        PresentationDatabaseFindOneReq(prstnId);
        setTimeout(() => {
            this.setState({
                prstnId: prstnId,
                prstnData: store.getState().appPresentation.presentationDataOne.dataOne
            });
        }, 100);
    }
}

export default PreviewContainer;