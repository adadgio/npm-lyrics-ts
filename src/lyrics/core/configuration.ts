/**
 * Configuration service
 */
import { Accessor } from '@lyrics/core';

export class Configuration
{
    private config: Object;

    constructor()
    {

    }

    inject(config: Object)
    {
        this.config = config;
    }

    public all()
    {
        return this.config;
    }

    isNotNull(key: string) {
        return (this.get(key) !== null) ? true : false;
    }

    public get(key: string)
    {
        return (new Accessor(this.config)).getValue(key);
    }
}
