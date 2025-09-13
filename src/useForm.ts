import type { FormContext, FormOptions, FieldContext } from "./types";
import { computed, ref, nextTick } from "vue";
import { useErrors } from "./useError";
import { isObject } from "@v-termeh/utils";

/**
 * Composable for managing a reactive form with validation, submission, and error handling.
 *
 * Features:
 * - Tracks fields, errors, submission state, and validity.
 * - Supports callbacks for pass/fail submissions.
 * - Integrates with Yup validation and server-side errors.
 * - Provides form data transformation via fields' `transformed()` method.
 * - Prevents duplicate submissions and handles HTML form events.
 * - Automatically scrolls to the first invalid field on fail.
 *
 * @param name - Unique form name.
 * @param options - Optional configuration (messages, locale, etc.).
 * @returns A reactive form API including context, validity, submit methods, and error management.
 */
export function useForm<T = Record<string, unknown>>(
    name: string,
    options: Partial<FormOptions> = {}
) {
    const { messages = {}, locale = "*", focusOnError = true } = options;

    // Errors management
    const errors = useErrors(locale, isObject(messages) ? messages || {} : {});

    // Stats
    const submits = ref(0);
    const submitting = ref(false);
    const fields = ref(new Map<string, FieldContext>());
    let passCallback: ((data: T) => void) | null = null;
    let failCallback: ((internalError?: unknown) => void) | null = null;

    // Context API for fields

    function registerField(name: string, field: FieldContext) {
        fields.value.set(name, field as any);
    }

    const ctx: FormContext = {
        name,
        registerField,
        clearErrors: errors.clearError,
        setErrors: errors.parseYupError,
        error: errors.error,
        errors: errors.errors,
        isFailed: errors.isFailed,
    };

    // Computed states
    const values = computed(() => {
        const result: Record<string, unknown> = {};
        for (const [name, field] of fields.value) {
            result[name] = field.value;
        }
        return result as T;
    });

    const transformed = computed(() => {
        const result: Record<string, unknown> = {};
        for (const [name, field] of fields.value) {
            result[name] = field.transform();
        }
        return result as T;
    });

    const isValid = computed(
        () =>
            !(
                isObject(errors.validationErrors.value) &&
                Object.keys(errors.validationErrors.value).length > 0
            )
    );

    const isFailed = computed(
        () =>
            isObject(errors.validationErrors.value) &&
            Object.keys(errors.validationErrors.value).length > 0
    );

    const isSubmitting = computed(() => submitting.value);

    const isSubmitted = computed(() => submits.value > 0);

    const submissionCount = computed(() => submits.value);

    // Global APIs
    function reset(values: Record<string, unknown> = {}) {
        for (const [name, field] of fields.value) {
            field.reset(values[name]);
        }
    }

    async function submit(event?: Event) {
        // Prevent HTML form default submission
        event?.preventDefault?.();

        // Prevent duplicate submit
        if (submitting.value) return;
        submitting.value = true;
        submits.value += 1;

        // Clear previous validation errors
        errors.reset();

        try {
            const results = await Promise.all(
                Array.from(fields.value.values()).map((f) => f.validate())
            );

            const hasError = results.some((r) => !r);

            if (hasError) {
                scrollToFirstError();
                failCallback?.();
            } else {
                passCallback?.(transformed.value);
            }
        } catch (reason) {
            failCallback?.(reason);
        } finally {
            submitting.value = false;
        }
    }

    function onPass(callback: (data: T) => void) {
        passCallback = callback;
    }

    function onFail(callback: () => void) {
        failCallback = callback;
    }

    function invalidate(field: string, rule: string) {
        errors.pushError(field, rule);
    }

    function parseErrorResponse(err: unknown) {
        errors.parseServerErrors(err);
    }

    // Helpers
    function toFormData(values: Record<string, unknown>): FormData {
        const data = new FormData();

        for (const key in values) {
            const value = values[key];

            if (value === undefined) continue;

            // Single File
            if (value instanceof File) {
                data.append(key, value);
                continue;
            }

            // Array or FileList of Files
            if (Array.isArray(value) && value.every((v) => v instanceof File)) {
                Array.from(value as File[]).forEach((f) => data.append(key, f));
                continue;
            }

            // Arrays or Objects -> JSON string
            if (typeof value === "object") {
                data.append(key, JSON.stringify(value));
                continue;
            }

            // Other values (string, number, boolean)
            data.append(key, String(value));
        }

        return data;
    }

    function scrollToFirstError() {
        for (const [name, field] of fields.value) {
            if (errors.isFailed(name).value) {
                nextTick(() => {
                    const el =
                        document.getElementById(field.id) ||
                        document.querySelector(`[data-id="${field.id}"]`);
                    if (el && focusOnError) {
                        el?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                        el?.focus?.();
                    }
                });
                break;
            }
        }
    }

    return {
        ctx,
        values,
        transformed,
        isValid,
        isFailed,
        isSubmitting,
        isSubmitted,
        submissionCount,
        reset,
        submit,
        onPass,
        onFail,
        invalidate,
        parseErrorResponse,
        toFormData,
        scrollToFirstError,
    };
}
