import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import * as api from "@/utils/api";

// Mock the API
jest.mock("@/utils/api", () => ({
  auth: {
    getProfile: jest.fn(),
  },
  setAuthToken: jest.fn(),
}));

describe("AuthContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it("initializes with null user and loading true", async () => {
    // Mock the getProfile to return a delayed promise that never resolves during this test
    (api.auth.getProfile as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Check initial state immediately
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    // No need to wait for loading to complete in this test
    // since we're only testing initial state
  });

  it("loads user profile when token exists", async () => {
    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
    };

    // Setup
    window.localStorage.setItem("token", "fake-token");
    (api.auth.getProfile as jest.Mock).mockResolvedValueOnce({
      data: mockUser,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Wait for the useEffect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(api.auth.getProfile).toHaveBeenCalled();
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it("handles failed profile fetch", async () => {
    // Setup
    window.localStorage.setItem("token", "fake-token");
    (api.auth.getProfile as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(window.localStorage.getItem("token")).toBeNull();
  });

  it("handles logout correctly", () => {
    // Setup initial state with a user
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Perform logout
    act(() => {
      result.current.logout();
    });

    // Verify state after logout
    expect(result.current.user).toBeNull();
    expect(window.localStorage.getItem("token")).toBeNull();
  });
});
