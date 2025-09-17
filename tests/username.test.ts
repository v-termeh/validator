import { describe, it, expect } from "vitest";
import { isValidUsername } from "../src/methods/username";

describe("isValidUsername", () => {
    it("returns true for valid usernames", () => {
        expect(isValidUsername("user_123")).toBe(true);
        expect(isValidUsername("UserName")).toBe(true);
        expect(isValidUsername("user123")).toBe(true);
    });
    it("returns false for invalid usernames", () => {
        expect(isValidUsername("user name")).toBe(false);
        expect(isValidUsername("user@name")).toBe(false);
        expect(isValidUsername("")).toBe(false);
        expect(isValidUsername(undefined)).toBe(false);
    });
});
