/**
 * Parse, require and use process
 * command line arguments in your app.
 * Pattern: singleton
 */
export class Accessor
{
    private object: Object;

    constructor(object: Object)
    {
        this.object = object;
    }

    public getValue(accessor: string)
    {
        if (accessor.indexOf('.') > -1) {
            var value = this.object,
                properties = accessor.split('.');
                
            for (let p of properties) {
                value = (typeof value[p] === 'undefined') ? null : value[p];
                if (value === null) { break; }
            }

            return value;

        } else {
            return (typeof this.object[accessor] === 'undefined') ? null : this.object[accessor];
        }
    }
}
