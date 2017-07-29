// use npm module alias to use ts paths mapping (tsconfig.json)
// and correct nodejs alias resolver (package.json)
// require('module-alias/register');
const moduleAlias = require('module-alias');
moduleAlias.addAlias('@lyrics/core', __dirname + '/core');
moduleAlias.addAlias('@lyrics/event', __dirname + '/event');
moduleAlias.addAlias('@lyrics/http', __dirname + '/http');
moduleAlias.addAlias('@lyrics/utils', __dirname + '/utils');
moduleAlias.addAlias('@lyrics/routing', __dirname + '/routing');
moduleAlias.addAlias('@lyrics/service', __dirname + '/service');
moduleAlias.addAlias('@lyrics/controller', __dirname + '/controller');
moduleAlias.addAlias('@lyrics/component', __dirname + '/component');
moduleAlias.addAlias('@lyrics/annotation', __dirname + '/annotation');
