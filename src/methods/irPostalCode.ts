import { extractNumeric } from "@v-termeh/utils";
import * as yup from "yup";

/**
 * Check if Iranian postal code is valid.
 * Format: exactly 10 digits.
 */
export function isValidIranianPostalCode(postalCode?: string): boolean {
    if (!postalCode) return false;
    return /^[0-9]{10}$/.test(extractNumeric(postalCode));
}

/**
 * Extend Yup with `iranianPostalCode` method for string schema.
 */
export function addIranianPostalCodeMethod(defMessage = "postal_code") {
    yup.addMethod<yup.StringSchema>(
        yup.string,
        "iranianPostalCode",
        function (message: string = defMessage) {
            return this.test(
                "iranianPostalCode",
                message,
                (v) => !v || isValidIranianPostalCode(v)
            );
        }
    );
}

declare module "yup" {
    interface StringSchema {
        iranianPostalCode(message?: string): this;
    }
}
