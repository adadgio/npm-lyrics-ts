import * as os  from 'os';
import * as io from 'socket.io';

import { App, Console }                     from './../../../../lyrics/core';
import { BaseController }                   from './../../../../lyrics/controller';
import { Route, Controller, Inject }        from './../../../../lyrics/routing';
import { Request, Response, JsonResponse }  from './../../../../lyrics/http';

@Controller('/_system')
export class OsController extends BaseController
{
    private socket;

    constructor(app: App) {
        super(app);
        this.setupSocket();
    }

    setupSocket() {
        let stat = this.get('stat.service');
        this.socket = io(this.app.server);

        this.socket.on('connection', (client) => {
            // eventually do something when client disconnects...
            this.socket.on('disconnect', () => {

            });

            // broadcast system status on a regular basis
            stat.broadcast((info) => {
                this.socket.emit('sys:info', info);
            });
        });
    }


    /**
     * Monitor CPU load and server health and
     * show clusters state and system information.
     */
    @Route('/load', {
        type: 'GET'
    })
    indexAction(request: Request)
    {
        return this.render('System:default.twig', { });
    }
}
