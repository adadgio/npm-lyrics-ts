/**
 * Path finder for app direcotry roots.
 */
class PathFinderModule {

    private rootdir: string;
    private appdir: string;
    private webdir: string;

    constructor() {
        // the package might be inside node_modules (when got via npm)
        // or just inside your src folder. The "current" here will be
        // hte full path on the disk including the src folder
        let absoluteRoot = process.env.PWD.replace('/src/lyrics/core', '');
        this.rootdir =  `${absoluteRoot}/src`;
        this.appdir =  `${absoluteRoot}/app`;
        this.webdir =  `${absoluteRoot}/app/public`;
    }
    
    getRootDir() {
        return this.rootdir;
    }

    getAppDir() {
        return this.appdir;
    }

    getWebDir() {
        return this.webdir;
    }
}

export let PathFinder = new PathFinderModule();
