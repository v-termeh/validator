import type { FieldContext, FieldOption, FormContext } from "./types";
import { ref, computed } from "vue";
import { Schema } from "yup";
import { customAlphabet } from "nanoid";

/**
 * Composable for managing the state and validation of a single form field.
 *
 * Provides reactive value tracking, validation with cancellation via token,
 * debounce support, transformation of input values, and integration with a parent FormContext.
 *
 * @param ctx - Form context instance for registering the field and managing errors.
 * @param name - Unique field name within the form.
 * @param schema - Yup schema used for validation of the field value.
 * @param options - Optional configuration for trigger behavior, initial value, debounce, and transformer.
 * @returns A reactive Field object with value, state flags, errors, and utility methods.
 */
export function useField<T = unknown, TInput = T>(
    ctx: FormContext,
    name: string,
    schema: Schema<T>,
    options: Partial<FieldOption<T, TInput>> = {}
): FieldContext<T, TInput> {
    const {
        trigger = "submit",
        initialValue,
        debounce = 200,
        cast = false,
        transformer,
    } = options;

    const id = customAlphabet(
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        6
    )();
    const touched = ref(false);
    const data = ref<TInput | undefined>(initialValue);

    let currentValidateToken = 0;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const value = computed<TInput | undefined>({
        get: () => data.value,
        set: (v) => {
            if (data.value !== v) {
                touched.value = true;
                data.value = v;

                if (trigger === "change") {
                    if (debounceTimer) clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        validate();
                    }, debounce);
                }
            }
        },
    });

    /** Clear all errors and reset field */
    function reset(value?: unknown) {
        touched.value = false;
        data.value = value ?? initialValue;
        ctx.clearErrors(name);
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
    }

    function transform(): T {
        return transformer?.(value.value as TInput) ?? (value.value as T);
    }

    /**
     * Validates the field value.
     * Uses token-based cancellation to invalidate previous concurrent validations.
     */
    async function validate(): Promise<boolean> {
        const token = ++currentValidateToken;

        try {
            data.value = cast ? schema.cast(data.value) : data.value;
            await schema.validate(data.value);

            // If another validate has started meanwhile, discard this result
            if (token !== currentValidateToken) return false;

            ctx.clearErrors(name);
            return true;
        } catch (err) {
            if (token !== currentValidateToken) return false;
            ctx.setErrors(name, err);
            return false;
        }
    }

    const field: FieldContext<T, TInput> = {
        id: [ctx.name, name, id].join("-"),
        value,
        error: ctx.error(name),
        errors: ctx.errors(name),
        isFailed: ctx.isFailed(name),
        isValid: computed(() => !ctx.isFailed(name).value),
        isDirty: computed(() => touched.value),
        reset,
        validate,
        transform,
    };

    ctx.registerField(name, field);

    return field;
}
