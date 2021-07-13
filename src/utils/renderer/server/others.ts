import store from '../../../store';

import * as decompress from 'decompress';

import { MD5 } from '../../others';

import * as fs from 'fs';

import * as path from 'path';

import * as moment from 'moment';

import * as FileSaver from 'file-saver';
import * as JSZipUtils from 'jszip-utils';

import { uploadAssetZipHttp, uploadPresentationZipHttp, uploadInstantMessageZipHttp, uploadPlaylistZipHttp, uploadScheduleZipHttp } from './HTTPServerIpc';
import electronConfig from '@app/config/electron-config';

import { getPresentationDesign } from '@app/apis/presentation/presentationApi';

import { InstantMessageDatabaseFindOneReq } from '@app/utils/renderer/initialize/DatabaseReq';

export function createMessageKey() {

    const nowTime = new Date();

    const userId = store.getState().appAuth.userData.id;
    const getGMT = moment.utc(nowTime).format('YYYYMMDDHH');
    const key = userId + getGMT;
    const result = MD5(key);

  return result;
}

export function createDecryptionKey() {

  let key: any = '';

    const today = new Date();
    const year = today.getUTCFullYear();
    let date: any = today.getUTCDate();
    let month: any = today.getUTCMonth();
    let hour: any = today.getUTCHours();

    if ((++month) < 10) {
        month = '0' + month.toString();
    }

    if (date < 10) {
        date = '0' + date.toString();
    }

    if (hour < 10) {
        hour = '0' + hour.toString();
    }

    key = key.concat(year.toString(), month.toString(), date.toString(), hour.toString(), month.toString(), year.toString());

  return key;
}

export function createActivateToken(pinCode: any) {

    let key: any = '';

    const today = new Date();
    const year = today.getUTCFullYear();
    let date: any = today.getUTCDate();
    let month: any = today.getUTCMonth();
    let hour: any = today.getUTCHours();

    if ((++month) < 10) {
        month = '0' + month.toString();
    }

    if (date < 10) {
        date = '0' + date.toString();
    }

    if (hour < 10) {
        hour = '0' + hour.toString();
    }

  key = key.concat(year.toString(), month.toString(), date.toString(), hour.toString());
  // const resultKey = 'CUBLICKproduct01' + `${pinCode}` + key;
  const resultKey = 'CUBLICKproduct01' + `${pinCode}`;
  const result = MD5(resultKey);

  return result;
}

export function createRequestToken(pinCode: any) {

  const userId = store.getState().appAuth.userData.id;
  let key: any = '';

  const today = new Date();
  const year = today.getUTCFullYear();
  let date: any = today.getUTCDate();
  let month: any = today.getUTCMonth();
  let hour: any = today.getUTCHours();

  if ((++month) < 10) {
      month = '0' + month.toString();
  }

  if (date < 10) {
      date = '0' + date.toString();
  }

  if (hour < 10) {
      hour = '0' + hour.toString();
  }

key = key.concat(year.toString(), month.toString(), date.toString(), hour.toString());
// const resultKey = 'CUBLICKproduct01' + userId + `${pinCode}` + key;
const resultKey = 'CUBLICKproduct01' + userId + `${pinCode}`;
const result = MD5(resultKey);

return result;
}

export function createPlaylistData(contentData: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      fs.writeFile(electronConfig.APP.DIR_PATH.PLAYLIST_PATH + '/' + contentData.id, JSON.stringify(contentData), (err: any) => {
        if (err) {
            console.error('Failed Write pla file: ', err);
            throw err;
        }
      });

          let tmp = contentData.displayItems;

          tmp = tmp.concat({
              fileType: '.pla',
              id: contentData.id,
              md5: 'NONE'
          });

          let data: any = [];

          try {
            tmp.map((files: any) => {
              if (files.type === 'PRESENTATION') {
                  getPresentationDesign(files.id)
                  // .then(res => console.log(res));
                  .then(res => {
                    fs.writeFile(electronConfig.APP.DIR_PATH.PRESENTATION_PATH + '/' + files.id, JSON.stringify(res), (err: any) => {
                          if (err) {
                              console.error('Failed write pre file: ', err);
                              throw err;
                          }
                    }),
                    res.assets.map((assets: any) => {
                        data = data.concat({
                          fileType: assets.fileType,
                          id: assets.id,
                          md5: assets.md5
                        });
                      });
                    })
                  .then(() =>
                      data = data.concat({
                          fileType: '.pre',
                          id: files.id,
                          md5: 'NONE'
                      }));
              } else {
                  data = data.concat({
                      fileType: files.fileType,
                      id: files.id,
                      md5: files.md5
                  });
              }
            });
          } catch (err) {
              console.log('get playlist Data err');
          }

          setTimeout(() => {
            resolve(data);
          }, 1000);
    } catch (err) {
      reject(err);
    }
  });
}

export function createScheduleData(contentData: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      fs.writeFile(electronConfig.APP.DIR_PATH.SCHEDULE_PATH + '/' + contentData.id, JSON.stringify(contentData), (err: any) => {
        if (err) {
            console.error('Failed Write sch file: ', err);
            throw err;
        }
      });

          let tmp = contentData.displayItems;

          tmp = tmp.concat({
              fileType: '.sch',
              id: contentData.id,
              md5: 'NONE'
          });

          let data: any = [];

          try {
            tmp.map((files: any) => {
              if (files.type === 'PRESENTATION') {
                  getPresentationDesign(files.id)
                  // .then(res => console.log(res));
                  .then(res => {
                    fs.writeFile(electronConfig.APP.DIR_PATH.PRESENTATION_PATH + '/' + files.id, JSON.stringify(res), (err: any) => {
                          if (err) {
                              console.error('Failed write pre file: ', err);
                              throw err;
                          }
                    }),
                    res.assets.map((assets: any) => {
                        data = data.concat({
                          fileType: assets.fileType,
                          id: assets.id,
                          md5: assets.md5
                        });
                      });
                    })
                  .then(() =>
                      data = data.concat({
                          fileType: '.pre',
                          id: files.id,
                          md5: 'NONE'
                      }));
              } else {
                  data = data.concat({
                      fileType: files.fileType,
                      id: files.id,
                      md5: files.md5
                  });
              }
            });
          } catch (err) {
              console.log('get pre Data err');
          }

          setTimeout(() => {
            resolve(data);
          }, 1000);
    } catch (err) {
      reject(err);
    }
  });
}

export function generateFileZip(filesData, playerIp, pinCode, type, verifyData?) {

  const zip = require('jszip')();

  switch (type) {

    case 'ASSET':

      JSZipUtils.getBinaryContent(filesData.path + '/' + filesData.id, function (err, data) {
        if (err) {
            // throw err; // or handle the error
            console.log(err);
        }
        else {
            zip.file(filesData.id + filesData.fileType, data, {binary: true});
                zip.generateAsync({ type: 'blob' }).then(function (result) {

                  console.log('result', result);

                  const md5 = require('md5');
                  const getMD5 = md5(result);
                  uploadAssetZipHttp(result, playerIp, pinCode, getMD5, filesData);

                });
        }
      });
        break;

    case 'PRESENTATION':

    console.log('asdasdasdasdasdasdasdasdasdasd', filesData);

      let count = 0;
      let tmp = filesData.assets;

      tmp = tmp.concat({
          fileType: '.pre',
          id: filesData.id,
          md5: 'NONE'
      });

      let data: any = [];

      tmp.map((assets: any) => {
          data = data.concat({
              fileType: assets.fileType,
              id: assets.id,
              md5: assets.md5
          });
      });

      if (filesData.isLocal === undefined) {
        getPresentationDesign(filesData.id)
        .then(res => fs.writeFile(electronConfig.APP.DIR_PATH.PRESENTATION_PATH + '/' + filesData.id, JSON.stringify(res), (err: any) => {
          if (err) {
              console.error('Failed upload Zip file: ', err);
              throw err;
          }
        }));
      } else if (filesData.isLocal === true) {
          const tmp = store.getState().appPresentation.presentationData.data.filter(x => x._id === filesData.id);

          fs.writeFile(electronConfig.APP.DIR_PATH.PRESENTATION_PATH + '/' + filesData.id, JSON.stringify(tmp[0].FileData), (err: any) => {
            if (err) {
                console.error('Failed upload Zip file: ', err);
                throw err;
            }
          });
      }

      setTimeout(() => {

        data.map(assets => {
          if (assets.fileType === '.pre') {
            JSZipUtils.getBinaryContent(electronConfig.APP.DIR_PATH.PRESENTATION_PATH + '/' + assets.id, function (err, data) {
              if (err) {
                // throw err; // or handle the error
                console.log(err);
              } else {
                    zip.file(assets.id + assets.fileType, data, {binary: true});
                    if (filesData.assets.length === 0) {
                      zip.generateAsync({ type: 'blob' }).then(function (result) {

                        const md5 = require('md5');
                        const getMD5 = md5(result);
                        uploadPresentationZipHttp(result, playerIp, pinCode, getMD5, filesData);
                      });
                    }
                }
            });
          } else {
            JSZipUtils.getBinaryContent(electronConfig.APP.DIR_PATH.FILE_PATH + '/' + assets.id, function (err, data) {
              if (err) {
                  // throw err; // or handle the error
                  console.log(err);
              }
              else {
                  zip.file(assets.id + assets.fileType, data, {binary: true});
                  count++;
                  if (count === (filesData.assets.length)) {
                      zip.generateAsync({ type: 'blob' }).then(function (result) {

                        const md5 = require('md5');
                        const getMD5 = md5(result);
                        uploadPresentationZipHttp(result, playerIp, pinCode, getMD5, filesData);
                      });
                  }
              }
            });
          }
        });
      }, 1000);

      break;
  }
}

export function base64ToBufferAndWrite (str: any, date: any): Promise<void> {
  return new Promise((resolve, reject) => {

      const FilePath = path.join(electronConfig.APP.DIR_PATH.THERMAL_PATH, date + '.zip').replace(/\\/g, '/');

      try {
        str = atob(str); // creates a ASCII string
        const buffer = new ArrayBuffer(str.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < str.length; i++) {
            view[i] = str.charCodeAt(i);
        }

        writeZipFile(FilePath, view);

        resolve();

      } catch {
          console.error('Write Zip Error');
          reject();
      }
  });
}


export function writeZipFile(filePath: string, fileData: any): Promise<void> {
  return new Promise((resolve, reject) => {
      // Create asset file write stream.
      fs.writeFile(filePath, fileData, (err: any) => {
          if (err) {
              console.error('Failed upload Zip file: ', err);
              reject();
              throw err;
          }
          // const md5File = require('md5-file');
          // md5File(filePath, (err: any, hash: any) => {
          //     if (err) throw err;
          //     if (hash !== fileMD5) {
          //         unlinkAssetFiles(filePath);
          //         reject();
          //     }
              resolve();
          // });
      });
  });
}

export function decompressZipFile(oriPath: string, nextPath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
      try {
          decompress(oriPath, nextPath)
              .then(() => {
                console.log('success de');
                  resolve();
              })
              .catch((err: any) => {
                  console.log(err);
                  reject(err);
              });
      } catch (err) {
          console.error(err);
          reject(err);
      }
  });
}
