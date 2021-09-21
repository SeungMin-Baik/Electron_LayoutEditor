import * as React from 'react';
import { Button, Input, Tooltip } from '@material-ui/core';
import { Flex } from '../flex';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import TextField from '@material-ui/core/TextField';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import TextFieldsOutlinedIcon from '@material-ui/icons/TextFieldsOutlined';
import InputOutlinedIcon from '@material-ui/icons/InputOutlined';
// Stylesheet
import './MapList.scss';


/** Props of `MapList` component. */
type MapListProps = {
    canvasRef: any;
    selectedItem: any;
};

type MapListStates = {};

class MapList extends React.Component<MapListProps, MapListStates> {
    constructor(props: MapListProps) {
        super(props);
        this.renderActions = this.renderActions.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.state = {};
    }

    render() {
        return (
            <div className='LayoutEditor-MapList'>
                {/* <div>{ this.renderActions() }</div> */}
                { this.renderItem()}
            </div>
        );
    }

    private renderActions() {
        const idCropping = this.props.canvasRef.current ? this.props.canvasRef.current.handler ? this.props.canvasRef.current.handler.interactionMode === 'crop' : false : false;
        return (
            <Flex.Item className='rde-canvas-list-actions' flex='0 1 auto'>
                <Flex justifyContent='space-between' alignItems='center'>
                    <Flex flex='1' justifyContent='center'>
                        <ArrowUpwardIcon onClick={e => this.props.canvasRef.current.handler.sendBackwards()} />
                    </Flex>
                    <Flex flex='1' justifyContent='center'>
                        <ArrowDownwardIcon onClick={e => this.props.canvasRef.current.handler.bringForward()} />
                    </Flex>
                </Flex>
            </Flex.Item>
        );
    }

    private renderSwitch(param) {
        switch (param) {
            case 'IMAGE':
                return <ImageOutlinedIcon />;
            case 'VIDEO':
                return <VideocamOutlinedIcon />;
            case 'INPUT_SOURCE':
                return <InputOutlinedIcon />;
            case 'textbox':
                return <TextFieldsOutlinedIcon />;
            default:
                return <TextFieldsOutlinedIcon />;
        }
    }

    private renderItem() {
        const idCropping = this.props.canvasRef.current ? this.props.canvasRef.current.handler ? this.props.canvasRef.current.handler.interactionMode === 'crop' : false : false;
        return (
            this.props.canvasRef.current ? this.props.canvasRef.current.canvas
                .getObjects()
                .filter((obj: any) => {
                    if (obj.id === 'workarea') {
                        return false;
                    }
                    if (obj.id) {
                        return true;
                    }
                    return false;
                })
                .map((obj: any) => {
                    let icon;
                    let title = obj.name || obj.type;
                    if (obj.type === 'textbox') {
                        title = obj.text;
                    }
                    let type;
                    if (obj.mimeType) {
                        type = obj.mimeType;
                    }
                    else {
                        type = obj.type;
                    }

                    let prefix = 'fas';
                    if (obj.type === 'i-text') {
                        icon = 'map-marker-alt';
                    } else if (obj.type === 'textbox') {
                        icon = 'font';
                    } else if (obj.type === 'image') {
                        icon = 'image';
                    } else if (obj.type === 'triangle') {
                        icon = 'image';
                    } else if (obj.type === 'rect') {
                        icon = 'image';
                    } else if (obj.type === 'circle') {
                        icon = 'circle';
                    } else if (obj.type === 'polygon') {
                        icon = 'draw-polygon';
                    } else if (obj.type === 'line') {
                        icon = 'image';
                    } else if (obj.type === 'element') {
                        icon = 'html5';
                        prefix = 'fab';
                    } else if (obj.type === 'iframe') {
                        icon = 'window-maximize';
                    } else if (obj.type === 'video') {
                        icon = 'video';
                    } else if (obj.type === 'svg') {
                        icon = 'bezier-curve';
                    } else {
                        icon = 'image';
                        title = 'Default';
                    }

                    return (
                        <div
                            key={obj.id}
                            className='LayoutEditor-MapList-Info'
                            onClick={() => this.props.canvasRef.current.handler.select(obj)}
                            onMouseDown={e => e.preventDefault()}
                        >
                            <div className='MapList-TypeIcon'>
                                {this.renderSwitch(type)}
                            </div>
                            <Tooltip title={title} placement='top'>
                                <div className='MapList-Name'>
                                    {title}
                                </div>
                            </Tooltip>


                            <Tooltip title='삭제' placement='top'>
                                <div className='MapList-Icon'>
                                    <DeleteIcon onClick={e => {
                                        e.stopPropagation();
                                        this.props.canvasRef.current.handler.removeById(obj.id);
                                    }} />
                                </div>
                            </Tooltip>


                        </div>
                    );
                })
                : null
        );
    }
}

export default MapList;