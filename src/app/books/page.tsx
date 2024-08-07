"use client";
import { bookTypes } from "@/types/bookDetails";
import axios from "axios";
import { Icon, PlayCircleIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Books = () => {
  const [books, setBooks] = useState([]);

  const route = useRouter();

  const getBooks = async () => {
    try {
      const response = await axios.get("http://192.168.0.247:8000/book/");
      console.log("Books:", response.data);
      setBooks(response.data);
    } catch (error) {
      console.log("Error in getting books", error);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="mx-20">
      <h1 className="text-3xl font-bold mb-6">Available Books</h1>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books ? (
            books.map((book: bookTypes) => (
              <div
                key={book.uuid}
                className="bg-slate-100 overflow-hidden flex justify-between px-4 py-3 shadow-md rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="px-4 py-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {book.name}
                  </h3>
                  <p className="text-sm text-gray-600">Author: {book.author}</p>
                  <p className="text-sm text-gray-700">Genre: {book.genre}</p>
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
            ))
          ) : (
            <div>
              <Image
                src="/notFound.svg"
                alt="No books available"
                width={150}
                height={150}
                className="object-cover"
              />
              <p className="text-gray-600 text-center py-4 col-span-3">
                No books available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
