import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce, useDebouncedSearch } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      }
    );

    expect(result.current).toBe("initial");

    // Change value
    rerender({ value: "updated", delay: 300 });
    expect(result.current).toBe("initial"); // Should still be initial

    // Fast-forward time but not enough
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("initial");

    // Fast-forward enough time
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("updated");
  });

  it("should reset timer on rapid value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      }
    );

    // Change value multiple times quickly
    rerender({ value: "change1", delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: "change2", delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: "final", delay: 300 });

    // Should still be initial after partial time
    expect(result.current).toBe("initial");

    // Should update to final value after full delay
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("final");
  });
});

describe("useDebouncedSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should initialize with empty search query", () => {
    const mockOnSearch = vi.fn();
    const { result } = renderHook(() => useDebouncedSearch(mockOnSearch, 300));

    expect(result.current.searchQuery).toBe("");
    expect(result.current.debouncedSearchQuery).toBe("");
  });

  it("should call onSearch with debounced value", () => {
    const mockOnSearch = vi.fn();
    const { result } = renderHook(() => useDebouncedSearch(mockOnSearch, 300));

    // Update search query
    act(() => {
      result.current.setSearchQuery("test query");
    });

    expect(result.current.searchQuery).toBe("test query");
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockOnSearch).toHaveBeenCalledWith("test query");
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it("should trim search query before calling onSearch", () => {
    const mockOnSearch = vi.fn();
    const { result } = renderHook(() => useDebouncedSearch(mockOnSearch, 300));

    act(() => {
      result.current.setSearchQuery("  test query  ");
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockOnSearch).toHaveBeenCalledWith("test query");
  });

  it("should handle empty search query after typing", () => {
    const mockOnSearch = vi.fn();
    const { result } = renderHook(() => useDebouncedSearch(mockOnSearch, 300));

    // First type something
    act(() => {
      result.current.setSearchQuery("test");
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockOnSearch).toHaveBeenCalledWith("test");

    // Then clear it
    act(() => {
      result.current.setSearchQuery("");
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockOnSearch).toHaveBeenCalledWith("");
    expect(mockOnSearch).toHaveBeenCalledTimes(2);
  });

  it("should debounce rapid search query changes", () => {
    const mockOnSearch = vi.fn();
    const { result } = renderHook(() => useDebouncedSearch(mockOnSearch, 300));

    // Rapid changes
    act(() => {
      result.current.setSearchQuery("a");
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      result.current.setSearchQuery("ab");
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      result.current.setSearchQuery("abc");
    });

    // Should not have called onSearch yet
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward full delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should only call once with final value
    expect(mockOnSearch).toHaveBeenCalledWith("abc");
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });
});
