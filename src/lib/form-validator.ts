import { z } from "zod";

export const FormValidator = z.object({
  name: z.string().min(1, { message: "Please enter a name" }),
  category: z.string().min(1, { message: "Please select a category" }),
  option: z.boolean().default(false).optional(),
  price: z.string().min(1, { message: "Please enter a price" }),
  cost: z.string().min(1, { message: "Please enter a cost" }),
  stock: z.string().min(1, { message: "Please enter a stock" }),
  additional: z.boolean().default(false).optional(),
  small: z.string().optional(),
  medium: z.string().optional(),
  large: z.string().optional(),
});

export type TFormValidator = z.infer<typeof FormValidator>;
