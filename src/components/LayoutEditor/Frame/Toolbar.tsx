import * as React from 'react';

import { Flex } from '../flex';
import { Button, Tooltip } from '@material-ui/core';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter';
import DeleteIcon from '@material-ui/icons/Delete';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import LineStyleIcon from '@material-ui/icons/LineStyle';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import CropFreeIcon from '@material-ui/icons/CropFree';
import FlipToBackIcon from '@material-ui/icons/FlipToBack';
import FlipToFrontIcon from '@material-ui/icons/FlipToFront';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import SaveIcon from '@material-ui/icons/Save';
import Download from '@material-ui/icons/SaveAlt';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS';
import FormatColorTextIcon from '@material-ui/icons/FormatColorText';
import FormControl from '@material-ui/core/FormControl';
import Menu from '@material-ui/core/Menu';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { SketchPicker } from 'react-color';
import Popover from '@material-ui/core/Popover';
import InputLabel from '@material-ui/core/InputLabel';


import AssetUploadDialog from '../../Asset/Dialog/AssetUploadDialog';

// Stylesheet
import './Toolbar.scss';
import { FormatAlignCenter, FormatStrikethrough } from '@material-ui/icons';


/** Props of `Toolbar` component. */
type ToolbarProps = {
    canvasRef: any;
    selectedItem: any;
    zoomRatio: number;
    preview: boolean;
    onChangePreview: any;
    onSave: any;
    onSaveImage: any;
    children?: any;
} & InjectedIntlProps;

type ToolbarStates = {
    interactionMode: any;
    isVisible: boolean;
    type: string;
    itemMimeType: string;
    textColorPicker: boolean;
    textColorHex: string;
    anchorEl: any;
    frameBorderColorPicker: boolean;
    frameBorderColorHex: string;
    anchorEl_: any;
    frameFillPicker: boolean;
    frameFilColorHex: string;
    anchorEl__: any;
    setAnchorEl: any;
    setAnchorEl_: any;
};

class Toolbar extends React.Component<ToolbarProps, ToolbarStates> {
    constructor(props: ToolbarProps) {
        super(props);
        this.onDialog = this.onDialog.bind(this);
        this.state = {
            interactionMode: 'selection',
            isVisible: false,
            type: '',
            textColorPicker: false,
            textColorHex: '#000000',
            anchorEl: null,
            itemMimeType: '',
            frameBorderColorPicker: false,
            frameBorderColorHex: '#000000',
            anchorEl_: null,
            frameFillPicker: false,
            frameFilColorHex: '#000000',
            anchorEl__: null,
            setAnchorEl: null,
            setAnchorEl_: null
        };
    }

    componentDidMount() {
        this.waitForCanvasRender(this.props.canvasRef.current);
    }

    componentWillUnmount() {
        this.detachEventListener(this.props.canvasRef.current);
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedItem) {
            if (this.props.selectedItem !== prevProps.selectedItem) {
                this.setState({
                    type: this.props.selectedItem.type,
                    itemMimeType: this.props.selectedItem.mimeType
                });
            }
        }
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

    attachEventListener = canvasRef => {
        canvasRef.canvas.wrapperEl.addEventListener('keydown', this.events.keydown, false);
    };

    detachEventListener = canvasRef => {
        canvasRef.canvas.wrapperEl.removeEventListener('keydown', this.events.keydown);
    };

    events = {
        keydown: e => {
            if (this.props.canvasRef.canvas.wrapperEl !== document.activeElement) {
                return false;
            }
            if (e.keyCode === 81) {
                this.handlers.selection();
            } else if (e.keyCode === 87) {
                this.handlers.grab();
            }
        },
    };

    handlers = {
        selection: () => {
            if (this.props.canvasRef.current.handler.interactionHandler.isDrawingMode()) {
                return;
            }
            this.forceUpdate();
            this.props.canvasRef.current.handler.interactionHandler.selection();
            this.setState({ interactionMode: 'selection' });
        },
        grab: () => {
            if (this.props.canvasRef.current.handler.interactionHandler.isDrawingMode()) {
                return;
            }
            this.forceUpdate();
            this.props.canvasRef.current.handler.interactionHandler.grab();
            this.setState({ interactionMode: 'grab' });
        },
    };

    render() {
        const { zoomRatio, onChangePreview, preview } = this.props;
        const zoomValue = parseInt((zoomRatio * 100).toFixed(2), 10);
        const { formatMessage } = this.props.intl;
        const open = Boolean(this.state.anchorEl);
        const id = open ? 'simple-popover' : undefined;
        const frameBorderOpen = Boolean(this.state.anchorEl_);
        const frameBorderId = frameBorderOpen ? 'frameBorder-popover' : undefined;
        const frameFillOpen = Boolean(this.state.anchorEl__);
        const frameFillId = frameFillOpen ? 'frameFill-popover' : undefined;
        return (
            <>
                {
                    this.state.isVisible ?
                        <AssetUploadDialog
                            title={
                                formatMessage({
                                    id: 'app-asset.upload',
                                    defaultMessage: 'Asset Upload'
                                })
                            }
                            closeDialog={this.onDialog}
                        />
                    : null
                }
                <div className='LayoutEditor-Toolbar'>
                    <div className='Toolbar-info'>
                        <span className='Toolbar-info-icons'>
                            <Tooltip title='되돌리기' placement='top'>
                                <UndoIcon onClick={() => this.props.canvasRef.current.handler.transactionHandler.undo()} />
                            </Tooltip>
                        </span>

                        <span className='Toolbar-info-icons'>
                            <Tooltip title='되돌리기 취소' placement='top'>
                                <RedoIcon onClick={() => this.props.canvasRef.current.handler.transactionHandler.redo()} />
                            </Tooltip>
                        </span>

                        <div className='Toolbar-info-divider' />

                        <span className='Toolbar-info-icons'>
                            <Tooltip title='축소' placement='top'>
                                <ZoomOutIcon onClick={() => this.props.canvasRef.current.handler.zoomHandler.zoomOut()} />
                            </Tooltip>
                        </span>

                        <span className='Toolbar-info-icons'>
                            <Tooltip title='확대' placement='top'>
                                <ZoomInIcon onClick={() => this.props.canvasRef.current.handler.zoomHandler.zoomIn()} />
                            </Tooltip>
                        </span>

                        <span className='Toolbar-info-icons'>
                        <Tooltip title='전체 화면' placement='top'>
                            <CropFreeIcon onClick={() => this.props.canvasRef.current.handler.workareaHandler.fitWithWrokareaSize()} />
                        </Tooltip>
                    </span>

                        <div className='Toolbar-info-divider' />


                        <span className='Toolbar-info-icons'>
                            <Tooltip title='앞으로 가져오기' placement='top'>
                                <FlipToFrontIcon onClick={() => this.props.canvasRef.current.handler ? this.props.canvasRef.current.handler.bringForward() : null} />
                            </Tooltip>
                        </span>
                        <span className='Toolbar-info-icons'>
                            <Tooltip title='뒤로 보내기' placement='top'>
                                <FlipToBackIcon onClick={() => this.props.canvasRef.current.handler ? this.props.canvasRef.current.handler.sendBackwards() : null} />
                            </Tooltip>
                        </span>

                        <span className='Toolbar-info-icons'>
                            <Tooltip title='왼쪽으로 90도 회전' placement='top'>
                                <RotateLeftIcon onClick={() => this.props.canvasRef.current.handler ? this.props.canvasRef.current.handler.rotate(-90) : null} />
                            </Tooltip>
                        </span>

                        <span className='Toolbar-info-icons'>
                            <Tooltip title='오른쪽으로 90도 회전' placement='top'>
                                <RotateRightIcon onClick={() => this.props.canvasRef.current.handler ? this.props.canvasRef.current.handler.rotate(90) : null} />
                            </Tooltip>
                        </span>


                        <div className='Toolbar-info-divider' />

                        {
                            this.state.type === 'textbox' ?
                            <>
                                <span className='Toolbar-info-icons'>
                                    <Tooltip title='굵게' placement='top'>
                                        <FormatBoldIcon onClick={() => this.props.canvasRef.current.handler ? this.props.canvasRef.current.handler.alignmentHandler.bold() : null} />
                                    </Tooltip>
                                </span>
                                <span className='Toolbar-info-icons'>
                                    <Tooltip title='기울임' placement='top'>
                                        <FormatItalicIcon onClick={() => this.props.canvasRef.current.handler ? this.props.canvasRef.current.handler.alignmentHandler.italic() : null} />
                                    </Tooltip>
                                </span>
                                <span className='Toolbar-info-icons'>
                                    <Tooltip title='밑줄' placement='top'>
                                        <FormatUnderlinedIcon onClick={() => this.props.canvasRef.current.handler ? this.props.canvasRef.current.handler.alignmentHandler.underLine() : null} />
                                    </Tooltip>
                                </span>
                                <span className='Toolbar-info-icons'>
                                    <Tooltip title='취소선' placement='top'>
                                        <StrikethroughSIcon onClick={() => this.props.canvasRef.current.handler ? this.props.canvasRef.current.handler.alignmentHandler.strikethrough() : null} />
                                    </Tooltip>
                                </span>
                                <span className='Toolbar-info-icons'>
                                    <Tooltip title='색상' placement='top'>
                                        <FormatColorTextIcon aria-describedby={id} style={{color: this.state.textColorHex}} onClick={this.handleTextColorClick} />
                                    </Tooltip>
                                    <Popover
                                        id={id}
                                        open={open}
                                        anchorEl={this.state.anchorEl}
                                        onClose={this.handleClose}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                        }}
                                    >
                                        <SketchPicker color={ this.state.textColorHex } onChange={this.handleChangeColor} />
                                    </Popover>
                                </span>
                                {/* <Select className='menu-item-select'>
                                    <MenuItem value={'Arial'}>Arial</MenuItem>
                                    <MenuItem value={'Verdana'}>Verdana</MenuItem>
                                    <MenuItem value={'Times New Roman'}>Times New Roman</MenuItem>
                                    <MenuItem value={'Courier New'}>Courier New</MenuItem>
                                    <MenuItem value={'Dotum'}>돋움</MenuItem>
                                    <MenuItem value={'Gulim'}>굴림</MenuItem>
                                    <MenuItem value={'Batang'}>바탕</MenuItem>
                                    <MenuItem value={'New Gulim'}>새굴림</MenuItem>
                                </Select>
                                <Select className='menu-item-select'>
                                    <MenuItem value={9}>9</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                    <MenuItem value={14}>14</MenuItem>
                                    <MenuItem value={18}>18</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                    <MenuItem value={36}>36</MenuItem>
                                    <MenuItem value={48}>48</MenuItem>
                                    <MenuItem value={60}>60</MenuItem>
                                    <MenuItem value={72}>72</MenuItem>
                                    <MenuItem value={96}>96</MenuItem>
                                    <MenuItem value={120}>120</MenuItem>
                                    <MenuItem value={144}>144</MenuItem>
                                </Select> */}
                                <div className='Toolbar-info-divider' />
                            </>
                            : null
                        }

                        <span className='Toolbar-info-icons'>
                            <Tooltip title='삭제' placement='top'>
                                <DeleteIcon onClick={() => this.props.canvasRef.current.handler ? this.props.canvasRef.current.handler.remove() : null} />
                            </Tooltip>
                        </span>

                        <span className='Toolbar-info-icons'>
                            <Tooltip title='저장' placement='top'>
                                <SaveIcon onClick={this.props.onSave} />
                            </Tooltip>
                        </span>

                        <span className='Toolbar-info-icons'>
                            <Tooltip title='이미지 다운로드' placement='top'>
                                <Download onClick={this.props.onSaveImage} style={{ color: 'blue' }}/>
                            </Tooltip>
                        </span>

                    </div>
                </div>
            </>
        );
    }

    private onDialog(isVisible: boolean, refresh?: boolean) {
        this.setState({ isVisible });
    }

    private handleTextColorClick = (e) => {
        this.setState({ anchorEl: e.currentTarget});
    }

    private handleChangeColor = (color) => {
        this.setState({ textColorHex: color.hex });
        this.props.canvasRef.current.handler ? this.props.canvasRef.current.handler.alignmentHandler.changeColor(color.hex) : null;
    }

    private handleClose = () => {
        this.setState({ anchorEl: null});
    }
}

export default injectIntl(Toolbar);