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

            const instantMessageDb = new Datastore({
                filename: config.APP.DB_PATH.INSTANTMESSAGE_DATA,
                autoload: true
            });

            const widgetDb = new Datastore({
                filename: config.APP.DB_PATH.WIDGET_DATA,
                autoload: true
            });

            const playlistDb = new Datastore({
                filename: config.APP.DB_PATH.PLAYLIST_DATA,
                autoload: true
            });

            const scheduleDb = new Datastore({
                filename: config.APP.DB_PATH.SCHEDULE_DATA,
                autoload: true
            });

            const deviceDb = new Datastore({
                filename: config.APP.DB_PATH.DEVICE_DATA,
                autoload: true
            });

            const thermalDb = new Datastore({
                filename: config.APP.DB_PATH.THERMAL_DATA,
                autoload: true
            });

            // Compact DB every 30 minutes. (1000ms * 60 * 30)
            // ref: https://github.com/louischatriot/nedb#persistence
            const acInterval = 1000 * 60 * 30;
            assetMediaDb.persistence.setAutocompactionInterval(acInterval);
            presentationMediaDb.persistence.setAutocompactionInterval(acInterval);
            instantMessageDb.persistence.setAutocompactionInterval(acInterval);
            widgetDb.persistence.setAutocompactionInterval(acInterval);
            playlistDb.persistence.setAutocompactionInterval(acInterval);
            scheduleDb.persistence.setAutocompactionInterval(acInterval);
            deviceDb.persistence.setAutocompactionInterval(acInterval);
            thermalDb.persistence.setAutocompactionInterval(acInterval);

            // Register app database to global variable.
            // In renderer process: `remote.getGlobal('APP_DB').dbname...`
            (global as any)['APP_DB'] = {
                assetMediaDb
            };
            (global as any)['PT_DB'] = {
                presentationMediaDb
            };
            (global as any)['INST_DB'] = {
                instantMessageDb
            };
            (global as any)['WID_DB'] = {
                widgetDb
            };
            (global as any)['PLY_DB'] = {
                playlistDb
            };
            (global as any)['SCH_DB'] = {
                scheduleDb
            };
            (global as any)['DEV_DB'] = {
                deviceDb
            };
            (global as any)['THM_DB'] = {
                thermalDb
            };


            resolve();
        } catch (err) {
            reject(`ERROR_INIT_DB: ${err}`);
        }
    });
}
