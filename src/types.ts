import type { ComputedRef, WritableComputedRef } from "vue";

type ErrorMessages = Record<string, string>;
type FieldMessages = Record<string, ErrorMessages | string>;

export type Messages = Record<string, FieldMessages | string>;

export interface FieldContext<T = unknown, TInput = T> {
    id: string;
    value: WritableComputedRef<TInput | undefined>;
    isFailed: ComputedRef<boolean>;
    isValid: ComputedRef<boolean>;
    isDirty: ComputedRef<boolean>;
    error: ComputedRef<string | undefined>;
    errors: ComputedRef<string[]>;
    reset(value?: unknown): void;
    validate(): Promise<boolean>;
    transform(): T;
}

export interface FieldOption<T = unknown, TInput = T> {
    trigger: "change" | "submit";
    initialValue?: TInput;
    debounce?: number;
    transformer?: (value: TInput) => T;
}

export interface FormContext {
    name: string;
    registerField(name: string, field: FieldContext): void;
    clearErrors(name: string): void;
    setErrors(name: string, yupErrors: unknown): void;
    error(name: string): ComputedRef<string | undefined>;
    errors(name: string): ComputedRef<string[]>;
    isFailed(name: string): ComputedRef<boolean>;
}

export interface FormOptions {
    messages: Messages;
    locale?: string;
    focusOnError?: boolean;
}
