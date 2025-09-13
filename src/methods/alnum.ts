import * as yup from "yup";

/**
 * Check if value is alphanumeric (letters, numbers) with optional extra allowed characters.
 */
export function isAlphaNumeric(
    value?: string,
    includes: string[] = []
): boolean {
    if (!value) return false;

    // Escape special regex chars in includes
    const escaped = includes
        .map((ch) => ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("");
    const pattern = new RegExp(`^[a-zA-Z0-9${escaped}]+$`);

    return pattern.test(value);
}

/**
 * Extend Yup with `alnum` method for string schema.
 */
export function addAlphaNumericMethod(defMessage = "alnum") {
    yup.addMethod<yup.StringSchema>(
        yup.string,
        "alnum",
        function (message: string = defMessage, includes: string[] = []) {
            return this.test(
                "alnum",
                message,
                (v) => !v || isAlphaNumeric(v, includes)
            );
        }
    );
}

declare module "yup" {
    interface StringSchema {
        alphaNumeric(message?: string, includes?: string[]): this;
    }
}
