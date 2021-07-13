import Types from 'Types';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import AuthTab from './AuthTab';

const mapStateToProps = (state: Types.RootStates) => ({
    currentRoute: state.router.location.pathname
});

const statePropTypes = returntypeof(mapStateToProps);

export type AuthTabContainerProps = typeof statePropTypes & {};
export default connect(mapStateToProps)(AuthTab);
