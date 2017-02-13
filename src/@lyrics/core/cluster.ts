/**
 * Wrap cluster forking/restarting into a module
 */
import * as os from 'os';
import * as events from 'events';
import * as cluster from 'cluster';
import { Console, KernelEvents } from './';

export class Cluster {
    
    private emitter: events.EventEmitter;
    private numCPUs: number;

    constructor() {
        this.numCPUs = 1; // @todo Remove, only for debug
        // this.numCPUs = os.cpus().length - 2;
    }

    /**
     * Provide a callback for the master process to start (like app -> serve)
     * or just for this process if the cluster is a child process (fork)
     */
    public start(onMasterProcessStart: Function) {
        if (cluster.isMaster) {

            // fork a new cluster for each cpu
            for (var i = 0; i < this.numCPUs; i++) {
                cluster.fork();
                KernelEvents.emit('cluster:fork', 'Cluster process started');
                // Console.kernel('cluster.ts Child cluster started');
            }

            // restart a cluster for whenever a cluster dies
            cluster.on('exit', function(worker, code, signal) {
                KernelEvents.emit('cluster:exit', 'Cluster process exited (reforked)');
                cluster.fork();
            });

        } else {
            onMasterProcessStart();
        }
    }
}
