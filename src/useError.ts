import type { Messages } from "./types";
import { computed, ref } from "vue";
import { ValidationError } from "yup";
import { isArray, isObject } from "@v-termeh/utils";
import { useLocalization } from "./useLocalization";

export type Errors = Record<string, Record<string, string>>;

export function useErrors(locale: string, messages: Messages) {
    const validationErrors = ref<Errors>({});
    const { findMessage } = useLocalization(messages);

    /** Normalize path: converts bracket notation to dot notation */
    function flatternKey(path: string): string {
        return path
            .replace(/\[(\d+)\]/g, ".$1")
            .replace(/\.+/g, ".")
            .replace(/^\./, "")
            .replace(/\.$/, "");
    }

    /** Normalize array indices to "*" in a path string */
    function asterisksKey(path: string): string {
        return flatternKey(path)
            .split(".")
            .map((part) => (/^\d+$/.test(part) ? "*" : part))
            .join(".");
    }

    /** Computed: first error message for a field */
    function error(field: string) {
        return computed(() => {
            const errs = validationErrors.value[field];
            if (
                isObject<Record<string, string>>(errs) &&
                Object.values(errs).length > 0
            ) {
                return Object.values(errs)[0];
            }
            return undefined;
        });
    }

    /** Computed: all error messages for a field */
    function errors(field: string) {
        return computed(() => {
            const errs = validationErrors.value[field];
            if (
                isObject<Record<string, string>>(errs) &&
                Object.values(errs).length > 0
            ) {
                return Object.values(errs);
            }
            return [];
        });
    }

    /** Computed: check if a field has any errors */
    function isFailed(field: string) {
        return computed(() => {
            const errs = validationErrors.value[field];
            return (
                isObject<Record<string, string>>(errs) &&
                Object.keys(errs).length > 0
            );
        });
    }

    /** clear all errors for field */
    function clearError(path: string) {
        delete validationErrors.value[flatternKey(path)];
        delete validationErrors.value[asterisksKey(path)];
    }

    /** clear all errors */
    function reset() {
        validationErrors.value = {};
    }

    /** Push an error into state with optional localized message */
    function pushError(path: string, error: string, message?: string) {
        path = path.trim();
        error = error.trim();
        if (!path || !error) return;

        const flatternK = flatternKey(path);
        const asterisksK = asterisksKey(path);

        if (!validationErrors.value[flatternK]) {
            validationErrors.value[flatternK] = {};
        }

        const flatternM =
            message ||
            findMessage(locale, flatternK, error) ||
            findMessage(locale, asterisksK, error) ||
            error;
        validationErrors.value[flatternK][error] = flatternM;

        if (asterisksK !== flatternK) {
            if (!validationErrors.value[asterisksK]) {
                validationErrors.value[asterisksK] = {};
            }

            const asterisksM =
                message ||
                findMessage(locale, asterisksK, error) ||
                findMessage(locale, flatternK, error) ||
                error;
            validationErrors.value[asterisksK][error] = asterisksM;
        }
    }

    /** Parse a single Yup ValidationError for a given field */
    function parseYupError(field: string, e: unknown) {
        clearError(field);
        // Type guard for Yup ValidationError
        if (
            isObject<ValidationError>(e) &&
            isArray(e.errors) &&
            typeof e.path === "string"
        ) {
            for (const err of e.errors) {
                pushError(field, err);
            }
        }
    }

    /** Parse one or many Yup ValidationErrors */
    function parseYupErrors(e: unknown) {
        reset();
        if (isArray(e) && e.every(isObject<ValidationError>)) {
            for (const field of e) {
                parseYupError(field.path || "", field);
            }
        } else if (isObject<ValidationError>(e)) {
            parseYupError(e.path || "", e);
        }
    }

    /** Parse server errors from common response formats (github.com/go-universal/validator) */
    function parseServerErrors(result: unknown) {
        reset();
        if (isObject<Record<string, unknown>>(result)) {
            for (const field in result) {
                const errors = result[field];
                if (isObject<Record<string, string>>(errors)) {
                    for (const e in errors) {
                        pushError(field, e, errors[e].trim() || undefined);
                    }
                } else if (isArray<string>(errors)) {
                    for (const e of errors
                        .map((i) => i.trim())
                        .filter(Boolean)) {
                        pushError(field, e);
                    }
                } else if (errors) {
                    pushError(field, String(errors));
                }
            }
        }
    }

    return {
        validationErrors,
        error,
        errors,
        isFailed,
        clearError,
        reset,
        pushError,
        parseYupError,
        parseYupErrors,
        parseServerErrors,
    };
}
