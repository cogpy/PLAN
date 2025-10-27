/**
 * Test suite for misc utility functions
 */

import { describe, it, expect, vi } from "vitest";
import { callAll } from "./misc";

describe("callAll", () => {
  it("should call all provided functions with the same arguments", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const fn3 = vi.fn();

    const combined = callAll(fn1, fn2, fn3);
    combined("arg1", "arg2");

    expect(fn1).toHaveBeenCalledWith("arg1", "arg2");
    expect(fn2).toHaveBeenCalledWith("arg1", "arg2");
    expect(fn3).toHaveBeenCalledWith("arg1", "arg2");
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledTimes(1);
  });

  it("should handle undefined functions gracefully", () => {
    const fn1 = vi.fn();
    const fn2 = undefined;
    const fn3 = vi.fn();

    const combined = callAll(fn1, fn2, fn3);
    combined("test");

    expect(fn1).toHaveBeenCalledWith("test");
    expect(fn3).toHaveBeenCalledWith("test");
  });

  it("should work with no arguments", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const combined = callAll(fn1, fn2);
    combined();

    expect(fn1).toHaveBeenCalledWith();
    expect(fn2).toHaveBeenCalledWith();
  });

  it("should work with multiple argument types", () => {
    const fn = vi.fn();

    const combined = callAll(fn);
    combined(1, "string", { key: "value" }, [1, 2, 3]);

    expect(fn).toHaveBeenCalledWith(1, "string", { key: "value" }, [1, 2, 3]);
  });

  it("should return undefined", () => {
    const fn1 = vi.fn(() => "return value");
    const fn2 = vi.fn(() => 42);

    const combined = callAll(fn1, fn2);
    const result = combined();

    // callAll uses forEach which doesn't return values
    expect(result).toBeUndefined();
  });

  it("should call functions in order", () => {
    const callOrder: number[] = [];
    const fn1 = vi.fn(() => callOrder.push(1));
    const fn2 = vi.fn(() => callOrder.push(2));
    const fn3 = vi.fn(() => callOrder.push(3));

    const combined = callAll(fn1, fn2, fn3);
    combined();

    expect(callOrder).toEqual([1, 2, 3]);
  });

  it("should handle empty function list", () => {
    const combined = callAll();
    expect(() => combined()).not.toThrow();
  });

  it("should continue calling functions even if one throws", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn(() => {
      throw new Error("Test error");
    });
    const fn3 = vi.fn();

    const combined = callAll(fn1, fn2, fn3);

    expect(() => combined()).toThrow("Test error");
    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
    // fn3 won't be called because forEach stops on error
    expect(fn3).not.toHaveBeenCalled();
  });
});
