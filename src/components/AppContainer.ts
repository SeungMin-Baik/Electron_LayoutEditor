import Types from 'Types';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { returntypeof } from 'react-redux-typescript';
import { bindActionCreators, Dispatch } from 'redux';
import { authActions } from '@app/store/appAuth';
import App from './App';

const mapStateToProps = (state: Types.RootStates) => ({
    currentRoute: state.router.location.pathname,
    isSignedIn: !!state.appAuth.token,
    userToken: state.appAuth.token
});

const mapDispatchToProps = (dispatch: Dispatch<Types.RootActions>) => (
    bindActionCreators({
        appSignOut: authActions.signOut
    }, dispatch)
);

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export type AppContainerProps = typeof statePropTypes & typeof actionPropTypes & RouteComponentProps & {};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
