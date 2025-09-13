import { extractNumeric } from "@v-termeh/utils";
import * as yup from "yup";

/**
 * Check if Iranian bank card number is valid using Luhn algorithm.
 * Format: exactly 16 digits.
 */
export function isValidIranianBankCard(cardNumber?: string): boolean {
    if (!cardNumber) return false;
    cardNumber = extractNumeric(cardNumber);

    // Must be exactly 16 digits
    if (!/^[0-9]{16}$/.test(cardNumber)) return false;

    let sum = 0;
    let alternate = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let n = parseInt(cardNumber[i], 10);
        if (alternate) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alternate = !alternate;
    }

    return sum % 10 === 0;
}

/**
 * Extend Yup with `iranianBankCard` method for string schema.
 */
export function addIranianBankCardMethod(defMessage = "bank_card") {
    yup.addMethod<yup.StringSchema>(
        yup.string,
        "iranianBankCard",
        function (message: string = defMessage) {
            return this.test(
                "iranianBankCard",
                message,
                (v) => !v || isValidIranianBankCard(v)
            );
        }
    );
}

declare module "yup" {
    interface StringSchema {
        iranianBankCard(message?: string): this;
    }
}
