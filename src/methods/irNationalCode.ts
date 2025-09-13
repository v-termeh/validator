import { extractNumeric } from "@v-termeh/utils";
import * as yup from "yup";

/**
 * Check if Iranian National ID (کد ملی) is valid using official checksum algorithm.
 * Format: exactly 10 digits with checksum verification.
 */
export function isValidIranianNationalCode(nationalCode?: string): boolean {
    if (!nationalCode) return false;
    nationalCode = extractNumeric(nationalCode);

    // Must be exactly 10 digits
    if (!/^[0-9]{10}$/.test(nationalCode)) return false;

    const digits = nationalCode.split("").map(Number);
    const check = digits[9];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += digits[i] * (10 - i);
    }

    const remainder = sum % 11;

    if (remainder < 2) {
        return check === remainder;
    } else {
        return check === 11 - remainder;
    }
}

/**
 * Extend Yup with `iranianNationalCode` method for string schema.
 */
export function addIranianNationalCodeMethod(defMessage = "national_code") {
    yup.addMethod<yup.StringSchema>(
        yup.string,
        "iranianNationalCode",
        function (message: string = defMessage) {
            return this.test(
                "iranianNationalCode",
                message,
                (v) => !v || isValidIranianNationalCode(v)
            );
        }
    );
}

declare module "yup" {
    interface StringSchema {
        iranianNationalCode(message?: string): this;
    }
}
