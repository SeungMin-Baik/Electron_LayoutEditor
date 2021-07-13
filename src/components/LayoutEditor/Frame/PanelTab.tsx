import * as React from 'react';

import { injectIntl, InjectedIntlProps } from 'react-intl';

import ImageDataList from '@app/components/Asset/AssetDataList';
import PresentationDataList from '@app/components/Presentation/PresentationDataList';
import MapList from '../mapList/MapList';

import { apiAsset } from '@app/apis/asset';
import { apiPresentation } from '@app/apis/presentation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIcons } from '@fortawesome/pro-regular-svg-icons/faIcons';
import { faImages } from '@fortawesome/pro-regular-svg-icons/faImages';
import { faVideo } from '@fortawesome/pro-regular-svg-icons/faVideo';
import { faText } from '@fortawesome/pro-regular-svg-icons/faText';
import { faThermometerFull } from '@fortawesome/pro-regular-svg-icons/faThermometerFull';
import { faThList } from '@fortawesome/pro-solid-svg-icons/faThList';
import { faShapes } from '@fortawesome/pro-regular-svg-icons/faShapes';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { v4 } from 'uuid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import InputAdornment from '@material-ui/core/InputAdornment';

// Stylesheet
import './PanelTab.scss';
import { Button, Tooltip } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { constrainPoint } from '@fullcalendar/core';
import { DoubleArrowTwoTone } from '@material-ui/icons';
import * as INPUTSOURCE from '../../../../public/media/inputcamera.png';

import * as fs from 'fs';
import electronConfig from '@app/config/electron-config';

import Alert from '@app/components/AppPartial/Alert';


/** Props of `EditorTab` component. */
type EditorTabProps = {
    canvasRef: any;
    selectedItem: any;
    children?: any;
    canvasOrientation?: string;
    loadingCanvas?: Function;
} & InjectedIntlProps;

type EditorTabStates = {
    render: string;
    textFieldValue: string;
    textSizeValue: number;
    textFamilyValue: string;
    findThumbnails: Array<any>;
    layoutInfoData: Array<any>;
    importStates: string;
    openAlert: boolean;
};

const editorFontFamily = [
    'Anton', 'Black Han Sans', 'Coming Soon', 'Dokdo', 'Gaegu', 'Gothic A1', 'Hi Melody', 'Josefin Sans', 'Lobster', 'Lora', 'Nanum Brush Script',
    'Nanum Gothic Coding', 'Nanum Myeongjo', 'Nanum Pen Script', 'Open Sans', 'Oswald', 'Patrick Hand SC', 'Roboto', 'Black And White Pucture', 'Cute Font',
    'Do Hyeon', 'East Sea Dokdo', 'Gugi', 'Hanna', 'Jeju Gothic', 'Jeju Hallasan', 'Jeju Myeongjo', 'Jua', 'Kirang Haerang', 'KoPub Batang', 'Poor Story',
    'Song Myung', 'Stylish', 'Sunflower', 'Yeon Sung'
];

const editorFontSize = [
    9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96, 120, 144
];

class PanelTab extends React.Component<EditorTabProps & InjectedIntlProps, EditorTabStates> {
    private message: any = '';
    private item: any = '';
    private itemText: any = {
        id: v4(),
        option: {
            type: 'textbox',
            text: '',
            fontSize: 70,
            width: 300,
            height: 79.1,
        }
    };

    private EditorList = [
        {
            id: 'app-layoutEditor.list.text',
            defaultName: 'Text',
            icon: faText,
            path: 'Text'
        },
        {
            id: 'app-layoutEditor.list.image',
            defaultName: 'Image',
            icon: faImages,
            path: 'Image'
        },
        {
            id: 'app-layoutEditor.list.video',
            defaultName: 'Video',
            icon: faVideo,
            path: 'Video'
        },
        {
            id: 'app-layoutEditor.list.template',
            defaultName: 'Template',
            icon: faIcons,
            path: 'Template'
        },
        {
            id: 'app-layoutEditor.list.figure',
            defaultName: 'Figure',
            icon: faShapes,
            path: 'Figure'
        },
        // {
        //     id: 'app-layoutEditor.list.input',
        //     defaultName: 'Thermal Camera',
        //     icon: faThermometerFull,
        //     path: 'Input'
        // },
        {
            id: 'app-layoutEditor.list.list',
            defaultName: 'Layer List',
            icon: faThList,
            path: 'List'
        },
    ];
    constructor(props: EditorTabProps) {
        super(props);
        this.renderContent = this.renderContent.bind(this);
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.handleTextSizeChange = this.handleTextSizeChange.bind(this);
        this.handleTextFamilyChange = this.handleTextFamilyChange.bind(this);
        this.findThumbnail = this.findThumbnail.bind(this);
        this.state = {
            render: 'Image',
            textFieldValue: 'New text',
            textSizeValue: 30,
            textFamilyValue: 'Anton',
            findThumbnails: [],
            layoutInfoData: [],
            importStates: '',
            openAlert: false
        };
    }
    componentDidMount() {
        // const { canvasRef } = this.props;
        // this.waitForCanvasRender(canvasRef);
        this.waitForCanvasRender(this.props.canvasRef.current);
        this.findThumbnail();
    }
    componentWillUnmount() {
        // const { canvasRef } = this.props;
        // this.detachEventListener(canvasRef);
    }
    componentDidUpdate() {
    }

    render() {
        const { formatMessage } = this.props.intl;
        const editorDrawerList = (
            <div className='editorMenu-list'>
                {this.EditorList.map(editor => {

                    return (
                        <Tooltip title={editor.defaultName} placement='top'>
                            <div
                                className={editor.path === this.state.render ? 'editorMenu-item' : 'editorMenu-item-unselect'}
                                onClick={() => this.selectMenu(editor.path)}
                            >
                                    <FontAwesomeIcon icon={editor.icon} />
                                {
                                    /* <ListItemText
                                        className='item-text'
                                        primary={
                                            formatMessage({
                                                id: editor.id,
                                                defaultMessage: editor.defaultName
                                            })
                                        }
                                    /> */
                                }
                            </div>
                        </Tooltip>
                    );
                }
                )}

            </div>
        );
        return (
        <>
            {
                this.state.openAlert ?
                    <Alert isOpen={this.handleOpenAlert} type='TOO_BIG'/>
                : null
            }
            <div className='LayoutEditor-PanelTab'>
                <div className='LayoutEditor-Tab'>
                    <div className='LayoutEditor-Tab-info'>
                        {editorDrawerList}
                    </div>
                </div>
                <div className='LayoutEditor-Panel'>
                    {this.renderContent(this.state.render)}
                </div>
            </div>
        </>
        );
    }

    private selectMenu(value: string) {
        this.setState({
            render: value
        });
    }

    private handleTextFieldChange(e: any) {
        this.setState({
            textFieldValue: e.target.value
        });
    }

    private handleTextSizeChange(e: React.ChangeEvent<{value: any}>) {
        this.setState({
            textSizeValue: e.target.value
        });
    }

    private handleTextFamilyChange(e: any) {
        this.setState({
            textFamilyValue: e.target.value
        });
    }

    private findThumbnail() {
        const i = 1;
        let thumbfiles = [];
        try {
            thumbfiles = fs.readdirSync(electronConfig.APP.DIR_PATH.THUMBNAIL_PATH);
        } catch (err) {
            console.error(err);
        }
        setTimeout(() => {
            this.setState({
                findThumbnails: thumbfiles
            });
        }, i * 100);
    }


    private renderContent(path: string) {
        switch (path) {
            case 'Template':
                return (
                    <PresentationDataList
                        head={[]}
                        defaultSort={{
                            sort: 'updateDate',
                            order: 'DESC'
                        }}
                        filter={{
                            key: 'owner',
                            operator: '=',
                            value: 'mine'
                        }}
                        api={apiPresentation}
                        isSend={false}
                        isEditor={true}
                        onDragStart={(e, item) => this.events.onDragStart(e, item)}
                        onDragEnd={(e, item) => this.events.onDragEnd(e)}
                    />
                );

            case 'Image':
                return (
                    <ImageDataList
                        head={[]}
                        defaultSort={{
                            sort: 'updateDate',
                            order: 'DESC'
                        }}
                        filters={{
                            key: 'mimeType',
                            operator: '=',
                            value: 'IMAGE'
                        }}
                        api={apiAsset}
                        saveSelectMedia={() => ''}
                        isSend={false}
                        isSelect={false}
                        isEditor={true}
                        onDragStart={(e, item) => this.events.onDragStart(e, item)}
                        onDragEnd={(e, item) => this.events.onDragEnd(e)}
                    />
                );

            case 'Video':
                return (
                    <ImageDataList
                        head={[]}
                        defaultSort={{
                            sort: 'updateDate',
                            order: 'DESC'
                        }}
                        filters={{
                            key: 'mimeType',
                            operator: '=',
                            value: 'VIDEO'
                        }}
                        api={apiAsset}
                        saveSelectMedia={() => ''}
                        isSend={false}
                        isSelect={false}
                        isEditor={true}
                        onDragStart={(e, item) => this.events.onDragStart(e, item)}
                        onDragEnd={(e, item) => this.events.onDragEnd(e)}
                    />
                );

            case 'Figure':
                return (
                    <ImageDataList
                        head={[]}
                        defaultSort={{
                            sort: 'updateDate',
                            order: 'DESC'
                        }}
                        filters={{
                            key: 'mimeType',
                            operator: '=',
                            value: 'FRAME'
                        }}
                        api={apiAsset}
                        saveSelectMedia={() => ''}
                        isSend={false}
                        isSelect={false}
                        isEditor={true}
                        onDragStart={(e, item) => this.events.onDragStart(e, item)}
                        onDragEnd={(e, item) => this.events.onDragEnd(e)}
                    />
                );

            case 'Input':
                return (
                    <ImageDataList
                        head={[]}
                        defaultSort={{
                            sort: 'updateDate',
                            order: 'DESC'
                        }}
                        filters={{
                            key: 'mimeType',
                            operator: '=',
                            value: 'INPUT_SOURCE'
                        }}
                        api={apiAsset}
                        saveSelectMedia={() => ''}
                        isSend={false}
                        isSelect={false}
                        isEditor={true}
                        onDragStart={(e, item) => this.events.onDragStart(e, item)}
                        onDragEnd={(e, item) => this.events.onDragEnd(e)}
                    />
                );

            case 'Text':
                return (
                    <List>
                        <ListItem className='panel-text'>
                            <Select
                                className='panel-textSelect'
                                value={this.state.textFamilyValue}
                                onChange={this.handleTextFamilyChange}
                            >
                                {
                                    editorFontFamily.map(font => {
                                        return (
                                        <MenuItem value={font}>{font}</MenuItem>
                                        );
                                    })
                                }
                            </Select>
                            {/* <Select
                                className='panel-textSelect'
                                value={this.state.textSizeValue}
                                onChange={this.handleTextSizeChange}
                            >
                                {
                                    editorFontSize.map(size => {
                                        return (
                                            <MenuItem value={size}>{size}</MenuItem>
                                        );
                                    })
                                }
                            </Select> */}
                        </ListItem>
                        <ListItem className='panel-text'>
                            <TextField
                                label='텍스트를 입력하세요'
                                className='panel-textInput'
                                multiline
                                rows={4}
                                variant='outlined'
                                value={this.state.textFieldValue}
                                onChange={this.handleTextFieldChange}
                            />
                        </ListItem>

                        <div className='panel-text-description'> 아래 텍스트를 원하는 위치에 끌어놓으세요. </div>
                        <Tooltip title='텍스트를 원하는 위치에 끌어놓으세요' placement='top'>
                            <ListItem
                                className='panel-text'
                                onDragStart={(e) => this.events.onDragStart(e, this.itemText)}
                                onDragEnd={(e) => this.events.onDragEnd(e)}
                                button
                            >
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                              <ZoomOutMapIcon className='drag-icon'/>
                                            </InputAdornment>
                                          ),
                                    }}
                                    multiline
                                    rows={4}
                                    className='panel-textResult'
                                    draggable='true'
                                    variant='outlined'
                                    value={this.state.textFieldValue}
                                    onDragStart={(e) => this.events.onDragStart(e, this.itemText)}
                                    onDragEnd={(e) => this.events.onDragEnd(e)}
                                    // onChange={this.handleTextFieldChange}
                                />
                            </ListItem>
                        </Tooltip>

                    </List>
                );

            case 'List':
                return (
                    <MapList canvasRef={this.props.canvasRef} selectedItem={this.props.selectedItem}/>
                );

            default:
                return;
        }
    }

    handleOpenAlert = (open) => {
        this.setState({
            openAlert: open
        });
    }

    waitForCanvasRender = canvas => {
        setTimeout(() => {
            if (canvas) {
                this.attachEventListener(canvas);
                return;
            }
            this.waitForCanvasRender(this.props.canvasRef.current);
        }, 5);
    };
    attachEventListener = canvas => {
        canvas.canvas.wrapperEl.addEventListener('dragenter', this.events.onDragEnter, false);
        canvas.canvas.wrapperEl.addEventListener('dragover', this.events.onDragOver, false);
        canvas.canvas.wrapperEl.addEventListener('dragleave', this.events.onDragLeave, false);
        canvas.canvas.wrapperEl.addEventListener('drop', this.events.onDrop, false);
    };
    detachEventListener = canvas => {
        canvas.canvas.wrapperEl.removeEventListener('dragenter', this.events.onDragEnter);
        canvas.canvas.wrapperEl.removeEventListener('dragover', this.events.onDragOver);
        canvas.canvas.wrapperEl.removeEventListener('dragleave', this.events.onDragLeave);
        canvas.canvas.wrapperEl.removeEventListener('drop', this.events.onDrop);
    };
    private handlers = {

        onAddItem: (item: any, centered: any) => {
            console.log('add', item);
            const { canvasRef } = this.props;
            if (canvasRef.current.handler.interactionMode === 'polygon') {
                this.message.info('Already drawing');
                return;
            }
            const id = v4();
            // const option = Object.assign({}, item.option, { id });
            const option = Object.assign({}, item.option, { id });

            if (item.mimeType === 'FRAME') {
                canvasRef.current.handler.addSvg(option);
            } else {
                canvasRef.current.handler.add(option, centered);
            }
        },
    };
    private events = {
        onDragStart: (e: any, item: any) => {
            console.log('this.item', item);
            this.findThumbnail();
            this.item = item;
            const { target } = e;
            target.classList.add('dragging');
        },
        onDragOver: (e: any) => {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'copy';
            return false;
        },
        onDragEnter: (e: any) => {
            const { target } = e;
            target.classList.add('over');
            const { canvasRef } = this.props;
        },
        onDragLeave: (e: any) => {
            const { target } = e;
            target.classList.remove('over');
        },
        onDrop: (e: any) => {
            e = e || window.event;
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }

            const { layerX, layerY } = e;
            const dt = e.dataTransfer;
            let newItem;
            let option;

            const { canvasRef } = this.props;

            const targetObject = canvasRef.current.canvas.findTarget(e);

            if (targetObject.id !== 'workarea') {
                if (this.item.FileData.mimeType === 'IMAGE' && targetObject.mimeType === 'IMAGE') {
                    canvasRef.current.handler.replaceImage(targetObject, this.item);
                }
            } else {

            // Thermal camera
            if (this.item === 'Input') {
                const inputImage = new Image();
                inputImage.src = INPUTSOURCE;

                option = Object.assign({}, this.item.option, {
                    assetid: 'Input',
                    type: 'image',
                    name: 'Input Camera',
                    src: INPUTSOURCE,
                    mimeType: 'INPUT_SOURCE',
                    left: layerX,
                    top: layerY,
                    width: 608,
                    height: 342,
                    crossOrigin: 'anonymous'
                });

            }
            // Asset
            else {
                // Local data
                if (this.item.FileData) {
                    if (this.item.FileData.mimeType && this.item.FileData.mimeType === 'IMAGE') {

                        option = Object.assign({}, this.item.option, {
                            assetid: this.item._id,
                            type: 'image',
                            md5: this.item.FileData.md5,
                            fileType: this.item.FileData.fileType,
                            mimeType: this.item.FileData.mimeType,
                            name: this.item.FileData.name,
                            src: electronConfig.APP.DIR_PATH.THUMBNAIL_PATH + '/' + this.state.findThumbnails.filter(x => x === (this.item._id + '_thumb.png')),
                            left: layerX,
                            top: layerY,
                            // width: this.item.FileData.width,
                            // height: this.item.FileData.height,
                            crossOrigin: 'anonymous'
                        });
                    }
                    if (this.item.FileData.mimeType && this.item.FileData.mimeType === 'VIDEO') {
                        option = Object.assign({}, this.item.option, {
                            assetid: this.item._id,
                            type: 'image',
                            md5: this.item.FileData.md5,
                            fileType: this.item.FileData.fileType,
                            mimeType: this.item.FileData.mimeType,
                            name: this.item.FileData.name,
                            src: electronConfig.APP.DIR_PATH.THUMBNAIL_PATH + '/' + this.state.findThumbnails.filter(x => x === (this.item._id + '_thumb.png')),
                            left: layerX,
                            top: layerY,
                            crossOrigin: 'anonymous'
                        });
                    }
                    if (this.item.FileData.type && this.item.FileData.type === 'presentation') {

                        let tmpData = [];
                        tmpData = this.item.layoutinfo;
                        this.props.loadingCanvas(true);
                        canvasRef.current.handler.importJSON(this.item.layoutinfo)
                        .then(() => {
                            setTimeout(() => {
                                const objects = canvasRef.current.handler.exportJSON().filter(obj => {
                                    if (!obj.id) {
                                        return false;
                                    }
                                    return true;
                                });

                                const tmpSort = [];

                                for (let i = 0; i < tmpData.length; i++) {
                                    objects.map(object => {
                                        if (object.id === tmpData[i].id) {
                                            tmpSort.push(object);
                                        }
                                    });
                                }

                                for (let i = tmpSort.length - 1; i > 0; i--) {
                                    const existObject = canvasRef.current.canvas.getObjects().filter(obj => obj.id === tmpSort[i].id);
                                    canvasRef.current.handler.sendToBack(existObject[0]);
                                }

                                const existObject = canvasRef.current.canvas.getObjects();
                                existObject.map(object => {
                                    if (object.type === 'textbox') {
                                        if (object['fontFamily'] === '') {
                                            object['fontFamily'] === 'Anton';
                                        } else {
                                            object['fontFamily'] === object.fontFamily;
                                        }
                                        object.set({dirty: true});
                                        canvasRef.current.canvas.requestRenderAll();
                                    }
                                });

                                this.props.loadingCanvas(false);
                            }, 1000);
                        });
                    }
                } else if (this.item.mimeType && this.item.mimeType === 'FRAME') {
                    option = Object.assign({}, this.item.option, {
                        assetid: this.item.id,
                        type: 'svg',
                        md5: this.item.md5,
                        fileType: this.item.fileType,
                        mimeType: this.item.mimeType,
                        name: this.item.name,
                        src: this.item.img,
                        left: layerX,
                        top: layerY,
                        // width: this.item.FileData.width,
                        // height: this.item.FileData.height,
                        crossOrigin: 'anonymous'
                    });
                } else {
                    option = Object.assign({}, this.item.option, {
                        type: 'textbox',
                        text: this.state.textFieldValue,
                        fontFamily: this.state.textFamilyValue,
                        left: layerX,
                        top: layerY,
                        crossOrigin: 'anonymous'
                    });
                }
            }

            if ((this.item.FileData && this.item.FileData.type === 'presentation')) {
                return false;
            } else {
                newItem = Object.assign({}, this.item, { option });

                // Max image size (1920 * 1080)
                if (newItem.width > 1920 || newItem.height > 1080) {
                    this.handleOpenAlert(true);
                    return false;
                }
                else {
                    this.handlers.onAddItem(newItem, false);
                    this.setState({
                        textFieldValue: 'New Text',
                        textSizeValue: 80
                    });
                }
            }
        }

        },
        onDragEnd: (e: any) => {
            this.item = '';
            e.target.classList.remove('dragging');
        },
    };
}
export default injectIntl(PanelTab);