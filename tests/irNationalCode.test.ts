import { describe, it, expect } from "vitest";
import { isValidIranianNationalCode } from "../src/methods/irNationalCode";

describe("isValidIranianNationalCode", () => {
    it("returns true for valid national codes", () => {
        expect(isValidIranianNationalCode("0013520849")).toBe(true);
        expect(isValidIranianNationalCode("0084575948")).toBe(true);
    });
    it("returns false for invalid or malformed codes", () => {
        expect(isValidIranianNationalCode("0013520840")).toBe(false);
        expect(isValidIranianNationalCode("123456789")).toBe(false);
        expect(isValidIranianNationalCode("")).toBe(false);
        expect(isValidIranianNationalCode(undefined)).toBe(false);
    });
});
