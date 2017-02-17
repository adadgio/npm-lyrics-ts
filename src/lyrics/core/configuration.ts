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

    public get(key: string)
    {
        return (new Accessor(this.config)).getValue(key);
    }
}
