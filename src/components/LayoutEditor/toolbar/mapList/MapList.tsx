import { Button, Input } from '@material-ui/core';
import React, { Component } from 'react';
import { Flex } from '../../flex';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import TextField from '@material-ui/core/TextField';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';

export interface MapListProps {
    canvasRef: any;
    selectedItem: any;
    children?: any;
}
export const MapList = ({canvasRef, selectedItem}: MapListProps) => {
    const renderActions = () => {
        const idCropping = canvasRef ? canvasRef.handler?.interactionMode === 'crop' : false;
        return (
            <Flex.Item className='rde-canvas-list-actions' flex='0 1 auto'>
                <Flex>
                    <TextField label='Search a Node' />
                </Flex>
                <Flex justifyContent='space-between' alignItems='center'>
                    <Flex flex='1' justifyContent='center'>
                        <ArrowUpwardIcon onClick={e => canvasRef.handler.sendBackwards()}/>
                    </Flex>
                    <Flex flex='1' justifyContent='center'>
                        <ArrowDownwardIcon onClick={e => canvasRef.handler.bringForward()}/>
                    </Flex>
                </Flex>
            </Flex.Item>
        );
    };

    const renderItem = () => {
        const idCropping = canvasRef ? canvasRef.handler?.interactionMode === 'crop' : false;
        return canvasRef
            ? canvasRef.canvas
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
                        let className = 'rde-canvas-list-item';
                        if (selectedItem && selectedItem.id === obj.id) {
                            className += ' selected-item';
                        }
                        return (
                            <Flex.Item
                                key={obj.id}
                                className={className}
                                flex='1'
                                style={{ cursor: 'pointer' }}
                                onClick={() => canvasRef.handler.select(obj)}
                                onMouseDown={e => e.preventDefault()}
                                onDoubleClick={e => {
                                    canvasRef.handler.zoomHandler.zoomToCenter();
                                }}
                            >
                                <Flex alignItems='center'>
                                    {/* <Icon
                                        className='rde-canvas-list-item-icon'
                                        name={icon}
                                        size={1.5}
                                        style={{ width: 32 }}
                                        prefix={prefix}
                                    /> */}
                                    <div className='rde-canvas-list-item-text'>{title}</div>
                                    <Flex className='rde-canvas-list-item-actions' flex='1' justifyContent='flex-end'>
                                        <FileCopyIcon onClick={e => {
                                            e.stopPropagation();
                                            canvasRef.handler.duplicateById(obj.id);
                                        }}/>
                                        <DeleteIcon onClick={e => {
                                            e.stopPropagation();
                                            canvasRef.handler.removeById(obj.id);
                                        }}/>
                                    </Flex>
                                </Flex>
                            </Flex.Item>
                        );
                    })
            : null;
    };
    return (
        <Flex style={{ height: '100%' }} flexDirection='column'>
            {renderActions()}
            <div>{renderItem()}</div>
        </Flex>
    );
};
