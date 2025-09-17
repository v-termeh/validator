import { describe, it, expect } from "vitest";
import { isValidIranianIBAN } from "../src/methods/irIBAN";

describe("isValidIranianIBAN", () => {
    it("returns true for valid IBANs", () => {
        expect(isValidIranianIBAN("IR47 0120 0200 0000 9978 9632 69")).toBe(
            true
        );
        expect(isValidIranianIBAN("610610000000100845521649")).toBe(true); // without IR
    });
    it("returns false for invalid IBANs", () => {
        expect(isValidIranianIBAN("IR000000000000000000000000")).toBe(false);
        expect(isValidIranianIBAN("")).toBe(false);
        expect(isValidIranianIBAN(undefined)).toBe(false);
    });
});
