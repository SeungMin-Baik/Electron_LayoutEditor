import * as path from 'path';
import { app, remote } from 'electron';

/**
 * Get URL of electron app data path.
 * @param relativePath  Relative path.
 * @returns             Path.
 */
export function getElectronDataPath(relativePath: string) {
    return app ?
        path.join(app.getPath('userData'), relativePath).replace(/\\/g, '/') :
        path.join(remote.app.getPath('userData'), relativePath).replace(/\\/g, '/');
}

/**
 * Get Api server url
 * @param informationPath Information path.
 * @return                Path.
 */
export function getInformationDataPath(informationPath: string, id: string, accessToken: string) {
    informationPath.replace('{0}', id);
    informationPath.replace('{1}', accessToken);
    return informationPath;
}