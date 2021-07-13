import * as fs from 'fs';
import * as path from 'path';


/**
 * Find all the dependencies without a `main` property
 * and add them as webpack externals.
 * @param dep   Dependencies.
 */
export function filterDepWithoutEntryPoints(dep: string): boolean {
    // Return true if we want to add a dependency to externals
    try {
        // If the root of the dependency has an index.js, return true
        if (
            fs.existsSync(
                path.join(
                    __dirname,
                    '..',
                    `node_modules/${dep}/index.js`
                )
            )
        ) {
            return false;
        }

        const pgkString = fs
            .readFileSync(require.resolve(`${dep}/package.json`))
            .toString();
        const pkg = JSON.parse(pgkString);
        const fields = ['main', 'module', 'jsnext:main', 'browser'];
        return !fields.some(field => field in pkg);
    } catch (e) {
        return true;
    }
}