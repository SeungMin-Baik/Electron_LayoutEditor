import * as React from 'react';

import { Switch, Route, Prompt } from 'react-router';

import store from '@app/store';
// import { menuActions } from '@app/store/appMenu';

import { push } from 'connected-react-router';

import Confrim from '@app/components/AppPartial/Confirm';

import LayoutEditorContainer from './LayoutEditorContainer/LayoutEditorContainer';
import PreviewContainer from './LayoutEditorContainer/PreviewContainer';


// Stylesheet
import './LayoutEditor.scss';


/** Props of `LayoutEditor` component. */
type LayoutEditorProps = {};

type LayoutEditorStates = {
    shouldConfirm: boolean;
    isLeave: boolean;
    nextLocation: any;
    showConfirmModal: boolean;
};

class LayoutEditor extends React.Component<LayoutEditorProps, LayoutEditorStates> {
    constructor(props: LayoutEditorProps) {
        super(props);
        this.state = {
            shouldConfirm: true,
            isLeave: false,
            nextLocation: '',
            showConfirmModal: false,
        };
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        return (
            <>
                <Prompt when={this.state.shouldConfirm} message={this.handlePrompt} />
                {
                    this.state.showConfirmModal ?
                    <Confrim isOpen={this.handleConfirm} type='OUTEDITOR' />
                    : null
                }
                <div className='cbkApp-LayoutEditor'>
                <Switch>
                    <Route
                        path='/layoutEditor'
                        component={LayoutEditorContainer}
                        exact
                    />
                    <Route
                        path='/layoutEditor/:id'
                        component={PreviewContainer}
                        exact
                    />
                </Switch>
                </div>
            </>
        );
    }

    private handlePrompt = (location) => {
        if (!this.state.isLeave && this.state.shouldConfirm) {
            this.setState({
                showConfirmModal: true
            });
          this.setNextLocation(location.pathname);
          return false;
        }
        return true;
    };

    private setNextLocation = (location) => {
        this.setState({
            nextLocation: location
        });
    }

    private handleConfirm = (open: boolean, out?: boolean) => {
        if (open === false) {
            this.setState({
                showConfirmModal: false
            }, () => {
                if (out) {
                    this.setState({
                        isLeave: true
                    }, () => {
                        store.dispatch(push(this.state.nextLocation));
                    });
                }
            });
        }
    }
}

export default LayoutEditor;
