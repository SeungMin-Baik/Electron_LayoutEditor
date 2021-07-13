
// // import ImageMapList from './ImageMapList';

// class ImageMapHeaderToolbar extends Component {
//     static propTypes = {
//         canvasRef: PropTypes.any,
//         selectedItem: PropTypes.object,
//     };

//     render() {
//         const { canvasRef, selectedItem } = this.props;
//         const isCropping = canvasRef ? canvasRef.handler?.interactionMode === 'crop' : false;
//         return (
//             <Flex  flex='1'>
//                 <Flex.Item >
//                     <Button
//                         type='button' onClick={addText}
//                     />
//                     {/* <div className='rde-canvas-list'>
//                         <ImageMapList canvasRef={canvasRef} selectedItem={selectedItem} />
//                     </div> */}
//                 </Flex.Item>
//             </Flex>
//         );
//     }
// }

// export default ImageMapHeaderToolbar;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex } from '../flex';
import { Button } from '@material-ui/core';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter';
import DeleteIcon from '@material-ui/icons/Delete';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import FileCopyIcon from '@material-ui/icons/FileCopy';
export interface HeaderToolbarProps {
    canvasRef: any;
    selectedItem: any;
    children?: any;
}

export const HeaderToolbar = ({canvasRef}: HeaderToolbarProps) => {
    return (
        <Flex  flex='1'>
            <Flex.Item >
                <VerticalAlignCenterIcon onClick={() => canvasRef.handler?.alignmentHandler.center()}/>
                <VerticalAlignCenterIcon onClick={() => canvasRef.handler?.alignmentHandler.center()}/>
                {/* <div className='rde-canvas-list'>
                    <ImageMapList canvasRef={canvasRef} selectedItem={selectedItem} />
                </div> */}
            </Flex.Item>
            <Flex.Item >
                <FileCopyIcon onClick={() => canvasRef.handler?.duplicate()}/>
                <DeleteIcon onClick={() => canvasRef.handler?.remove()}/>
            </Flex.Item>
            <Flex.Item >
                <UndoIcon onClick={() => canvasRef.handler?.transactionHandler.undo()}/>
                <RedoIcon onClick={() => canvasRef.handler?.transactionHandler.redo()}/>
            </Flex.Item>
        </Flex>
    );
};