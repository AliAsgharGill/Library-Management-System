"use client";
import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SignupSchema from "@/app/schemas/singup-schema";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SignupApiResponse, SignupFormValues } from "@/types/SingupTypes";

const SignupForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const route = useRouter();

  const form = useForm<SignupFormValues>({
    // validation mode
    mode: "onChange",
    // static default values
    defaultValues: {
      username: "",
      email: "",
      image_url: "",
      password: "",
      // is_active: true,
      // role: "student",
    },
    // validation schema for form fields using zod library
    resolver: zodResolver(SignupSchema),
  });

  const { register, control, handleSubmit, formState } = form;
  //  here we will get errors from formState and get some info from formState, like errors, touchedFields and dirtyFields, we can use this info to show errors on screen
  const { errors, isDirty, isValid } = formState;

  const onSubmit = async (data: SignupFormValues) => {
    console.log("Form submitted:", data);
    setIsSubmitting(true);

    try {
      const response = await axios.post<SignupApiResponse>(
        // "https://4cc4-110-39-21-146.ngrok-free.app/register/register-user",
        "http://192.168.0.247:8000/user/register",
        data
      );
      toast({
        title: "Success",
        description: "Registered successfully",
      });
      console.log("Registered successfully:", response.data);

      route.push("/sign-in");
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error in signup for user", error);
      const axiosError = error as AxiosError<SignupApiResponse>;
      let errorMessage = axiosError.response?.data.email[0];
      toast({
        title: "Error",
        description: "Failed to register user",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen ">
        <form
          noValidate
          //   to submit the form we use handleSubmit method assigned to the onSubmit event and passed in our submit function
          // reason to use handleSubmit is it can accept another argument onError
          onSubmit={handleSubmit(onSubmit)}
          className=" bg-white w-full  md:w-1/2  lg:w-1/4 shadow-md p-4 rounded "
        >
          <div className="text-xl flex justify-center font-extrabold tracking-tight lg:text-4xl mb-6  text-center">
            Register To LMS
          </div>
          {/* username */}
          <div className="flex justify-start  text-start flex-col my-2">
            <Label className="my-1" htmlFor="email">
              Username
            </Label>
            <Input
              type="text"
              id="username"
              placeholder="MrBeast"
              className="border border-black rounded p-2"
              {...register("username")}
            />
            {/* In any error case of current field error message will shown because we get errors from formState */}
            <p className=" text-sm text-red-500 my-1">
              {errors.username?.message}
            </p>
          </div>

          {/* email */}
          <div className="flex justify-start  text-start flex-col my-2">
            <Label className="my-1" htmlFor="email">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="mrbeast@feastables.com"
              className="border border-black rounded p-2"
              {...register("email", {
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
                // we can do custom validation using the validate function
                validate: {
                  required: (fieldValue) => {
                    return fieldValue.trim() !== "" || "Email Address Required";
                  },
                  notAdmin: (fieldValue) => {
                    return (
                      fieldValue !== "admin@gmail.com" ||
                      "Enter a different email address"
                    );
                  },
                  notBlackListed: (fieldValue) => {
                    return (
                      !fieldValue.endsWith("baddomain.com") ||
                      "This domain is not supported"
                    );
                  },
                },
              })}
            />
            {/* In any error case of current field error message will shown because we get errors from formState */}
            <p className=" text-sm text-red-500 my-1">
              {errors.email?.message}
            </p>
          </div>
          {/* user image url */}
          <div className="flex justify-start  text-start flex-col my-2">
            <Label className="my-1" htmlFor="image">
              Image URL
            </Label>
            <Input
              type="text"
              id="image"
              placeholder="https://example.com/image.png"
              className="border border-black rounded p-2"
              {...register("image_url", {
                // we can do custom validation using the validate function
                validate: {
                  notAllowed: (fieldValue) => {
                    return (
                      fieldValue.startsWith("http") ||
                      "Please enter a valid image url with https or http"
                    );
                  },
                },
              })}
            />
            {/* In any error case of current field error message will shown because we get errors from formState */}
            <p className=" text-sm text-red-500 my-1">
              {errors.image_url?.message}
            </p>
          </div>

          {/* Password */}
          <div className="flex justify-start  text-start flex-col my-2">
            <Label className="my-1" htmlFor="">
              Password
            </Label>
            <Input
              type="password"
              id="channel"
              placeholder="***********"
              className="border border-black rounded p-2"
              {...register("password", { required: "Password Required" })}
            />
            <p className=" text-sm text-red-500 my-1">
              {errors.password?.message}
            </p>
          </div>

          {/* Here we make it disabled on the basis of isDirty and isValid values, and we get these values form formState */}
          {/* Submission Button  */}
          <Button
            type="submit"
            // remove !isValid condition and make it disabled for now only
            disabled={!isDirty || !isValid}
            className={`border my-2 ${
              isValid ? "bg-black" : "bg-gray-300"
            } font-bold text-white w-full my-2 p-2 rounded`}
          >
            {!isValid ? (
              "Please Fill Form"
            ) : isSubmitting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Register
              </div>
            ) : (
              "Register"
            )}
          </Button>
        </form>
        <DevTool control={control} />
      </div>
    </>
  );
};

export default SignupForm;
