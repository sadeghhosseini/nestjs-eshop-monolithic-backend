

export abstract class ImageProvider {
    abstract createRecord(image: ImageProviderTypes.CreateRecord);
    abstract createRecords(images: ImageProviderTypes.CreateRecord[]);
}

export namespace ImageProviderTypes {
    export interface CreateRecord {
        path: string;
    }
}