import store from '../../../store';

import * as fs from 'fs';

import * as FileSaver from 'file-saver';
import * as JSZipUtils from 'jszip-utils';

import electronConfig from '@app/config/electron-config';


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

      if (filesData.isLocal === true) {
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
