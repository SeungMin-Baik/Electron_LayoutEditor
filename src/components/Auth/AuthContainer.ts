import Types from 'Types';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { bindActionCreators, Dispatch } from 'redux';
import { authActions } from '@app/store/appAuth';
import Auth from './Auth';

const mapStateToProps = (state: Types.RootStates) => ({
    currentRoute: state.router.location.pathname
});

const mapDispatchToProps = (dispatch: Dispatch<Types.RootActions>) => (
    bindActionCreators({
        signOut: authActions.signOut
    }, dispatch)
);

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export type AuthContainerProps = typeof statePropTypes & typeof actionPropTypes & {};
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
