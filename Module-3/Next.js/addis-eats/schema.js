import { z } from "zod";

const orderItemSchema = z.object({
  dishId: z.string().trim().min(1, "Choose a dish."),
  quantity: z.number().int().min(1).max(99),
});

export const orderSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^(09\d{8}|\+2519\d{8})$/, "Use 09… or +2519… followed by 8 digits."),
  address: z.string().trim().min(5, "Enter a complete delivery address.").max(300),
  items: z
    .array(orderItemSchema)
    .min(1, "Add at least one dish to your order.")
    .max(50, "An order can contain at most 50 different dishes.")
    .refine(
      (items) => new Set(items.map((item) => item.dishId)).size === items.length,
      "Each dish can only appear once in an order.",
    ),
  notes: z.string().trim().max(200, "Notes cannot exceed 200 characters.").default(""),
});
