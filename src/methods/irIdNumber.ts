import { extractNumeric } from "@v-termeh/utils";
import * as yup from "yup";

/**
 * Check if Iranian ID number (birth certificate) is valid.
 * Format: 1 to 10 digits.
 */
export function isValidIranianIdNumber(id?: string): boolean {
    if (!id) return false;
    return /^[0-9]{1,10}$/.test(extractNumeric(id));
}

/**
 * Extend Yup with `iranianIdNumber` method for string schema.
 */
export function addIranianIdNumberMethod(defMessage = "id_number") {
    yup.addMethod<yup.StringSchema>(
        yup.string,
        "iranianIdNumber",
        function (message: string = defMessage) {
            return this.test(
                "iranianIdNumber",
                message,
                (v) => !v || isValidIranianIdNumber(v)
            );
        }
    );
}

declare module "yup" {
    interface StringSchema {
        iranianIdNumber(message?: string): this;
    }
}
