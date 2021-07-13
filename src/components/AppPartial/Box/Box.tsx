import * as React from 'react';

// Stylesheet
import './Box.scss';


/** Props of `Box` component. */
type BoxProps = {
    /** Class name to append. */
    className?: React.HTMLAttributes<HTMLDivElement>['className'];
    /** CSS styles to append. */
    style?: React.CSSProperties;
    /** Box title. */
    title?: string | JSX.Element;
};

class Box extends React.Component<BoxProps, {}> {
    constructor(props: BoxProps) {
        super(props);
    }

    render() {
        return (
            <div
                className={
                    `cbkApp-Box${
                        this.props.className ?
                            ' ' + this.props.className : ''
                    }`
                }
                style={this.props.style}
            >
                {
                    this.props.title ?
                        <div className='cbkApp-Box-head'>
                            {this.props.title}
                        </div>
                    :
                        null
                }

                <div className='cbkApp-Box-body'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Box;
