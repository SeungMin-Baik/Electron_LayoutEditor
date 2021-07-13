import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TextField from '@material-ui/core/TextField';

// Stylesheet
import './TermsOfSevice.scss';
import { Paper } from '@material-ui/core';


/** Props of `TermsOfSevice` component. */
type TermsOfSeviceProps = {
};

class TermsOfSevice extends React.Component<TermsOfSeviceProps, {}> {
    constructor(props: TermsOfSeviceProps) {
        super(props);
    }

    render() {
        return (
            <>
                <div className='register-termsofsevice-title'>
                    <h3>
                        <FormattedMessage
                            id='app-termsofsevice.sub_title'
                        />
                    </h3>
                </div>
                <Paper elevation={3} className='terms_paper'>
                    <div className='terms-paper-text'>
                        <FormattedMessage
                            id='app-termsofsevice-1-1'
                            values={{
                                br: <br/>
                            }}
                        />,
                        <FormattedMessage
                            id='app-termsofsevice-1-2'
                            values={{
                                br: <br/>
                            }}
                        />,
                        <FormattedMessage
                            id='app-termsofsevice-2-1'
                            values={{
                                br: <br/>
                            }}
                        />
                        <FormattedMessage
                            id='app-termsofsevice-2-2'
                            values={
                                {br: <br/>}
                            }
                        />
                    </div>
                </Paper>
            </>
        );
    }
}

export default TermsOfSevice;

