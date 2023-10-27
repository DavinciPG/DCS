const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);

class File {
    constructor(filename, fileType) {
        this.filename = filename;
        this.filePath = path.join(__dirname, '../documents/', this.filename);
        this.fileType = fileType;
    }

    async readFile() {
        try {
            return await readFile(this.filePath);
        } catch (error) {
            console.error(`Error reading file: ${this.filePath}`);
            return null;
        }
    }

    async writeFile(data) {
        try {
            fs.writeFileSync(this.filePath, data);
            console.log(`File ${this.filePath} written.`);
        } catch (error) {
            console.error(`Error writing to file: ${this.filePath}`);
        }
    }

    async getContentType() {
        let contentType = '';
        switch(this.fileType) {
            case 'txt':
                contentType = 'text/plain';
                break;
            case 'html':
                contentType = 'text/html';
                break;
            case 'pdf':
                contentType = 'application/pdf';
                break;
            case 'markdown':
                contentType = 'text/html';
                break;
            default:
                contentType = 'application/octet-stream';
                break;
        }

        return contentType;
    }
}

module.exports = File;