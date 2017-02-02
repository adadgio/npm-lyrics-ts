import { Service, ServiceInterface } from './../../../@lyrics/component';
import { Inject } from './../../../@lyrics/routing';

let inspect = require('eyes').inspector({ maxLength: 20000 });
let extract = require('pdf-extract');

export class PdfService extends Service
{
    /**
     * Override default service injector
     * to get default params injected in app.ts
     * as simple objects of params (typically config and route)
     */
    constructor() {
        // required when extending base services
        // you need this for proper di injection
        super();
    }

    public processByQr(pdf?: string) {
        let fs = require('fs'),
            PDFParser = require('pdf2json'),
            pdfpath = '/home/adadgio/WebServer/projects/adadgio/npm-lyrics-ts/src/app/views/patient-qrcode.pdf';;

        let pdfParser = new PDFParser();

        pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError) );
        pdfParser.on('pdfParser_dataReady', pdfData => {
            fs.writeFile('/home/adadgio/WebServer/projects/adadgio/npm-lyrics-ts/src/app/views/F1040EZ.json', JSON.stringify(pdfData));
        });

        pdfParser.loadPDF(pdfpath);
    }

    public process(pdf?: string) {
        let self = this,
            opts = { type: 'text' },
            cutAt = [],
            pdfpath = '/home/adadgio/WebServer/projects/adadgio/npm-lyrics-ts/src/app/views/patient.pdf';

        let processor = extract(pdfpath, opts, (err) => {
            if (err) { return this.onError(err); }
        });

        processor.on('page', function(data) {
            inspect(data.text_pages, 'extracted text pages');
            let shouldCut = self.onPageProcessed(data);

            if (shouldCut) {
                cutAt.push(data.index);
            }
        });

        processor.on('complete', function(data) {
            inspect(data.text_pages, 'extracted text pages');
            self.onComplete(data, cutAt);
        });

        processor.on('error', function(err) {
            inspect(err, 'error while extracting pages');
            return self.onError(err);
        });
    }

    private shouldCut(text: string) {
        let pattern = new RegExp('CUT');
        return (pattern.test(text)) ? true : false;
    }

    private hasQRCode() {

    }

    private onError(err) {
        console.log(err);
    }

    private onComplete(data, cutAtIndexes: Array<number>) {
        // console.log(data);
        // first page index starts at 1
        console.log(cutAtIndexes);
        console.log(data.single_page_pdf_file_paths); // as tmp pathes
    }

    private onPageProcessed(data) {
        let text = data.text;
        // console.log(data);
        return this.shouldCut(text);
    }
}
