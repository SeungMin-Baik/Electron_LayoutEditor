import * as React from 'react';

class NotFound extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    componentDidMount() {
        console.log('Dude, I\'m mounted...!');
    }

    componentWillUnmount() {
        console.log('See ya, buddy...!');
    }

    render() {
        return (
            <div>
                <span>Wrong page</span>
            </div>
        );
    }
}

export default NotFound;
