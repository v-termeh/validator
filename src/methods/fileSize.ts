import * as yup from "yup";

/**
 * Check if a single file's size is within min and max (bytes).
 */
export function isValidFileSize(
    file?: File,
    minBytes: number = 0,
    maxBytes: number = Number.MAX_SAFE_INTEGER
): boolean {
    if (!file) return false;
    return file.size >= minBytes && file.size <= maxBytes;
}

/**
 * Extend Yup with `fileSize` and `filesSize` method for mixed schema.
 */
export function addFileSizeMethod(defaultMessage = "file_size") {
    yup.addMethod<yup.MixedSchema>(
        yup.mixed,
        "fileSize",
        function (min: number, max: number, message = defaultMessage) {
            return this.test("fileSize", message, (v: any) => {
                if (!v) return true;
                const file = Array.isArray(v) ? v[0] : v.item?.(0);
                if (!file) return true;
                return isValidFileSize(file as File, min, max);
            });
        }
    );

    yup.addMethod<yup.MixedSchema>(
        yup.mixed,
        "filesSize",
        function (min: number, max: number, message = defaultMessage) {
            return this.test("filesSize", message, (v: any) => {
                if (!v) return true;
                const files: File[] = Array.isArray(v)
                    ? v
                    : v.item
                    ? Array.from(v as FileList)
                    : [];
                if (!files.length) return true;
                return files.every((f) => isValidFileSize(f, min, max));
            });
        }
    );
}

declare module "yup" {
    interface MixedSchema {
        fileSize(min: number, max: number, message?: string): this;
        filesSize(min: number, max: number, message?: string): this;
    }
}
