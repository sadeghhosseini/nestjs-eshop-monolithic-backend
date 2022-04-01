import { getManager } from "typeorm";
import { Image } from "../image.entity";
import { ImageProvider, ImageProviderTypes } from "../ports/image.provider";


export class ImageRepository implements ImageProvider {
    createRecord(image: ImageProviderTypes.CreateRecord) {
        throw new Error("Method not implemented.");
    }
    createRecords(images: ImageProviderTypes.CreateRecord[]) {
        return getManager().save(Image, images);
    }

}