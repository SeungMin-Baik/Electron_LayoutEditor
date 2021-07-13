import * as React from 'react';
import { FormattedMessage } from 'react-intl';

// Stylesheet
import Paper from '@material-ui/core/Paper';
import './TermsOfSevicetwo.scss';


/** Props of `TermsOfSevicetwo` component. */
type TermsOfSevice2Props = {
};

class TermsOfSevicetwo extends React.Component<TermsOfSevice2Props, {}> {
    constructor(props: TermsOfSevice2Props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className = 'register-termsofsevice-title-down'>
                    <h3>
                        <p>
                            <FormattedMessage
                                id='app-termsofsevice_title2'
                                values={
                                    {br: <br/>}
                                }
                            />
                        </p>
                    </h3>
                    <Paper elevation={3} className = 'register-terms-paper'>
                        <div className = 'register-terms-paper-text-down'>
                            <FormattedMessage
                                id='app-termsofsevice-3'
                                values={
                                    {br: <br/>}
                                }
                            />
                            <FormattedMessage
                                id='app-termsofsevice-4'
                                values={
                                    {br: <br/>}
                                }
                            />
                        </div>
                    </Paper>
                </div>
            </>
        );
    }
}

export default TermsOfSevicetwo;