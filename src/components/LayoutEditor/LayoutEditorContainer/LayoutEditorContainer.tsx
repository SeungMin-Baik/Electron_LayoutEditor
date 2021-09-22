import * as React from 'react';

import * as fs from 'fs';
import { memo, useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import Canvas from '../canvas/Canvas';
import debounce from 'lodash-es/debounce';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { injectIntl, InjectedIntlProps, FormattedDate, FormattedMessage } from 'react-intl';
import { Title } from '../Frame';
import { HeadToolbar } from '../Frame';
import { PanelTab } from '../Frame';
import { Button, Switch } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { LocalPresentationDataInsertReq, PresentationDataUpdateReq } from '@app/utils/renderer/initialize/DatabaseReq';
import { writeLocalPresentationAsThumbnail } from '@app/utils/renderer/initialize/getThumbnailReq';
import { fabric } from 'fabric';
import * as moment from 'moment';

import Alert from '@app/components/AppPartial/Alert';


// Stylesheet
import './LayoutEditorContainer.scss';
import electronConfig from '@app/config/electron-config';
const propertiesToInclude = [
    'id',
    'name',
    'locked',
    'file',
    'src',
    'link',
    'tooltip',
    'animation',
    'layout',
    'workareaWidth',
    'workareaHeight',
    'videoLoadType',
    'autoplay',
    'shadow',
    'muted',
    'loop',
    'code',
    'icon',
    'userProperty',
    'trigger',
    'configuration',
    'superType',
    'points',
    'svg',
    'loadType',

    'id',
    'realType',
    'animation',
    'textEffect',
    'singleLine',
    'slideEffect',
    'assetInfo',
    'name',
    'lock',
    'events',
    'strokeWidthUnscaled',
    'styles',
    'repeat',
    'mute',
    'clipPath',
    'clipPathObject',
    'subtype',
    'crossOrigin'
];


const state = {
  selectedItem: null as any,
  zoomRatio: 1,
  preview: false,
  loading: false,
  progress: 0,
  animations: [],
  styles: [],
  dataSources: [],
  editing: false,
  descriptors: {},
  objects: undefined,
  ratioValues: ['16:9', '4:3', '1:1'],
  ratioValue: 0.5625,
  info: {
    name: 'New Template',
    desc: 'Description',
    orientation: 'LANDSCAPE',
    ratio: '16:9',
    width: 1920,
    height: 1080
  }
};


const LayoutEditorContainer = (props: any) => {

  const canvasRef = React.useRef<Canvas>();
  const [layoutEditorState, setlayoutEditorState] = useState(state);
  const [loadingCanvas, setLoadingCanvas] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [tmpHorizontal, setTmpHorizontal] = useState(1920);
  const [tmpVertical, setTmpVertical] = useState(1080);
  const [openSuccAlert, setOpenSuccAlert] = useState(false);
  const [openFailAlert, setOpenFailAlert] = useState(false);

  useEffect(() => {
      if (props.prstnId && props.prstnId.length > 0) {
        const newInfo = { ...layoutEditorState.info };
        newInfo.name = props.prstnData.FileData.name,
        newInfo.desc = props.prstnData.FileData.desc,
        newInfo.orientation = props.prstnData.FileData.orientation,
        newInfo.ratio = props.prstnData.FileData.ratio;
        newInfo.width = props.prstnData.FileData.width;
        newInfo.height = props.prstnData.FileData.height;
        setlayoutEditorState({
          ...layoutEditorState,
          info: newInfo
        });
        setActiveStep(preActiveStep => preActiveStep + 1);
      }
  }, [props.prstnId]);

  const handleOriChange = (e) => {
    const newInfo = { ...layoutEditorState.info };
    newInfo.orientation = e.target.value;
    if (newInfo.orientation === 'LANDSCAPE') {
      newInfo.ratio = '16:9';
      newInfo.width = 1920;
      newInfo.height = 1080;
      setTmpHorizontal(1920);
      setTmpVertical(1080);
      setlayoutEditorState({
        ...layoutEditorState,
        info: newInfo,
        ratioValues: ['16:9', '4:3', '1:1'],
      });
    }
    else if (newInfo.orientation === 'PORTRAIT') {
      newInfo.ratio = '9:16';
      newInfo.width = 1080;
      newInfo.height = 1920;
      setTmpHorizontal(1080);
      setTmpVertical(1920);
      setlayoutEditorState({
        ...layoutEditorState,
        info: newInfo,
        ratioValues: ['9:16', '3:4', '1:1']
      });
    }
  };

  const handleNameChange = (e) => {
    const newInfo = { ...layoutEditorState.info };
    newInfo.name = e.target.value;
    setlayoutEditorState({
      ...layoutEditorState,
      info: newInfo
    });
  };
  const handleDescChange = (e) => {
    const newInfo = { ...layoutEditorState.info };
    newInfo.desc = e.target.value;
    setlayoutEditorState({
      ...layoutEditorState,
      info: newInfo
    });
  };

  const handleHorizontal = (e) => {
    if (layoutEditorState.info.orientation === 'LANDSCAPE') {
      setTmpHorizontal(e.target.value);
      setTmpVertical((e.target.value / 16) * 9);
    } else if (layoutEditorState.info.orientation === 'PORTRAIT') {
      setTmpHorizontal(e.target.value);
      setTmpVertical((e.target.value / 9) * 16);
    }
  };

  const handleVertical = (e) => {
    if (layoutEditorState.info.orientation === 'LANDSCAPE') {
      setTmpVertical(e.target.value);
      setTmpHorizontal((e.target.value / 9) * 16);
    } else if (layoutEditorState.info.orientation === 'PORTRAIT') {
      setTmpVertical(e.target.value);
      setTmpHorizontal((e.target.value / 16) * 9);
    }

  };

  const getStepContent = stepNumber => {
    switch (stepNumber) {
      case 0:
        return (
          <>
              <div className='LayoutEditor-InfoContainer-Cover'>
                <div className='LayoutEditor-InfoContainer'>
                    <div className='LayoutEditor-InfoContainer-Title'>
                      <div className='LayoutEditor-InfoContainer-Body'>
                          <div className='Title-Info'>
                            <FormattedMessage
                              id='app-LayoutEditor.info'
                              defaultMessage='TemPlate Information'
                            />
                          </div>
                        <div className='LayoutEditor-InfoContainer-Content'>
                          <div className='Content-Name-Head'>
                            <FormattedMessage
                              id='app-LayoutEditor.neme'
                              defaultMessage='NAME'
                            />
                          </div>
                          <div className='Content-Name-TextField'>
                            <TextField className='TextField-Info' color='primary' id='outlined-basic' variant='outlined' onChange={handleNameChange} value={layoutEditorState.info.name} />
                          </div>
                        </div>
                        <div className='LayoutEditor-InfoContainer-Content'>
                          <div className='Content-Desc-Head'>
                            <FormattedMessage
                              id='app-LayoutEditor.explanation'
                              defaultMessage='EXPLANATION'
                            />
                          </div>
                          <div className='Content-Desc-TextField'>
                            <TextField className='TextField-Info' color='primary' id='outlined-basic' variant='outlined' onChange={handleDescChange} value={layoutEditorState.info.desc} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='LayoutEditor-InfoContainer-Ratio'>
                      <RadioGroup className='InfoContainer-Ratio-Group' row name='orientation' value={layoutEditorState.info.orientation} onChange={handleOriChange}>
                        <FormControlLabel className='Ratio-Info' value='LANDSCAPE' control={<Radio />} label={<FormattedMessage id='app-LayoutEditor.type.landscape' defaultMessage='Landscape Mode'/>} />
                        <FormControlLabel className='Ratio-Info' value='PORTRAIT' control={<Radio />} label={<FormattedMessage id='app-LayoutEditor.type.portrait' defaultMessage='Portrait Mode'/>} />
                      </RadioGroup>
                    </div>


                  <div className='LayoutEditor-InfoContainer-Foot'>
                      <Button className='Foot-Info' variant='contained' color='primary' onClick={handleNext}>
                        <FormattedMessage
                            id='app-common.create'
                            defaultMessage='Create'
                        />
                      </Button>
                  </div>
                </div>
              </div>
          </>
        );


      case 1:
        return (
          <div className='LayoutEditor-InnerContainer'>
            <div className='LayoutEditor-InnerContainer-Panel'>
              <PanelTab
                canvasRef={canvasRef}
                selectedItem={layoutEditorState.selectedItem}
                canvasOrientation={layoutEditorState.info.orientation}
                loadingCanvas={handleLoading}
              >
              </PanelTab>
            </div>
            <div className='LayoutEditor-InnerContainer-Canvas'>
              {
                loadingCanvas ?
                  <div className='Canvas-Loading'>
                    <CircularProgress className='Loading-Info' size={80} />
                  </div>
                : null
              }
              <Title editorTitle={layoutEditorState.info.name} editorDesc={layoutEditorState.info.desc}> </Title>

              <HeadToolbar
                canvasRef={canvasRef}
                selectedItem={layoutEditorState.selectedItem}
                zoomRatio={layoutEditorState.zoomRatio}
                preview={layoutEditorState.preview}
                onChangePreview={handlers.onChangePreview}
                onSave={handlers.onSave}
                onSaveImage={handlers.onSaveImage}
              >
              </HeadToolbar>

                  {
                    layoutEditorState.info.orientation === 'PORTRAIT' ?

                    <Canvas
                      ref={canvasRef}
                      orientation={'PORTRAIT'}
                      id={v4()}
                      width={405}
                      height={720}
                      loaded={true}
                      minZoom={10}
                      maxZoom={1000}
                      propertiesToInclude={propertiesToInclude}
                      onModified={onModified}
                      onAdd={onAdd}
                      onRemove={onRemove}
                      onSelect={onSelect}
                      onZoom={onZoom}
                      onClick={onClick}
                      onLoad={props.prstnId && props.prstnId.length ? handler => handler.editImportJSON(props.prstnData.layoutinfo) : null}
                      onTransaction={onTransaction}
                      workareaOption={{
                        width: layoutEditorState.info.width,
                        height: layoutEditorState.info.height,
                      }}
                      keyEvent={{
                        transaction: true,
                      }}
                    />

                    :

                    <Canvas
                      ref={canvasRef}
                      orientation={'LANDSCAPE'}
                      id={v4()}
                      width={1152}
                      height={648}
                      loaded={true}
                      propertiesToInclude={propertiesToInclude}
                      onModified={onModified}
                      onAdd={onAdd}
                      onRemove={onRemove}
                      onSelect={onSelect}
                      onZoom={onZoom}
                      onClick={onClick}
                      onLoad={props.prstnId && props.prstnId.length ? handler => handler.editImportJSON(props.prstnData.layoutinfo) : null}
                      onTransaction={onTransaction}
                      workareaOption={{
                        width: layoutEditorState.info.width,
                        height: layoutEditorState.info.height,
                      }}
                      keyEvent={{
                        transaction: true,
                      }}
                    />

                  }
            </div>
          </div>
        );
    }
  };

  const handleNext = () => {
    setActiveStep(preActiveStep => preActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(preActiveStep => preActiveStep - 1);
  };

  const handleLoading = (load: boolean) => {
    setLoadingCanvas(load);
  };

  const changeEditing = (editing: any) => {
    setlayoutEditorState({
      ...layoutEditorState,
      editing
    });
  };

  const canvasHandlers = {
    onAdd: function (target) {
      // console.log(target);
      const { editing } = layoutEditorState;

      setlayoutEditorState({
        ...layoutEditorState
      });

      if (!editing) {
        changeEditing(true);
      }
      if (target.type === 'activeSelection') {
        canvasHandlers.onSelect(null);
        return;
      }
      canvasRef.current.handler.select(target);
    },


    onSelect: function (target: any) {
      console.log('onSelect');
      console.log(target);
      const { selectedItem } = layoutEditorState;
      if (
        target &&
        target.id &&
        target.id !== 'workarea' &&
        target.type !== 'activeSelection'
      ) {
        if (selectedItem && target.id === selectedItem.id) {
          return;
        }
        setlayoutEditorState({
          ...layoutEditorState,
          selectedItem: target
        });
        canvasRef.current.handler.getObjects().forEach(obj => {
          if (obj) {
            canvasRef.current.handler.animationHandler.resetAnimation(obj, true);
          }
        });
        return;
      }
    },


    onRemove: () => {
      // console.log('onRemove');
      const { editing } = layoutEditorState;
      setlayoutEditorState({
        ...layoutEditorState,
        editing
      });
      if (!editing) {
        changeEditing(true);
      }
      canvasHandlers.onSelect(null);
    },

    onModified: debounce((target: any) => {
      const { editing } = layoutEditorState;
      setlayoutEditorState({
        ...layoutEditorState,
        editing
      });
      // forceUpdate();
      if (!editing) {
        changeEditing(true);
      }
      canvasHandlers.onSelect(target);
    }, 300),


    onZoom: (zoom: any) => {
      // console.log('onZoom');
      setlayoutEditorState({
        ...layoutEditorState,
        zoomRatio: zoom * 2,
      });
    },


    onChangeWokarea: (changedKey: any, changedValue: any, allValues: any) => {
      if (changedKey === 'layout') {
        canvasRef.current.handler.workareaHandler.setLayout(changedValue);
        return;
      }

      if (changedKey === 'file' || changedKey === 'src') {
        canvasRef.current.handler.workareaHandler.setImage(changedValue);
        return;
      }

      if (changedKey === 'width' || changedKey === 'height') {
        canvasRef.current.handler.originScaleToResize(
          canvasRef.current.handler.workarea,
          allValues.width,
          allValues.height
        );
        canvasRef.current.canvas.centerObject(canvasRef.current.handler.workarea);
        return;
      }
      canvasRef.current.handler.workarea.set(changedKey, changedValue);
      canvasRef.current.canvas.requestRenderAll();
    },


    onClick: (canvas: any, target: any) => {
      const { link } = target;
      if (link.state === 'current') {
        document.location.href = link.url;
        return;
      }
      window.open(link.url);
    },


    onTransaction: (transaction: any) => {
      // forceUpdate();
    },
  };
  const {
    onAdd,
    onRemove,
    onSelect,
    onModified,
    onZoom,
    onClick,
    onTransaction,
  } = canvasHandlers;


  const handlers = {
    onChangePreview: event => {
      // console.log(canvasRef);
      let checked;
      if (event.target.checked) {
        checked = event.target.checked;
      }
      else {
        checked = event;
      }

      let data;
      if (canvasRef.current) {
        data = canvasRef.current.handler.exportJSON().filter(obj => {
          if (!obj.id) {
            return false;
          }
          return true;
        });
      }
      setlayoutEditorState({
        ...layoutEditorState,
        preview: typeof checked === 'object' ? false : checked,
        objects: data,
      });
    },
    onProgress: progress => {
      setlayoutEditorState({
        ...layoutEditorState,
        progress,
      });
    },
    onImport: files => {
      if (files) {
        showLoading(true);
        setTimeout(() => {
          const reader = new FileReader();
          reader.onprogress = e => {
            if (e.lengthComputable) {
              const progress = ((e.loaded / e.total) * 100, 10);
              handlers.onProgress(progress);
            }
          };
          reader.onload = e => {
            const { objects, animations, styles, dataSources } = JSON.parse(e.target.result as string);
            setlayoutEditorState({
              ...layoutEditorState,
              animations,
              styles,
              dataSources,
            });
            if (objects) {
              canvasRef.current.handler.clear(true);
              const data = objects.filter(obj => {
                if (!obj.id) {
                  return false;
                }
                return true;
              });
              canvasRef.current.handler.importJSON(data);
            }
          };
          reader.onloadend = () => {
            showLoading(false);
            canvasRef.current.canvas.zoomToPoint(new fabric.Point(canvasRef.current.canvas.width / 2, canvasRef.current.canvas.height / 2), canvasRef.current.canvas.getZoom() / 2);
            canvasRef.current.canvas.renderAll();
          };
          reader.onerror = () => {
            showLoading(false);
          };
          reader.readAsText(files[0]);
        }, 500);
      }
    },
    onUpload: () => {
      const inputEl = document.createElement('input');
      inputEl.accept = '.json';
      inputEl.type = 'file';
      inputEl.hidden = true;
      inputEl.onchange = e => {
        const event = e.target as HTMLInputElement;
        handlers.onImport(event.files);
      };
      document.body.appendChild(inputEl); // required for firefox
      inputEl.click();
      inputEl.remove();
    },
    onDownload: () => {
      showLoading(true);
      const objects = canvasRef.current.handler.exportJSON().filter(obj => {
        if (!obj.id) {
          return false;
        }
        return true;
      });

      const { animations, styles, dataSources } = layoutEditorState;
      const exportDatas = {
        objects,
        animations,
        styles,
        dataSources,
      };
      const anchorEl = document.createElement('a');
      anchorEl.href = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(exportDatas, null, '\t'),
      )}`;
      anchorEl.download = `${canvasRef.current.handler.workarea.name || 'sample'}.json`;
      document.body.appendChild(anchorEl); // required for firefox
      anchorEl.click();
      anchorEl.remove();
      showLoading(false);
    },
    onSaveImage: () => {
      canvasRef.current.handler.saveCanvasImage();
    },

    onSave: async () => {

      // 현재 캔버스에 있는 객체들 가져옴 (objects -> Array)
      const objects = canvasRef.current.handler.exportJSON().filter(obj => {
        if (!obj.id) {
          return false;
        }
        return true;
      });

      let prstnId = '';

      if (props.prstnId && props.prstnId.length > 0) {
        prstnId = props.prstnId;
      } else {
        prstnId = (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
          (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
          (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
          (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
          (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1)) +
          (((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1));
      }

      // Set Presentation Info
      const prstnInfo = {
        _id: prstnId,
        name: layoutEditorState.info.name,
        desc: layoutEditorState.info.desc,
        orientation: layoutEditorState.info.orientation,
        ratio: layoutEditorState.info.ratio,
        width: layoutEditorState.info.width,
        height: layoutEditorState.info.height,
        isLocal: true,
        regions: null,
        assets: null,
        layoutinfo: null,
        createdDate: moment().format()
      };

      // Set desgin data
      const prstnDesign = [];
      let zOrder = 0;
      objects.map((asset) => {
        let object;
        // 공통 프로퍼티 (좌표, 세로, 가로 길이)
        if (asset.assetid || asset.type === 'textbox' || asset.type === 'path') {

          const commonProperty = {
            x: null,
            y: null,
            width: null,
            height: null,
            zOrder: zOrder + 1,
            rotate: asset.angle,
          };
          /*
          The left and top positions are not 0,0, and this is a calculation considering the size of the work area and the resolution of the player being transmitted.
          */
          if (layoutEditorState.info.orientation === 'LANDSCAPE') {
                commonProperty.width = asset.width * asset.scaleX / 2 * (layoutEditorState.info.width / 1152);
                commonProperty.height = asset.height * asset.scaleY / 2 * (layoutEditorState.info.height / 648);
                commonProperty.x = (576 + (asset.left)) / 2 * (layoutEditorState.info.width / 1152);
                commonProperty.y = (324 + (asset.top)) / 2 * (layoutEditorState.info.height / 648);
          }
          else {
            if (asset.assetid === 'Input') {
                commonProperty.width = (asset.width) * asset.scaleX / 2 * (layoutEditorState.info.width / 405);
                commonProperty.height = (asset.height) * asset.scaleY / 2 * (layoutEditorState.info.height / 720);
                commonProperty.x = (202.5 + (asset.left)) / 2 * (layoutEditorState.info.width / 405);
                commonProperty.y = (360 + (asset.top)) / 2 * (layoutEditorState.info.height / 720);
            }
            else {
                commonProperty.width = (asset.width) * asset.scaleX / 2 * (layoutEditorState.info.width / 405);
                commonProperty.height = (asset.height) * asset.scaleY / 2 * (layoutEditorState.info.height / 720);
                commonProperty.x = (202.5 + (asset.left)) / 2 * (layoutEditorState.info.width / 405);
                commonProperty.y = (360 + (asset.top)) / 2 * (layoutEditorState.info.height / 720);
            }
          }

          // Text
          if (asset.type === 'textbox') {
            const textProperty = {
              type: 'TEXT',
              properties: {
                align: 'center',
                textEffect: {
                  code: 'none',
                  speed: 10,
                  repeat: false
                },
                text: asset.text,
                name: asset.text,
                fontName: asset.fontFamily,
                fontStyle: {
                  bold: false,
                  italic: false,
                  underline: false,
                  strikethrough: false
                },
                fontSize: asset.fontSize,
                fontColor: asset.fill,
                strokeWidth: 0,
                strokeColor: null,
                shadowDX: 1,
                shadowDY: 1,
                shadowRadius: 1,
                shadowColor: '#00000000',
                textLineSpacing: 1.16,
                singleLine: false
              },
              lock: false
            };
            object = { ...commonProperty, ...textProperty };
          }
          // Image
          if (asset.mimeType === 'IMAGE') {
            const imageProperty = {
              type: 'IMAGE',
              properties: {
                id: asset.assetid,
                fileType: asset.fileType,
                name: asset.name,
                md5: asset.md5,
                mimeType: asset.mimeType,
              },
            };
            object = { ...commonProperty, ...imageProperty };
          }
          // Video
          if (asset.mimeType === 'VIDEO') {
            const videoProperty = {
              type: 'VIDEO',
              properties: {
                id: asset.assetid,
                fileType: asset.fileType,
                name: asset.name,
                md5: asset.md5,
                mimeType: asset.mimeType,
                repeat: true,
                mute: false
              },
            };
            object = { ...commonProperty, ...videoProperty };
          }

          // Insert object to presentation design array
          prstnDesign.push(object);
        }
        // Z-order (Sequence of array)
        zOrder++;

      });

      // Set Presentation AssetList
      const prstnAssetList = [];
      objects.map((asset) => {
        if (asset.assetid && asset.mimeType !== 'INPUT_SOURCE') {
          // Set asset object
          const assetObject = {
            id: asset.assetid,
            name: asset.name,
            md5: asset.md5,
            fileType: asset.fileType,
            mimeType: asset.mimeType
          };
          // Push asset info
          prstnAssetList.push(assetObject);
        }
      });

      // Set Presentation Thumbnail
      const prstnThumbnail = canvasRef.current.canvas.toDataURL();

      // Merge Presestiaion info
      const prstnData = { ...prstnInfo };
      prstnData.regions = prstnDesign;
      prstnData.assets = prstnAssetList;
      prstnData.layoutinfo = objects;

      try {
        if (props.prstnId && props.prstnId.length > 0) {
          PresentationDataUpdateReq(prstnData);
          if (fs.existsSync(`${electronConfig.APP.DIR_PATH.THUMBNAIL_PATH}/${props.prstnId}_thumb`)) {
              fs.unlinkSync(`${electronConfig.APP.DIR_PATH.THUMBNAIL_PATH}/${props.prstnId}_thumb`);
          }
          setTimeout(() => {
            writeLocalPresentationAsThumbnail(prstnThumbnail, props.prstnId);
            handleOpenAlert(true, true);
          }, 1000);

        } else {
          LocalPresentationDataInsertReq(prstnData);
          writeLocalPresentationAsThumbnail(prstnThumbnail, prstnId);
          handleOpenAlert(true, true);
        }
      } catch (error) {
        handleOpenAlert(true, false);
      }
    }
  };


  const showLoading = loading => {
    setlayoutEditorState(loading);
  };

  const handleOpenAlert = (open, succ?) => {
    if (open) {
      if (succ) {
        setOpenSuccAlert(open);
      } else {
        setOpenFailAlert(open);
      }
    } else {
      setOpenFailAlert(open);
      setOpenSuccAlert(open);
    }
  };


  return (
      <div className='cbkApp-LayoutEditorContainer'>
        {
          openSuccAlert ?
            <Alert isOpen={handleOpenAlert} type='SAVE_SUCCESS' />
          : null
        }
        {
          openFailAlert ?
            <Alert isOpen={handleOpenAlert} type='SAVE_FAIL' />
          : null
        }
        {
          getStepContent(activeStep)
        }
      </div>
  );

};

export default LayoutEditorContainer;