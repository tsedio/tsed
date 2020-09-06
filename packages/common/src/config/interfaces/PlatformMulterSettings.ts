import {Readable} from "stream";

declare global {
  namespace TsED {
    export interface MulterFile {
      /** Name of the form field associated with this file. */
      fieldname: string;
      /** Name of the file on the uploader's computer. */
      originalname: string;
      /**
       * Value of the `Content-Transfer-Encoding` header for this file.
       * @deprecated since July 2015
       * @see RFC 7578, Section 4.7
       */
      encoding: string;
      /** Value of the `Content-Type` header for this file. */
      mimetype: string;
      /** Size of the file in bytes. */
      size: number;
      /**
       * A readable stream of this file. Only available to the `_handleFile`
       * callback for custom `StorageEngine`s.
       */
      stream: Readable;
      /** `DiskStorage` only: Directory to which this file has been uploaded. */
      destination: string;
      /** `DiskStorage` only: Name of this file within `destination`. */
      filename: string;
      /** `DiskStorage` only: Full path to the uploaded file. */
      path: string;
      /** `MemoryStorage` only: A Buffer containing the entire file. */
      buffer: Buffer;
    }

    export interface MulterStorageEngine {
    }

    export interface MulterOptions {
      /**
       * A `StorageEngine` responsible for processing files uploaded via Multer.
       * Takes precedence over `dest`.
       */
      storage?: MulterStorageEngine;
      /**
       * The destination directory for uploaded files. If `storage` is not set
       * and `dest` is, Multer will create a `DiskStorage` instance configured
       * to store files at `dest` with random filenames.
       *
       * Ignored if `storage` is set.
       */
      dest?: string;
      /**
       * An object specifying various limits on incoming data. This object is
       * passed to Busboy directly, and the details of properties can be found
       * at https://github.com/mscdex/busboy#busboy-methods.
       */
      limits?: {
        /** Maximum size of each form field name in bytes. (Default: 100) */
        fieldNameSize?: number;
        /** Maximum size of each form field value in bytes. (Default: 1048576) */
        fieldSize?: number;
        /** Maximum number of non-file form fields. (Default: Infinity) */
        fields?: number;
        /** Maximum size of each file in bytes. (Default: Infinity) */
        fileSize?: number;
        /** Maximum number of file fields. (Default: Infinity) */
        files?: number;
        /** Maximum number of parts (non-file fields + files). (Default: Infinity) */
        parts?: number;
        /** Maximum number of headers. (Default: 2000) */
        headerPairs?: number;
      };
      /** Preserve the full path of the original filename rather than the basename. (Default: false) */
      preservePath?: boolean;
    }

    export interface MulterField {
      name: string;
      maxCount?: number;
    }

    export type MulterHandler = (req: any, res: any) => Promise<any>;

    export interface Multer {
      /**
       * Returns middleware that processes a single file associated with the
       * given form field.
       *
       * The `Request` object will be populated with a `file` object containing
       * information about the processed file.
       *
       * @param fieldName Name of the multipart form field to process.
       */
      single(fieldName: string): MulterHandler;

      /**
       * Returns middleware that processes multiple files sharing the same field
       * name.
       *
       * The `Request` object will be populated with a `files` array containing
       * an information object for each processed file.
       *
       * @param fieldName Shared name of the multipart form fields to process.
       * @param maxCount Optional. Maximum number of files to process. (default: Infinity)
       * @throws `MulterError('LIMIT_UNEXPECTED_FILE')` if more than `maxCount` files are associated with `fieldName`
       */
      array(fieldName: string, maxCount?: number): MulterHandler;

      /**
       * Returns middleware that processes multiple files associated with the
       * given form fields.
       *
       * The `Request` object will be populated with a `files` object which
       * maps each field name to an array of the associated file information
       * objects.
       *
       * @param fields Array of `Field` objects describing multipart form fields to process.
       * @throws `MulterError('LIMIT_UNEXPECTED_FILE')` if more than `maxCount` files are associated with `fieldName` for any field.
       */
      fields(fields: MulterField[]): MulterHandler;

      /**
       * Returns middleware that processes all files contained in the multipart
       * request.
       *
       * The `Request` object will be populated with a `files` array containing
       * an information object for each processed file.
       */
      any(): MulterHandler;

      /**
       * Returns middleware that accepts only non-file multipart form fields.
       *
       * @throws `MulterError('LIMIT_UNEXPECTED_FILE')` if any file is encountered.
       */
      none(): MulterHandler;
    }
  }
}

export type PlatformMulter = TsED.Multer;
export type PlatformMulterSettings = TsED.MulterOptions;
export type PlatformMulterFile = TsED.MulterFile;
export type PlatformMulterField = TsED.MulterField ;


