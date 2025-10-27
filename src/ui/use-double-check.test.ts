/**
 * Test suite for useDoubleCheck hook
 */

import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDoubleCheck } from "./use-double-check";

describe("useDoubleCheck", () => {
  it("should initialize with doubleCheck as false", () => {
    const { result } = renderHook(() => useDoubleCheck());
    expect(result.current.doubleCheck).toBe(false);
  });

  it("should set doubleCheck to true on first click", () => {
    const { result } = renderHook(() => useDoubleCheck());
    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.MouseEvent<HTMLButtonElement>;

    const buttonProps = result.current.getButtonProps();

    act(() => {
      buttonProps.onClick?.(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(result.current.doubleCheck).toBe(true);
  });

  it("should allow original onClick handler to execute on second click", () => {
    const { result } = renderHook(() => useDoubleCheck());
    const originalOnClick = vi.fn();
    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.MouseEvent<HTMLButtonElement>;

    // First click - should prevent default and set doubleCheck
    let buttonProps = result.current.getButtonProps({
      onClick: originalOnClick,
    });

    act(() => {
      buttonProps.onClick?.(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(result.current.doubleCheck).toBe(true);
    expect(originalOnClick).not.toHaveBeenCalled();

    // Second click - should allow original handler to execute
    vi.clearAllMocks();
    
    // Get new button props after state change
    buttonProps = result.current.getButtonProps({
      onClick: originalOnClick,
    });

    act(() => {
      buttonProps.onClick?.(mockEvent);
    });

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(originalOnClick).toHaveBeenCalledTimes(1);
  });

  it("should reset doubleCheck on blur", () => {
    const { result } = renderHook(() => useDoubleCheck());
    const mockClickEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.MouseEvent<HTMLButtonElement>;
    const mockBlurEvent = {} as React.FocusEvent<HTMLButtonElement>;

    const buttonProps = result.current.getButtonProps();

    // Set doubleCheck to true
    act(() => {
      buttonProps.onClick?.(mockClickEvent);
    });

    expect(result.current.doubleCheck).toBe(true);

    // Blur should reset it
    act(() => {
      buttonProps.onBlur?.(mockBlurEvent);
    });

    expect(result.current.doubleCheck).toBe(false);
  });

  it("should reset doubleCheck on Escape key", () => {
    const { result } = renderHook(() => useDoubleCheck());
    const mockClickEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.MouseEvent<HTMLButtonElement>;
    const mockKeyUpEvent = {
      key: "Escape",
    } as React.KeyboardEvent<HTMLButtonElement>;

    const buttonProps = result.current.getButtonProps();

    // Set doubleCheck to true
    act(() => {
      buttonProps.onClick?.(mockClickEvent);
    });

    expect(result.current.doubleCheck).toBe(true);

    // Escape key should reset it
    act(() => {
      buttonProps.onKeyUp?.(mockKeyUpEvent);
    });

    expect(result.current.doubleCheck).toBe(false);
  });

  it("should not reset doubleCheck on non-Escape keys", () => {
    const { result } = renderHook(() => useDoubleCheck());
    const mockClickEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.MouseEvent<HTMLButtonElement>;
    const mockKeyUpEvent = {
      key: "Enter",
    } as React.KeyboardEvent<HTMLButtonElement>;

    const buttonProps = result.current.getButtonProps();

    // Set doubleCheck to true
    act(() => {
      buttonProps.onClick?.(mockClickEvent);
    });

    expect(result.current.doubleCheck).toBe(true);

    // Other keys should not reset it
    act(() => {
      buttonProps.onKeyUp?.(mockKeyUpEvent);
    });

    expect(result.current.doubleCheck).toBe(true);
  });

  it("should call original onBlur handler", () => {
    const { result } = renderHook(() => useDoubleCheck());
    const originalOnBlur = vi.fn();
    const mockBlurEvent = {} as React.FocusEvent<HTMLButtonElement>;

    const buttonProps = result.current.getButtonProps({
      onBlur: originalOnBlur,
    });

    act(() => {
      buttonProps.onBlur?.(mockBlurEvent);
    });

    expect(originalOnBlur).toHaveBeenCalledWith(mockBlurEvent);
  });

  it("should call original onKeyUp handler", () => {
    const { result } = renderHook(() => useDoubleCheck());
    const originalOnKeyUp = vi.fn();
    const mockKeyUpEvent = {
      key: "Enter",
    } as React.KeyboardEvent<HTMLButtonElement>;

    const buttonProps = result.current.getButtonProps({
      onKeyUp: originalOnKeyUp,
    });

    act(() => {
      buttonProps.onKeyUp?.(mockKeyUpEvent);
    });

    expect(originalOnKeyUp).toHaveBeenCalledWith(mockKeyUpEvent);
  });

  it("should preserve other button props", () => {
    const { result } = renderHook(() => useDoubleCheck());

    const buttonProps = result.current.getButtonProps({
      type: "submit",
      disabled: false,
      className: "test-class",
    });

    expect(buttonProps.type).toBe("submit");
    expect(buttonProps.disabled).toBe(false);
    expect(buttonProps.className).toBe("test-class");
  });
});
