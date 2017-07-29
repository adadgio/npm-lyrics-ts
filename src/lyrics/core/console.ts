/**
 * Parse, require and use process
 * command line arguments in your app.
 * Pattern: singleton
 */
import * as fs      from 'fs';
import * as path    from 'path';
import * as moment  from 'moment';

class ConsoleSingleton
{
    Reset       = '\x1b[0m';
    Bright      = '\x1b[1m';
    Dim         = '\x1b[2m';
    Underscore  = '\x1b[4m';
    Blink       = '\x1b[5m';
    Reverse     = '\x1b[7m';
    Hidden      = '\x1b[8m';

    FgBlack     = '\x1b[30m';
    FgRed       = '\x1b[31m';
    FgGreen     = '\x1b[32m';
    FgYellow    = '\x1b[33m';
    FgBlue      = '\x1b[34m';
    FgMagenta   = '\x1b[35m';
    FgCyan      = '\x1b[36m';
    FgWhite     = '\x1b[37m';
    FgLitGray  =  '\x1b[90m';

    BgBlack     = '\x1b[40m';
    BgRed       = '\x1b[41m';
    BgGreen     = '\x1b[42m';
    BgYellow    = '\x1b[43m';
    BgBlue      = '\x1b[44m';
    BgMagenta   = '\x1b[45m';
    BgCyan      = '\x1b[46m';
    BgWhite     = '\x1b[47m';

    private env: string;

    constructor() {
        this.env = 'dev';
    }

    writeLog(text: string) {
        let date = moment().format('Y-MM-DD');
        let datetime = moment().format('Y-MM-DD HH-mm-s');
        let filepath = process.env.PWD + `/var/logs/${this.env}-${date}-debug.log`;

        fs.appendFileSync(filepath, `[${datetime}]\n${text}\n`);

        // @todo delete logs older 3 days
        // let prevDate = moment().subtract(3,'d').format('YYYY-MM-DD');
        // let oldFile = '?';
        // fs.unlinkSync(oldFile);
    }

    setEnv(env: string, traceDisabled: boolean = false) {
        this.env = env;

        return this;
    }

    log(text: string): void {
        this.writeLog(text);
        console.log('\x1b[37m%s\x1b[0m', text);
    }

    white(text: string): void {
        this.writeLog(text);
        console.log('\x1b[37m%s\x1b[0m', text);
    }

    red(text: string): void {
        this.writeLog(text);
        console.log('\x1b[31m%s\x1b[0m', text);
    }

    info(text: string): void {
        this.lite(text);
    }

    warn(text: string): void {
        this.writeLog(text);
        console.log('\x1b[33m%s\x1b[0m', text);
    }

    error(text: string, quit: number = null): void {
        this.writeLog(text);
        console.log('\x1b[31m%s\x1b[0m', text);
        if (1 === quit) { process.exit(0); } // process will be reforked
    }

    magenta(text: string): void {
        this.writeLog(text);
        console.log('\x1b[35m%s\x1b[0m', text);
    }
    
    comment(text: string): void {
        this.writeLog(text);
        console.log('\x1b[35m%s\x1b[0m', text);
    }

    cyan(text: string): void {
        this.writeLog(text);
        console.log('\x1b[36m%s\x1b[0m', text);
    }

    gray(text: string): void {
        this.writeLog(text);
        console.log('\x1b[97m%s\x1b[0m', text);
    }

    lite(text: string): void {
        this.writeLog(text);
        console.log('\x1b[90m%s\x1b[0m', text);
    }

    exception(text: string): void {
        this.writeLog(text);
        console.log('\x1b[41m%s\x1b[0m', text);
        throw new Error('Exception error throw');
    }
}

export let Console = new ConsoleSingleton();
