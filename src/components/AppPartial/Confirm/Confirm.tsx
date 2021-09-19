import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';

// Stylesheet
import './Confirm.scss';


/** Props of `Confirm` component. */
type ConfirmProps = {
    isOpen: Function;
    type: string;
};

type ConfirmStates = {
};

class Confirm extends React.Component<ConfirmProps, ConfirmStates> {
    private message: any = '';
    constructor(props: ConfirmProps) {
        super(props);
        this.state = {};
    }

    render() {
        this.props.type === 'DELETE' ?
            this.message = <FormattedMessage id='app-showMessageBox.delete' defaultMessage='Do you want to delete?' />
        :
        this.props.type === 'UPDATE' ?
            this.message = <FormattedMessage id='app-showMessageBox.update' defaultMessage='Would you like to fix it?'/>
        :
        this.props.type === 'SAVE' ?
            this.message = <FormattedMessage id='app-showMessageBox.save' defaultMessage='Do you want to save?'/>
        :
        this.props.type === 'OUTEDITOR' ?
            this.message = <FormattedMessage id='app-showMessageBox.out' defaultMessage='Do you want to go out?'/>
        : '';
        return (
            <div>
                <Dialog
                    open={true}
                    aria-labelledby='alert-dialog-title'
                >
                    <DialogTitle className='LayoutEditor-Confirm-Title' id='alert-dialog-title'>{this.message}</DialogTitle>


                    <DialogActions>
                        <Button onClick={() => this.props.isOpen(false, true)} color='primary'>
                            <FormattedMessage
                                id='app-showMessageBox.yes'
                                defaultMessage='YES'
                            />
                        </Button>
                        <Button onClick={() => this.props.isOpen(false, false)} color='primary' autoFocus>
                            <FormattedMessage
                                id='app-showMessageBox.no'
                                defaultMessage='NO'
                            />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default Confirm;
