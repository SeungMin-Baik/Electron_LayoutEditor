import Types from 'Types';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { bindActionCreators, Dispatch } from 'redux';
import { authActions } from '@app/store/appAuth';
import SignIn from './SignIn';

const mapStateToProps = (state: Types.RootStates) => ({
    authStatus: state.appAuth.status
});

const mapDispatchToProps = (dispatch: Dispatch<Types.RootActions>) => (
    bindActionCreators({
        signIn: authActions.signIn
    }, dispatch)
);

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export type SignInContainerProps = typeof statePropTypes & typeof actionPropTypes & {};
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
