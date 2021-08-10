import * as Datastore from 'nedb';
import config from '../../../config/electron-config';


/**
 * Initialize app database.
 */
export function initAppDatabase(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            /** Database of mirror media assets. */
            const assetMediaDb = new Datastore({
                filename: config.APP.DB_PATH.DISPLAYER_MEDIA,
                autoload: true
            });
            const presentationMediaDb = new Datastore({
                filename: config.APP.DB_PATH.PRESENTATION_MEDIA,
                autoload: true
            });

            // Compact DB every 30 minutes. (1000ms * 60 * 30)
            // ref: https://github.com/louischatriot/nedb#persistence
            const acInterval = 1000 * 60 * 30;
            assetMediaDb.persistence.setAutocompactionInterval(acInterval);
            presentationMediaDb.persistence.setAutocompactionInterval(acInterval);

            // Register app database to global variable.
            // In renderer process: `remote.getGlobal('APP_DB').dbname...`
            (global as any)['APP_DB'] = {
                assetMediaDb
            };
            (global as any)['PT_DB'] = {
                presentationMediaDb
            };

            resolve();
        } catch (err) {
            reject(`ERROR_INIT_DB: ${err}`);
        }
    });
}
