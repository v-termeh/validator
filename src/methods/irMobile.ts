import { extractNumeric } from "@v-termeh/utils";
import * as yup from "yup";

/**
 * Check if Iranian mobile number is valid.
 * Format: starts with 09, then 9 digits (total 11 digits).
 */
export function isValidIranianMobile(mobile?: string): boolean {
    if (!mobile) return false;
    return /^09[0-9]{9}$/.test(extractNumeric(mobile));
}

/**
 * Extend Yup with `iranianMobile` method for string schema.
 */
export function addIranianMobileMethod(defMessage = "mobile") {
    yup.addMethod<yup.StringSchema>(
        yup.string,
        "iranianMobile",
        function (message: string = defMessage) {
            return this.test(
                "iranianMobile",
                message,
                (v) => !v || isValidIranianMobile(v)
            );
        }
    );
}

declare module "yup" {
    interface StringSchema {
        iranianMobile(message?: string): this;
    }
}
