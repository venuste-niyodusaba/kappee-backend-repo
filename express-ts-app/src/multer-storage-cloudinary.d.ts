declare module "multer-storage-cloudinary" {
  import { StorageEngine, File } from "multer";
  import { v2 as cloudinary } from "cloudinary";

  export interface CloudinaryStorageParams {
    cloudinary: typeof cloudinary;
    params: {
      folder?: string;
      allowed_formats?: string[];
      format?: string;
      transformation?: any[];
      [key: string]: any;
    };
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageParams);
    _handleFile(req: any, file: File, cb: (error?: any, info?: Partial<File>) => void): void;
    _removeFile(req: any, file: File, cb: (error: Error) => void): void;
  }
}
