"use client";

import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { FormValidator, TFormValidator } from "@/lib/form-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ref, set, push } from "firebase/database";
import { db } from "../../firebase";
import { RefreshCw } from "lucide-react";
import { useToast } from "./ui/use-toast";

const MenuLogic = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TFormValidator>({
    resolver: zodResolver(FormValidator),
  });

  const onSubmit = async (data: TFormValidator) => {
    try {
      const menuRef = ref(db, "menu/" + data.category);
      const newMenuRef = push(menuRef);

      set(newMenuRef, {
        name: data.name,
        category: data.category,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Data inserted: ", data);
      reset();
    } catch (error) {
      console.error("Firebase Eror: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="name">name</Label>
      <Input id="name" {...register("name")} placeholder="Fried Chicken" />
      {errors?.name && <p className="text-muted">{errors.name.message}</p>}
      <Label htmlFor="category">category</Label>
      <Input id="category" {...register("category")} placeholder="Chicken" />
      {errors?.name && <p className="text-muted">{errors.category?.message}</p>}
      <Button
        type="submit"
        disabled={isSubmitting}
        onClick={() => {
          toast({
            title: "Success",
            description: "Menu created successfully...",
          });
        }}
      >
        {isSubmitting ? "Submitting Data..." : "Submit"}
      </Button>
    </form>
  );
};

export default MenuLogic;
