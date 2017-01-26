/**
 * Wrap cluster forking/restarting into a module
 */
import * as os from 'os';
import * as cluster from 'cluster';

export class Cluster {

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
            console.log('[Cluster] Master started');

            // fork a new cluster for each cpu
            for (var i = 0; i < this.numCPUs; i++) {
                cluster.fork();
                console.log('[Cluster] Child started');
            }

            // restart a cluster for whenever a cluster dies
            cluster.on('exit', function(worker, code, signal) {
                cluster.fork();
            });

        } else {
            onMasterProcessStart();
        }
    }
}
