"use client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  Popover,
  PopoverButton,
  PopoverGroup,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "../ui/use-toast";
import { z } from "zod";
import { searchResponse, SearchValues } from "@/types/searchType";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleX, Loader2 } from "lucide-react";
import { searchSchema } from "@/app/schemas/search-schema";

const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin check
  const [searchResults, setSearchResults] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const route = useRouter();

  useEffect(() => {
    const token = Cookies.get("access_token");
    setIsLoggedIn(!!token);

    // Check if user is admin
    const userRole = Cookies.get("user"); // Assuming user is stored in cookies
    setIsAdmin(userRole === "admin");
  }, []);

  const handleLogin = () => {
    // Assuming your login process here
    Cookies.set("access_token", "your_token");
    Cookies.set("user", "admin"); // Set user role as admin for testing
    setIsLoggedIn(true);
    setIsAdmin(true); // Update state
    route.push("/dashboard"); // or any other page you want to redirect after login
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("user");
    setIsLoggedIn(false);
    setIsAdmin(false); // Update state
    route.refresh();
    route.push("/sign-in");
  };

  const onSubmit = async (data: z.infer<typeof searchSchema>) => {
    console.log("Form submitted:", data);
    setIsSubmitting(true);
    try {
      if (!data.search.trim()) {
        // If search query is empty, clear searchResults
        setSearchResults([]);
        return; // Exit early if there's no search query
      }

      const response = await axios.get(
        `http://192.168.0.247:8000/book?search=${data.search}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      console.log("Search response:", response);
      setSearchResults(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get book",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = useForm<SearchValues>({
    mode: "onTouched",
    defaultValues: {
      search: "",
    },
  });

  const { register, handleSubmit } = form;

  return (
    <header className="z-50">
      <nav
        aria-label="Global"
        className="mx-auto z-50 flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">LMS</span>
            <Image
              height={100}
              width={200}
              priority
              alt="logo"
              src="https://i.pinimg.com/736x/a7/91/0c/a7910cf32f182c9ea34022abb7839980.jpg"
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <Button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </Button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12 items-center">
          <Link
            href="/"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Home
          </Link>
          <Link
            href="/books"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Books
          </Link>
          {isAdmin && (
            <Link
              href="/dashboard"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Dashboard
            </Link>
          )}
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center space-x-2"
          >
            <input
              type="search"
              id="search"
              placeholder="Search book..."
              className="border border-black rounded p-2"
              {...register("search")}
            />
            <Button
              type="submit"
              className="text-sm font-semibold leading-6 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  searching
                </div>
              ) : (
                "Search"
              )}
            </Button>
          </form>
        </PopoverGroup>
        {isLoggedIn ? (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-4">
            <Button
              onClick={handleLogout}
              className="text-sm font-semibold leading-6 text-white"
            >
              Log out
            </Button>
          </div>
        ) : (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-4">
            <Link
              href="/sign-in"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Register
            </Link>
          </div>
        )}
      </nav>

      {/* Search Results Section */}
      <div className="flex justify-between container mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {searchResults ? (
            searchResults.map((book: searchResponse) => (
              <div
                key={book.id}
                className="bg-slate-100 overflow-hidden shadow-md rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="flex justify-between px-4 py-3">
                  <div className="px-4 py-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {book.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Author: {book.author}
                    </p>
                    <p className="text-sm text-gray-700">Genre: {book.genre}</p>
                    <p className="text-sm text-gray-700">Stock: {book.stock}</p>
                  </div>
                  <div>
                    <Image
                      src={book?.image_url}
                      alt={book.name}
                      width={150}
                      height={150}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-4 col-span-3">
              No book found.
            </p>
          )}
        </div>
        {searchResults.length > 0 ? (
          <div>
            <CircleX
              size={32}
              className="cursor-pointer text-red-500"
              onClick={() => setSearchResults([])}
            />
          </div>
        ) : null}
      </div>
      <Dialog
        as="div"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">LMS</span>
              <Image
                height={100}
                width={200}
                priority
                alt="logo"
                src="https://i.pinimg.com/736x/a7/91/0c/a7910cf32f182c9ea34022abb7839980.jpg"
                className="h-8 w-auto"
              />
            </Link>
            <Button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </Button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  href="/"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                >
                  Home
                </Link>
                <Link
                  href="/books"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                >
                  Books
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
              <div className="py-6">
                {isLoggedIn ? (
                  <Button
                    onClick={handleLogout}
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-white hover:bg-gray-400/10"
                  >
                    Log out
                  </Button>
                ) : (
                  <div className="py-6">
                    <Link
                      href="/sign-in"
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/sign-up"
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
