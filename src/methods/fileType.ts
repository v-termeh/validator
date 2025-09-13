import * as yup from "yup";

/**
 * Check if a single file's MIME type is allowed.
 */
export function isValidFileType(
    file?: File,
    allowedMimes: string[] = []
): boolean {
    if (!file) return false;
    return allowedMimes.includes(file.type);
}

/**
 * Extend Yup with `fileType` and `filesType` method for mixed schema.
 */
export function addFileTypeMethod(defaultMessage = "file_type") {
    yup.addMethod<yup.MixedSchema>(
        yup.mixed,
        "fileType",
        function (allowedMimes: string[], message = defaultMessage) {
            return this.test("fileSize", message, (v: any) => {
                if (!v) return true;
                const file = Array.isArray(v) ? v[0] : v.item?.(0);
                if (!file) return true;
                return isValidFileType(file as File, allowedMimes);
            });
        }
    );

    yup.addMethod<yup.MixedSchema>(
        yup.mixed,
        "filesType",
        function (allowedMimes: string[], message = defaultMessage) {
            return this.test("filesSize", message, (v: any) => {
                if (!v) return true;
                const files: File[] = Array.isArray(v)
                    ? v
                    : v.item
                    ? Array.from(v as FileList)
                    : [];
                if (!files.length) return true;
                return files.every((file) =>
                    isValidFileType(file as File, allowedMimes)
                );
            });
        }
    );
}

declare module "yup" {
    interface MixedSchema {
        fileType(mimes: string[], message?: string): this;
        filesType(mimes: string[], message?: string): this;
    }
}
