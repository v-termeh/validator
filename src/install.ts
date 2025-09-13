import { setLocale } from "yup";
import {
    addAlphaNumericMethod,
    addAlphaNumericWithPersianMethod,
    addFileSizeMethod,
    addFileTypeMethod,
    addIPMethod,
    addIPPortMethod,
    addIranianBankCardMethod,
    addIranianIBANMethod,
    addIranianIdNumberMethod,
    addIranianMobileMethod,
    addIranianNationalCodeMethod,
    addIranianPhoneMethod,
    addIranianPostalCodeMethod,
    addUsernameMethod,
} from "./methods";

type ExtraMethods =
    | "alnum"
    | "alnumfa"
    | "file_size"
    | "file_type"
    | "ip"
    | "ip_port"
    | "ir_bank_card"
    | "ir_iban"
    | "ir_id_number"
    | "ir_mobile"
    | "ir_national_code"
    | "ir_phone"
    | "ir_postal_code"
    | "username";

export function installValidator(...extraMethods: ExtraMethods[]) {
    setLocale({
        mixed: {
            required: "required",
            oneOf: "oneOf",
            notOneOf: "notOneOf",
            notType: "notType",
            defined: "defined",
        },

        string: {
            length: "length",
            min: "min",
            max: "max",
            matches: "matches",
            email: "email",
            url: "url",
            uuid: "uuid",
            trim: "trim",
            lowercase: "lowercase",
            uppercase: "uppercase",
        },

        number: {
            min: "min",
            max: "max",
            lessThan: "lessThan",
            moreThan: "moreThan",
            positive: "positive",
            negative: "negative",
            integer: "integer",
        },

        date: {
            min: "min",
            max: "max",
        },

        object: {
            noUnknown: "noUnknown",
        },

        array: {
            length: "length",
            min: "min",
            max: "max",
        },
        boolean: {
            isValue: "isValue",
        },
    });

    if (extraMethods.includes("alnum")) {
        addAlphaNumericMethod();
    }

    if (extraMethods.includes("alnumfa")) {
        addAlphaNumericWithPersianMethod();
    }

    if (extraMethods.includes("file_size")) {
        addFileSizeMethod();
    }

    if (extraMethods.includes("file_type")) {
        addFileTypeMethod();
    }

    if (extraMethods.includes("ip")) {
        addIPMethod();
    }

    if (extraMethods.includes("ip_port")) {
        addIPPortMethod();
    }

    if (extraMethods.includes("ir_bank_card")) {
        addIranianBankCardMethod();
    }

    if (extraMethods.includes("ir_iban")) {
        addIranianIBANMethod();
    }

    if (extraMethods.includes("ir_id_number")) {
        addIranianIdNumberMethod();
    }

    if (extraMethods.includes("ir_mobile")) {
        addIranianMobileMethod();
    }

    if (extraMethods.includes("ir_national_code")) {
        addIranianNationalCodeMethod();
    }

    if (extraMethods.includes("ir_phone")) {
        addIranianPhoneMethod();
    }

    if (extraMethods.includes("ir_postal_code")) {
        addIranianPostalCodeMethod();
    }

    if (extraMethods.includes("username")) {
        addUsernameMethod();
    }
}
