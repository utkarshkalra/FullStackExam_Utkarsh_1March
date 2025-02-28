import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "@/pages/login";
import { useRouter } from "next/router";
import * as api from "@/utils/api";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock api calls
jest.mock("@/utils/api", () => ({
  auth: {
    login: jest.fn(),
  },
}));

describe("Login Page", () => {
  const mockRouter = {
    push: jest.fn(),
    query: {},
    pathname: "/login",
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it("renders login form", () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/register here/i)).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    // HTML5 validation will prevent form submission
    expect(screen.getByLabelText(/email/i)).toBeInvalid();
    expect(screen.getByLabelText(/password/i)).toBeInvalid();
  });

  it("shows error message on failed login", async () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/invalid email or password/i)
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during login attempt", async () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/logging in\.\.\./i)).toBeInTheDocument();
  });

  it("redirects to home on successful login", async () => {
    // Mock successful login
    (api.auth.login as jest.Mock).mockResolvedValueOnce({
      data: {
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
          isAdmin: false,
        },
        token: "fake-token",
      },
    });

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);
    });

    await waitFor(
      () => {
        expect(mockRouter.push).toHaveBeenCalledWith("/");
      },
      { timeout: 2000 }
    );
  });
});
