import * as React from 'react';
import { Switch, Route } from 'react-router';

import HomeInfo from './Info/HomeInfo';



type HometStates = { };

class Home extends React.Component<{}, HometStates> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route
                        path='/'
                        component={HomeInfo}
                        exact
                    />
                </Switch>
            </div>
        );
    }
}

export default Home;