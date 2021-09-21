import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';

// Stylesheet
import './Alert.scss';


/** Props of `Alert` component. */
type AlertProps = {
    isOpen?: Function;
    type?: string;
};

type AlertStates = {
};

class Alert extends React.Component<AlertProps, AlertStates> {
    private message: any = '';
    constructor(props: AlertProps) {
        super(props);
        this.state = {};
    }

    render() {
        this.props.type === 'SAVE_SUCCESS' ?
            this.message = <FormattedMessage id='app-showMessageBox.save_success' defaultMessage='Saved successfully.'/>
        :
        this.props.type === 'SAVE_FAIL' ?
            this.message = <FormattedMessage id='app-showMessageBox.save_fail' defaultMessage='Save failed.'/>
        :
        this.props.type === 'EXIT_OR_FAIL' ?
            this.message = <FormattedMessage id='app-showMessageBox.exit_or_fail' defaultMessage='The file already exists or the download failed.'/>
        :
        this.props.type === 'TOO_BIG' ?
            this.message = <FormattedMessage id='app-showMessageBox.too_big' defaultMessage='The size of the data is too large.'/>
        : '';
        return (
            <div>
                <Dialog
                    open={true}
                    aria-labelledby='alert-dialog-title'
                >
                    <DialogTitle className='LayoutEditor-Alert-Title' id='alert-dialog-title'>{this.message}</DialogTitle>

                    <DialogActions>
                        <Button onClick={() => this.props.isOpen(false)} color='primary' autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default Alert;
