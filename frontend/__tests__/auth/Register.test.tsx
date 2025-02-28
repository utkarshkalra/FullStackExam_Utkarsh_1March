import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { AuthProvider } from "@/contexts/AuthContext";
import Register from "@/pages/register";
import { useRouter } from "next/router";
import * as api from "@/utils/api";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/utils/api", () => ({
  auth: {
    register: jest.fn(),
  },
}));

describe("Register Page", () => {
  const mockRouter = {
    push: jest.fn(),
    query: {},
    pathname: "/register",
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it("renders registration form", () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delivery address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    const submitButton = screen.getByRole("button", { name: /register/i });
    fireEvent.click(submitButton);

    // HTML5 validation will prevent form submission
    expect(screen.getByLabelText(/name/i)).toBeInvalid();
    expect(screen.getByLabelText(/email/i)).toBeInvalid();
    expect(screen.getByLabelText(/delivery address/i)).toBeInvalid();
    expect(screen.getByLabelText(/^password$/i)).toBeInvalid();
    expect(screen.getByLabelText(/confirm password/i)).toBeInvalid();
  });

  it("shows error when passwords don't match", async () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/delivery address/i), {
      target: { value: "123 Test St" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("shows loading state during registration", async () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    // Fill in all fields correctly
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/delivery address/i), {
      target: { value: "123 Test St" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(screen.getByText(/creating account\.\.\./i)).toBeInTheDocument();
  });

  it("redirects to home on successful registration", async () => {
    // Mock successful registration
    (api.auth.register as jest.Mock).mockResolvedValueOnce({
      data: {
        user: {
          id: "cd4f0475-3811-44f2-a017-36242fdaaaa5",
          email: "test@example.com",
          name: "Test User",
        },
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjZDRmMDQ3NS0zODExLTQ0ZjItYTAxNy0zNjI0MmZkYWFhYTUiLCJpYXQiOjE3NDA2OTA0MDEsImV4cCI6MTc0MDc3NjgwMX0.TX6t62g5u2SJ-poApZcIggEX_q173E3oBYQQvnn4r-I",
      },
    });

    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    // Fill in all fields correctly
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/delivery address/i), {
      target: { value: "123 Test St" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /register/i }));
    });

    await waitFor(
      () => {
        expect(mockRouter.push).toHaveBeenCalledWith("/");
      },
      { timeout: 2000 }
    );
  });
});
