import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// App store
import store from '@app/store';

// App root component
import Root from './Root';


// Override `Material-UI` theme for customizing.
// ref: https://material-ui.com/customization/themes/#muithemeprovider
const theme = createMuiTheme({
    typography: {
        fontFamily: '\'Noto Sans\', \'Noto Sans KR\', sans-serif, Arial'
    },
    palette: {
        primary: {
            main: '#3d424e'
        }
    }
});

// Render React components.
ReactDOM.render(
    (
        <MuiThemeProvider theme={theme}>
            <Provider store={store}>
                <Root />
            </Provider>
        </MuiThemeProvider>
    ),
    document.getElementById('root')
);

