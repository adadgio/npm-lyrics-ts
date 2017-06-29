import * as os from 'os';

export class StatService {
    constructor() {

    }

    onInit() {
        
    }

    broadcast(then: Function, interval: number = 900) {
        let info = { arch: os.arch(), loadavg: null, numCpus: os.cpus().length, usage: null };

        setInterval(() => {
            info.loadavg = os.loadavg();
            info.usage = this.getCpuUsage();
            then(info);
        }, interval);
    }

    getCpuUsage() {
        let cpus = os.cpus();
        let usage = {};

        for (let i = 0, len = cpus.length; i < len; i++) {
            // console.log('CPU %s:', i);
            usage[i] = {};

            let cpu = cpus[i],
                total = 0;

            for (let type in cpu.times) {
                total += cpu.times[type];
            }

            for (let type in cpu.times) {
                usage[i][type] = Math.round(100 * cpu.times[type] / total);
                // console.log("\t", type, Math.round(100 * cpu.times[type] / total));
            }
        }

        return usage;
    }
}
