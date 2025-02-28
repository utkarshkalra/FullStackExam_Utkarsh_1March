import { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import Footer from "./Footer";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
  isHomeScreen?: boolean;
}

export default function Layout({
  children,
  isHomeScreen = false,
}: LayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-blue-600">
                  Shoesify
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/products"
                  className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-blue-600"
                >
                  Products
                </Link>
                {user?.isAdmin && (
                  <>
                    <Link
                      href="/admin/products"
                      className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-blue-600"
                    >
                      Manage Products
                    </Link>
                    <Link
                      href="/admin/orders"
                      className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-blue-600"
                    >
                      Manage Orders
                    </Link>
                    <Link
                      href="/reports"
                      className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-blue-600"
                    >
                      Reports
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {user ? (
                <>
                  <Link
                    href="/cart"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Cart
                  </Link>
                  <Link
                    href="/orders"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Orders
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Logout({user.name})
                  </button>
                  {user.isAdmin && (
                    <span className="text-gray-100 bg-blue-600 px-2 py-1 rounded-md">
                      Admin Logged In
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center sm:hidden">
              {user?.isAdmin && (
                <span className="text-gray-100 bg-blue-600 px-2 rounded-md pl-3 pr-4 py-2">
                  Admin Logged In
                </span>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/products"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            {user?.isAdmin && (
              <>
                <Link
                  href="/admin/products"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Products
                </Link>
                <Link
                  href="/admin/orders"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Orders
                </Link>
                <Link
                  href="/reports"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reports
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="space-y-1">
                <Link
                  href="/cart"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart
                </Link>
                <Link
                  href="/orders"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Logout({user.name})
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/login"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main
        className={`mx-auto   ${
          !isHomeScreen ? " max-w-7xl  py-6 sm:px-6 lg:px-8 px-4" : ""
        }`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
