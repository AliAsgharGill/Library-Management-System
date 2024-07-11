"use client";
import Cookies from 'js-cookie';

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
import { searchSchema } from "@/app/schemas/serach-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { request } from "http";

const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const route = useRouter();

  useEffect(() => {
    const token = Cookies.get('access_token');
    setIsLoggedIn(!!token);
  }, []); 

  const handleLogout = () => {
    Cookies.remove("access_token");
    setIsLoggedIn(false);
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
        // `https://1a7c-193-56-116-12.ngrok-free.app/books/search-books?query=${data.search}`,
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
      const errorMessage =
        // error.response?.data?.message || "Failed to get book";
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
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
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

      {/* Mobile View */}
      <Dialog
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only text-blue-500">LMS</span>
              <Image
                height={32}
                width={100}
                alt=""
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA0rBIlDbRRXR5efoXBU57WPSTaqyyA7z_NA&s"
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
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Product
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                    />
                  </DisclosureButton>
                </Disclosure>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Marketplace
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Company
                </Link>
              </div>

              <div className="py-6 flex justify-start ">
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>
              <div className="py-6">
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

      {/* Search Results Section */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {searchResults ? (
            searchResults.map((book: searchResponse) => (
              <div
                key={book.id}
                className="bg-slate-100 overflow-hidden shadow-md rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="px-4 py-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {book.name}
                  </h3>
                  <p className="text-sm text-gray-600">Author: {book.author}</p>
                  <p className="text-sm text-gray-700">Genre: {book.genre}</p>
                </div>
                <div className="px-4 py-2">
                  <p>
                    {book.available ? (
                      <span className="text-green-500">Available</span>
                    ) : (
                      <span className="text-red-500">Not Available</span>
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-4 col-span-3">
              No book found.
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
