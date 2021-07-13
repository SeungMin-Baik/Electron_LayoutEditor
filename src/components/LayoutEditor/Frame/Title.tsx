import * as React from 'react';

// Stylesheet
import './Title.scss';


/** Props of `Title` component. */
type TitleProps = {
    editorTitle?: string;
    editorDesc?: string;
};

type TitleStates = {};

class Title extends React.Component<TitleProps, TitleStates> {
    constructor(props: TitleProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className='LayoutEditor-Title'>
                <div className='Title-Name'> {this.props.editorTitle} </div>
                <div className='Title-Desc'> {this.props.editorDesc}</div>
            </div>
        );
    }
}

export default Title;