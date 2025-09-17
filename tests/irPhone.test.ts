import { describe, it, expect } from "vitest";
import { isValidIranianPhone } from "../src/methods/irPhone";

describe("isValidIranianPhone", () => {
    it("returns true for valid Iranian phone numbers", () => {
        expect(isValidIranianPhone("02123456789")).toBe(true);
        expect(isValidIranianPhone("04123456789")).toBe(true);
    });
    it("returns false for invalid or malformed numbers", () => {
        expect(isValidIranianPhone("1234567890")).toBe(false);
        expect(isValidIranianPhone("0212345678")).toBe(false);
        expect(isValidIranianPhone("")).toBe(false);
        expect(isValidIranianPhone(undefined)).toBe(false);
    });
});
