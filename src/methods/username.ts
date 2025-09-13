import * as yup from "yup";

/**
 * Check if username is valid (only letters, numbers, and underscores).
 */
export function isValidUsername(username?: string): boolean {
    if (!username) return false;
    return /^[a-zA-Z0-9_]+$/.test(username);
}

/**
 * Extend Yup with `username` method for string schema.
 */
export function addUsernameMethod(defMessage = "username") {
    yup.addMethod<yup.StringSchema>(
        yup.string,
        "username",
        function (message: string = defMessage) {
            return this.test(
                "username",
                message,
                (v) => !v || isValidUsername(v)
            );
        }
    );
}

declare module "yup" {
    interface StringSchema {
        username(message?: string): this;
    }
}
