"use client";
import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import loginSchema from "@/app/schemas/loginin-schema";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { LoginFormValues } from "@/types/SigninTypes";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Cookies from "js-cookie";

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const route = useRouter();
  const form = useForm<LoginFormValues>({
    // validation mode
    mode: "onTouched",
    // static default values
    defaultValues: {
      email: "",
      password: "",
    },
    // validation schema for form fields using zod library
    resolver: zodResolver(loginSchema),
  });

  const { register, control, handleSubmit, formState } = form;
  //  here we will get errors from formState and get some info from formState, like errors, touchedFields and dirtyFields, we can use this info to show errors on screen
  const { errors, isDirty, isValid } = formState;

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    console.log("Form submitted:", data);
    try {
      const response = await axios.post(
        // "https://4cc4-110-39-21-146.ngrok-free.app/register/login",
        "http://192.168.0.247:8000/user/login",
        data
      );
      // Here we can handle the successful login response (e.g., save the token, redirect to another page)
      console.log("Login successful Data:", response.data);

      // Storing token in cookies
      Cookies.set("access_token", response.data.access_token, { expires: 7 });

      toast({
        title: "Success",
        description: "Login successfully",
      });

      route.push("/");

      // Redirect based on role
      // if (response.data.role === "admin") {
      //   route.push("/dashboard");
      // } else {
      //   route.push("/");
      // }

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      route.push("/dashboard");
      setIsSubmitting(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
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
            LogIn To LMS
          </div>
          {/* email */}
          <div className="flex justify-start  text-start flex-col">
            <label htmlFor="email">Email</label>
            <input
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
            <p className=" text-sm text-red-500">{errors.email?.message}</p>
          </div>

          {/* channel name */}
          <div className="flex justify-start  text-start flex-col">
            <label htmlFor="">Password</label>
            <input
              type="password"
              id="channel"
              placeholder="***********"
              className="border border-black rounded p-2"
              {...register("password", { required: "Password Required" })}
            />
            <p className=" text-sm text-red-500">{errors.password?.message}</p>
          </div>

          {/* Here we make it disabled on the basis of isDirty and isValid values, and we get these values form formState */}
          {/* Submission Button  */}
          <button
            type="submit"
            // remove !isValid condition and make it disabled for now only
            disabled={!isDirty || !isDirty}
            className={`border ${
              isValid ? "bg-black" : "bg-gray-300"
            } font-bold text-white w-full my-4 p-2 rounded`}
          >
            {!isValid ? (
              "Please Fill Form"
            ) : isSubmitting ? (
              <div className="flex justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loging In...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <DevTool control={control} />
      </div>
    </>
  );
};

export default LoginForm;
