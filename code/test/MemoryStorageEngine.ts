import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { StorageEngine } from "multer";
import { ParsedQs } from "qs";

let storage = {

};
class MemoryStorageEngine implements StorageEngine {
    _handleFile(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, file: Express.Multer.File, callback: (error?: any, info?: Partial<Express.Multer.File>) => void): void {
        console.log(req);
        storage['some'] = file;
        callback(null, {
            path: file.path,
            size: file.size,
        });    }
    _removeFile(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, file: Express.Multer.File, callback: (error: Error) => void): void {
        storage = {};
        callback(null);
    }
   
}

export const myMemoryStorageEngine = new MemoryStorageEngine();