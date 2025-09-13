import * as yup from "yup";

/**
 * Check if value is alphanumeric with Persian (English letters, Persian letters, numbers)
 * and optional extra allowed characters.
 */
export function isAlphaNumericWithPersian(
    value?: string,
    includes: string[] = []
): boolean {
    if (!value) return false;

    // Persian Unicode range + specific chars: پ چ ژ گ (etc.)
    const persianChars = "\u0600-\u06FF\uFB8A\u067E\u0686\u0698\u06AF";

    // Escape extra chars
    const escaped = includes
        .map((ch) => ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("");

    // Build regex
    const pattern = new RegExp(`^[a-zA-Z0-9${persianChars}${escaped}]+$`);

    return pattern.test(value);
}

/**
 * Extend Yup with `alphaNumericWithPersian` method for string schema.
 */
export function addAlphaNumericWithPersianMethod(defMessage = "alnumfa") {
    yup.addMethod<yup.StringSchema>(
        yup.string,
        "alnumfa",
        function (message: string = defMessage, includes: string[] = []) {
            return this.test(
                "alnumfa",
                message,
                (v) => !v || isAlphaNumericWithPersian(v, includes)
            );
        }
    );
}

declare module "yup" {
    interface StringSchema {
        alphaNumericWithPersian(message?: string, includes?: string[]): this;
    }
}
