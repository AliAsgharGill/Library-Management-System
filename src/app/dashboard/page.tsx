"use client";
import { ChevronRight, CirclePlus, Edit3, Mail, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { bookTypes } from "@/types/bookDetails";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Dashboard = () => {
  const [bookDetails, setBookDetails] = useState({
    id: null,
    name: "",
    genre: "",
    author: "",
    image_url: "",
  });
  const [books, setBooks] = useState<bookTypes[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const route = useRouter();

  const handleChange = (e: any) => {
    setBookDetails({
      ...bookDetails,
      [e.target.id]: e.target.value,
    });
  };

  // Getting books details
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

  const handleEdit = (book: any) => {
    setBookDetails(book);
    setIsEdit(true);
    setDialogOpen(true);
  };

  const handleDelete = async (bookId: string) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      await axios.delete(`http://192.168.0.247:8000/book/${bookId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setBooks(books.filter((book) => book.id !== bookId));
      console.log("Deleted book with ID:", bookId);
    } catch (error) {
      console.log("Error in deleting book", error);
    }
  };

  // Adding or updating book
  const handleSaveBook = async () => {  
    console.log("Book Details:", bookDetails);

    // Sending book details to backend
    try {
      const accessToken = localStorage.getItem("access_token");
      let response;

      if (isEdit) {
        response = await axios.put(
          `http://192.168.0.247:8000/book/${bookDetails.id}`,
          bookDetails,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("Book updated successfully:", response.data);
        toast({
          title: "Success",
          description: "Book updated successfully",
        });
      } else {
        response = await axios.post(
          "http://192.168.0.247:8000/book/",
          bookDetails,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("Book added successfully:", response.data);
        toast({
          title: "Success",
          description: "Book added successfully",
        });
      }

      setDialogOpen(false);
      getBooks(); // Refresh book list
    } catch (error) {
      console.log("Error in saving book", error);
      toast({
        title: "Error",
        description: "Cannot save book",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Adding book details */}
      <div className="flex justify-start mx-20 my-5 ">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              onClick={() => {
                setIsEdit(false);
                setBookDetails({
                  id: null,
                  name: "",
                  genre: "",
                  author: "",
                  image_url: "",
                });
                setDialogOpen(true);
              }}
            >
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit Book" : "Add Book"}</DialogTitle>
              <DialogDescription>Enter book details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col justify-start text-start gap-4">
                <Label htmlFor="name" className="">
                  Name
                </Label>
                <Input
                  id="name"
                  value={bookDetails.name}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col justify-start text-start gap-4">
                <Label htmlFor="genre" className="">
                  Genre
                </Label>
                <Input
                  id="genre"
                  value={bookDetails.genre}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col justify-start text-start gap-4">
                <Label htmlFor="author" className="">
                  Author
                </Label>
                <Input
                  id="author"
                  value={bookDetails.author}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col justify-start text-start gap-4">
                <Label htmlFor="image_url" className="">
                  Image URL
                </Label>
                <Input
                  id="image_url"
                  value={bookDetails.image_url}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleSaveBook}>
                {isEdit ? "Update Book" : "Save Book"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* books details with actions */}
      <div className="mx-20">
        <h1 className="text-3xl font-bold mb-6">Available Books</h1>

        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.length > 0 ? (
              books.map((book: bookTypes) => (
                <div
                  key={book.uuid}
                  className="bg-slate-100 overflow-hidden shadow-md rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <div className=" flex justify-between items-center px-4 py-3">
                    <div className="px-4 py-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {book.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Author: {book.author}
                      </p>
                      <p className="text-sm text-gray-700">
                        Genre: {book.genre}
                      </p>
                      <p className="text-sm text-gray-700">
                        Stock: {book.stock}
                      </p>
                    </div>
                        <p>
                          {book.available ? (
                            <div className="text-green-500  ">Available</div>
                          ) : (
                            <div className="text-red-500">Not Available</div>
                          )}
                        </p>
                        <div className="flex justify-start  space-x-10 mt-5  ">
                          <button onClick={() => handleEdit(book)}>
                            <Edit3 className="text-blue-500 w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(book.uuid)}>
                            <Trash2 className="text-red-500 w-5 h-5" />
                          </button>
                        </div>
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
              <div className="flex justify-center mx-auto items-center w-full">
                <Image
                  src="/notFound.svg"
                  alt="No books available"
                  width={300}
                  height={200}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
