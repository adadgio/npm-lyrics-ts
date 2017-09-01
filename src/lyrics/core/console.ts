/**
 * Parse, require and use process
 * command line arguments in your app.
 * Pattern: singleton
 */
import * as fs      from 'fs';
import * as path    from 'path';
import * as moment  from 'moment';
import * as winston from 'winston';

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
    private logger: any; // the winston logger

    constructor() {
        this.env = 'dev';

        // create the logs directory for winston
        // if the directory does not exist
        const logDir =  `${process.env.PWD}/var/logs/`;
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        const tsFormat = () => (new Date()).toLocaleTimeString();
        const date = moment().format('Y-MM-DD');
        const datetime = moment().format('Y-MM-DD HH-mm-s');
        const logfile = `${this.env}-${date}-debug.log`;

        this.logger = new (winston.Logger)({
            transports: [
                // colorize the output to the console
                new (winston.transports.Console)({
                    timestamp: tsFormat,
                    colorize: true,
                    level: 'info'
                }),
                // new (winston.transports.File)({
                //     filename: `${logDir}/${logfile}`,
                //     timestamp: tsFormat,
                //     level: this.env === 'dev' ? 'debug' : 'info'
                // })
            ]
        });
    }

    writeLog(text: string) {
        this.logger.debug(text);
    }

    setEnv(env: string, winstonDebugLevel: 'error'|'warn'|'info'|'verbose'|'debug'|'silly' = 'debug') {
        this.env = env;

        // configure winston logger level
        this.logger.level = winstonDebugLevel;

        return this;
    }

    configureWinstonLogger()
    {

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

    blue(text: string): void {
        this.writeLog(text);
        console.log('\x1b[44m%s\x1b[0m', text);
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
