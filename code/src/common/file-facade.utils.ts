import { Injectable } from "@nestjs/common";
import { promises } from "fs";

@Injectable()
export class FileFacade {
    save(path: string, file: Buffer) {
        return promises.writeFile(path, file);
    }

}