import { z } from "zod";

const SignupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(10, { message: "Username must be at most 10 characters long." })
    .regex(/^[a-zA-Z0-9_]*$/, { message: "Username can only contain letters, numbers, and underscores." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { 
      message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character." })
    .trim()
});

export default SignupSchema;
