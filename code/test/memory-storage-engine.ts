import { expect } from "chai";
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { StorageEngine } from "multer";
import { ParsedQs } from "qs";

interface StorageType {
    fieldname?: string;
    mimetype?: string;
    originalname?: string;
    buffer?: Buffer;
    size?: number;
}
let storage: Record<string, StorageType> = {};
class MemoryStorageEngine implements StorageEngine {
    _handleFile(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, file: Express.Multer.File, callback: (error?: any, info?: Partial<Express.Multer.File>) => void): void {
        const id = Date.now();
        storage[id] = {
            fieldname: file.fieldname,
            mimetype: file.mimetype,
            originalname: file.originalname,
            size: file.size,
        };
        let buffers = [];
        file.stream.on('data', (chunk) => {
            buffers.push(Buffer.from(chunk));
        });
        file.stream.on('end', () => {
            storage[id]['buffer'] = Buffer.concat(buffers);
            callback(null, storage[id]);
        });
    }
    _removeFile(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, file: Express.Multer.File, callback: (error: Error) => void): void {
        storage = {};
        callback(null);
    }
}


export class FakeStorage {
    static getStorage() {
        return { ...storage };//returns a clone of the storage object
    }

    static assertExists(buffer: Buffer);
    static assertExists(fileName: string);
    static assertExists(input) {
        if (input instanceof String) {
            const fileName = input;
            const fileNames = Object.values(storage).map(record => record.originalname);
            expect(fileNames).to.include(fileName, `file was not uploaded`);
        } else if (input instanceof Buffer) {
            const buffer = input;
            const buffers = Object.values(storage).map(record => record.buffer);
            let equalityChecks = [];
            for (const bff of buffers) {
                equalityChecks.push(buffer.equals(bff));
            }
            const result = equalityChecks.reduce((acc, currentValue, currentIndex) => {
                return acc || currentValue;
            }, false);
            expect(result, 'file was not uploaded').to.be.true;
        }
    }
}

export const myMemoryStorageEngine = new MemoryStorageEngine();