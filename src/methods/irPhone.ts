import { extractNumeric } from "@v-termeh/utils";
import * as yup from "yup";

/**
 * Check if Iranian phone number is valid.
 * Format: starts with 0, then [1-9], then 9 digits (total 11 digits).
 */
export function isValidIranianPhone(phone?: string): boolean {
    if (!phone) return false;
    return /^0[1-9][0-9]{9}$/.test(extractNumeric(phone));
}

/**
 * Extend Yup with `iranianPhone` method for string schema.
 */
export function addIranianPhoneMethod(defMessage = "phone") {
    yup.addMethod<yup.StringSchema>(
        yup.string,
        "iranianPhone",
        function (message: string = defMessage) {
            return this.test(
                "iranianPhone",
                message,
                (v) => !v || isValidIranianPhone(v)
            );
        }
    );
}

declare module "yup" {
    interface StringSchema {
        iranianPhone(message?: string): this;
    }
}
