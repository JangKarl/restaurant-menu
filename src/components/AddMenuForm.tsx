"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusCircle, RotateCw } from "lucide-react";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormValidator, TFormValidator } from "@/lib/form-validator";
import { useToast } from "./ui/use-toast";
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
import { Switch } from "./ui/switch";
import { addMenuItem } from "@/function/firebaseFunctions";
import type { FormData } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Card } from "./ui/card";

const AddMenuForm = () => {
  const { toast } = useToast();

  const form = useForm<TFormValidator>({
    resolver: zodResolver(FormValidator),
    defaultValues: {
      name: "",
      category: "",
      cost: "",
      price: "",
      stock: "",
      small: "",
      medium: "",
      large: "",
      option: false,
      additional: false,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await addMenuItem(data);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Menu created successfully",
        description: <p>Menu added! See it in Home</p>,
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
      form.reset();
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Error in creating menu",
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
              <Button className="rounded-lg">
                <PlusCircle />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add a menu</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Menu</DialogTitle>
          <DialogDescription>
            Fill in the details for the new menu item.
          </DialogDescription>
        </DialogHeader>
        <div className="h-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      //@ts-ignore
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
                    <span>Submitting</span>
                    <RotateCw className="ml-4 animate-spin" />
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMenuForm;
