import * as yup from "yup";

/**
 * Check if the input is a valid IP address (IPv4 or IPv6).
 */
export function isValidIP(ip?: string): boolean {
    if (!ip) return false;

    // IPv4 regex
    const ipv4 =
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

    // IPv6 regex (simplified, covers standard notation)
    const ipv6 =
        /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:))|(::([0-9a-fA-F]{1,4}:){0,5}([0-9a-fA-F]{1,4}|:))$/;

    return ipv4.test(ip) || ipv6.test(ip);
}

/**
 * Extend Yup with `ip` method for string schema.
 */
export function addIPMethod(defMessage = "ip") {
    yup.addMethod<yup.StringSchema>(
        yup.string,
        "ip",
        function (message: string = defMessage) {
            return this.test("ip", message, (v) => !v || isValidIP(v));
        }
    );
}

declare module "yup" {
    interface StringSchema {
        ip(message?: string): this;
    }
}
