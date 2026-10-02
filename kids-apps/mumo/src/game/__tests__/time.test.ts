import { describe, expect, it } from "vitest";
import { getDayPhase, isOutdoorPlayAvailable, isSchoolOpen } from "../time";

const at = (hour: number, minute = 0) => new Date(2026, 8, 22, hour, minute).getTime();

describe("shared day phase", () => {
  it("treats 07:00–17:59 as day and the rest as night", () => {
    expect(getDayPhase(at(7))).toBe("day");
    expect(getDayPhase(at(17, 59))).toBe("day");
    expect(getDayPhase(at(18))).toBe("night");
    expect(getDayPhase(at(6, 59))).toBe("night");
  });
});

describe("school opening hours", () => {
  it("allows departure only between 07:00 and 17:29", () => {
    expect(isSchoolOpen(at(7))).toBe(true);
    expect(isSchoolOpen(at(17, 20))).toBe(true);
    expect(isSchoolOpen(at(17, 30))).toBe(false);
    expect(isSchoolOpen(at(20, 34))).toBe(false);
    expect(isSchoolOpen(at(6, 30))).toBe(false);
  });
});

describe("outdoor play", () => {
  it("is unavailable at night", () => {
    expect(isOutdoorPlayAvailable(at(10))).toBe(true);
    expect(isOutdoorPlayAvailable(at(20, 30))).toBe(false);
  });
});
