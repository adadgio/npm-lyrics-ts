import { Process }          from '@lyrics/annotation';
import { EventDispatcher }  from '@lyrics/event';

export class BaseProcess
{
    protected INTERVAL: number = 200;
    protected NAME: string = null;

    constructor(interval: number = null)
    {
        if (interval !== null) {
            this.INTERVAL = interval;
        }
    }

    getName()
    {
        return this.NAME;
    }

    setName(name: string)
    {
        this.NAME = name;
        return this;
    }

    private doStart()
    {
        EventDispatcher.emit(`process:${this.NAME}:start`, { millis: process.hrtime() });

        this.start();
        this.doLoop();
    }

    private doLoop()
    {
        if (false === this.doStop()) {

            setTimeout(() => {
                EventDispatcher.emit(`process:${this.NAME}:tick`, { millis: process.hrtime() });

                this.loop();
                this.doLoop();
            }, this.INTERVAL);

        } else {

        }
    }

    private doStop(): boolean
    {
        EventDispatcher.emit(`process:${this.NAME}:stop`, { millis: process.hrtime() });
        return this.stop();
    }

    start() {}
    loop() {}
    stop() { return false }
}
