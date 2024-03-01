"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { FileSliders, Pencil, RotateCw, X } from "lucide-react";
import type { FormData } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { additionalSizes, categories } from "@/lib/data";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormValidator, TFormValidator } from "@/lib/form-validator";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "./ui/use-toast";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";
import { editMenuItem } from "@/function/firebaseFunctions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Card } from "./ui/card";

type EditMenuFormProps = {
  menuItem: FormData;
};

const EditMenuForm = ({ menuItem }: EditMenuFormProps) => {
  const { toast } = useToast();

  const [editedMenuItem, setEditedMenuItem] = useState(menuItem);

  const form = useForm<TFormValidator>({
    resolver: zodResolver(FormValidator),
    defaultValues: {
      name: editedMenuItem.name,
      category: editedMenuItem.category,
      cost: editedMenuItem.cost,
      price: editedMenuItem.price,
      stock: editedMenuItem.stock,
      option: editedMenuItem.option,
      additional: editedMenuItem.additional,
      small: editedMenuItem.small,
      medium: editedMenuItem.medium,
      large: editedMenuItem.large,
    },
  });

  const onSubmitEdit: SubmitHandler<FormData> = async (data) => {
    try {
      await editMenuItem(data, editedMenuItem.id ?? "");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Menu edited successfully",
        description: <p>Menu edited! See it in Home</p>,
      });
      setTimeout(() => {
        // Navigate back to the same page
        window.location.reload();
      }, 2000);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Error in editing menu",
        description: `${error}`,
      });
    }
  };
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button className="z-55 group absolute -left-4 -top-4 rounded-full px-3 opacity-0 transition-all delay-300 group-hover:opacity-100">
                <Pencil
                  className=" text-white transition-all group-hover:cursor-pointer"
                  width={14}
                  height={14}
                  strokeWidth={3}
                />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit {editedMenuItem.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>
            Fill in the details for "{editedMenuItem.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="h-full">
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmitEdit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Fried Chicken" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please provide the name of the menu item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={true}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            value={category.label}
                            key={category.label}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the appropriate category for the menu item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-row space-x-4 ">
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <Input placeholder="&#8369; 0.00" {...field} />
                      </FormControl>
                      <FormDescription>
                        Cost of producing one unit of the menu item.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="&#8369; 0.00" {...field} />
                      </FormControl>
                      <FormDescription>
                        Selling price of one unit of the menu item.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="additional"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-4">
                    <FormLabel>Enable for additionals</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.getValues("additional") ? (
                <div className=" flex w-full justify-between gap-2">
                  {additionalSizes.map((data) => (
                    <Card
                      className="flex flex-col items-center justify-between p-4"
                      key={data.value}
                    >
                      <FormField
                        control={form.control}
                        name={data.value}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{data.label}</FormLabel>
                            <FormControl>
                              <Input placeholder="&#8369; 0.00" {...field} />
                            </FormControl>
                            <FormDescription>
                              Additional price for {data.label}.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Card>
                  ))}
                </div>
              ) : (
                ""
              )}
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Specify the current quantity of the menu item available in
                      stock.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="option"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-4">
                    <FormLabel>Enable for ordering</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full text-lg font-bold"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <span>Submitting Edited Values</span>
                    <RotateCw className="ml-4 animate-spin" />
                  </>
                ) : (
                  <span>Submit Edit</span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenuForm;
