import * as React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import { isTokenValid } from './token';

// 토큰 검사 후 redirect

export const ProtectedRoute = (
    {
    component: Component,
    authToken,
    ...args
}:
    { authToken: string; } &
    RouteProps
) => (
    <Route
        { ...args }
        render={
            props => isTokenValid(authToken) ?
                <Component { ...props } /> :
                <Redirect to={{
                    pathname: '/auth',
                    state: { from: props.location }
                }} />
        }
    />
);
