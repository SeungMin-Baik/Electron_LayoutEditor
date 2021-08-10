import * as React from 'react';
import store from '@app/store';
import { push } from 'connected-react-router';

class NotFound extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    componentDidMount() {
        store.dispatch(push('/'));
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

export default NotFound;
