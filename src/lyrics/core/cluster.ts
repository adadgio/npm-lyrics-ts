/**
 * Wrap cluster forking/restarting into a module
 */
import * as os      from 'os';
import * as events  from 'events';
import * as cluster from 'cluster';
import { Console, KernelEvents, KernelListener, XEvent } from '@lyrics/core';

export class Cluster {

    private emitter: events.EventEmitter;
    private numCPUs: number;

    constructor() {
        this.numCPUs = 1; // @todo Remove, only for debug
        // this.numCPUs = os.cpus().length - 2;

        KernelListener.on(XEvent.CLUSTER_FORK, (args) => {
            Console.red(args);
        });

        KernelListener.on(XEvent.CLUSTER_EXIT, (args) => {
            Console.red(args);
        });
    }

    /**
     * Provide a callback for the master process to start (like app -> serve)
     * or just for this process if the cluster is a child process (fork)
     */
    public start(onMasterProcessStart: Function) {
        if (cluster.isMaster) {

            // fork a new cluster for each CPU
            for (var i = 0; i < this.numCPUs; i++) {
                cluster.fork();
                KernelEvents.emit(XEvent.CLUSTER_FORK, 'Cluster process started');
            }

            // restart a cluster for whenever a cluster dies
            cluster.on('exit', function(worker, code, signal) {
                KernelEvents.emit(XEvent.CLUSTER_EXIT, 'Cluster process exited (reforked)');
                cluster.fork();
            });

        } else {
            onMasterProcessStart();
        }
    }
}
