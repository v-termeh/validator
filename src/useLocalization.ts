import type { Messages } from "./types";
import { isObject, isString } from "@v-termeh/utils";

/**
 * Composable helper for resolving localized error messages.
 *
 * @param messages - A nested Messages object containing localized strings.
 * @returns An object with the `findMessage` function.
 *
 * @function findMessage
 * @param locale - Current locale (e.g., "en", "fa", "*").
 * @param field - The name of the form field (e.g., "email").
 * @param error - The validation error code (e.g., "required", "min").
 * @returns The localized error message if found, or `undefined` if no match exists.
 */
export function useLocalization(messages: Messages) {
    function isValidMesssage(m: unknown): m is string {
        return !!m && isString(m) && !!m.trim();
    }

    function findMessage(
        locale: string,
        field: string,
        error: string
    ): string | undefined {
        if (!isObject(messages)) return undefined;

        // Field: Exact
        if (isObject(messages[locale]) && isObject(messages[locale][field])) {
            if (isValidMesssage(messages[locale][field][error])) {
                return messages[locale][field][error];
            }
        }

        // Field: Global Exact
        if (isObject(messages["*"]) && isObject(messages["*"][field])) {
            if (isValidMesssage(messages["*"][field][error])) {
                return messages["*"][field][error];
            }
        }

        // Field: Fallback
        if (isObject(messages[locale]) && isObject(messages[locale][field])) {
            if (isValidMesssage(messages[locale][field]["*"])) {
                return messages[locale][field]["*"];
            }
        }

        // Field: Global Fallback
        if (isObject(messages["*"]) && isObject(messages["*"][field])) {
            if (isValidMesssage(messages["*"][field]["*"])) {
                return messages["*"][field]["*"];
            }
        }

        // Locale: Fallback
        if (
            isObject(messages[locale]) &&
            isValidMesssage(messages[locale]["*"])
        ) {
            return messages[locale]["*"];
        }

        // *: Fallback
        if (isObject(messages["*"]) && isValidMesssage(messages["*"]["*"])) {
            return messages["*"]["*"];
        }

        return undefined;
    }

    return { findMessage };
}
