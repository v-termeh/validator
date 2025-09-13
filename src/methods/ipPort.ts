import * as yup from "yup";

/**
 * Check if the input is a valid IP:Port combination.
 */
export function isValidIPPort(ipPort?: string): boolean {
    if (!ipPort) return false;

    // Find the last colon to separate port
    const lastColonIndex = ipPort.lastIndexOf(":");
    if (lastColonIndex === -1) return false;

    const ip = ipPort.slice(0, lastColonIndex);
    const portStr = ipPort.slice(lastColonIndex + 1);

    // Validate IP (IPv4 or IPv6)
    const ipv4 =
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    const ipv6 =
        /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(::([0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}))$/;
    const isIPValid = ipv4.test(ip) || ipv6.test(ip);
    if (!isIPValid) return false;

    // Validate port
    const port = Number(portStr);
    if (!Number.isInteger(port) || port < 1 || port > 65535) return false;

    return true;
}

/**
 * Extend Yup with `ipPort` method for string schema.
 */
export function addIPPortMethod(defMessage = "ip_port") {
    yup.addMethod<yup.StringSchema>(
        yup.string,
        "ipPort",
        function (message: string = defMessage) {
            return this.test("ipPort", message, (v) => !v || isValidIPPort(v));
        }
    );
}

declare module "yup" {
    interface StringSchema {
        ipPort(message?: string): this;
    }
}
