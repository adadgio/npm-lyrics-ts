/**
 * Routes and controller meta data container
 */
const ctrlRoutings = {};
const methodRoutings = {};

/**
 * Controllers routing annotation meta data setters/getters
 */
export function addControllerRouteMetaData(metadata: Object) {
    let key = metadata['route'];
    ctrlRoutings[key] = metadata;
}
export function getControllerRouteMetaData(key: any) {
    return ctrlRoutings[key];
}

/**
 * Methods routing annotation meta data setters/getters
 */
export function addMethodRouteMetaData(metadata: Object) {
    let key = metadata['route'];
    methodRoutings[key] = metadata;
}
export function getMethodRouteMetaData(key: any) {
    return methodRoutings[key];
}

export function debug() {
    for (let key in ctrlRoutings) {
        console.log(key, ctrlRoutings[key]);
    }
    for (let key in methodRoutings) {
        console.log(key, ctrlRoutings[key]);
    }
}

export function setRoutes(router: any) {

    for (let path in methodRoutings) {
        router.get(path, (req, res, next) => {
            res.json({ message: `It works!` });
        });
    }
}
