"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AddMenuForm from "./AddMenuForm";
import type { FormData } from "@/lib/types";
import EditMenuForm from "./EditMenuForm";
import DeleteMenu from "./DeleteMenu";
import { toast } from "./ui/use-toast";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Badge } from "./ui/badge";
import {
  getAllMenuItems,
  removeSelectedMenuItems,
} from "@/function/firebaseFunctions";
import { ShieldCheck, ShieldX } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { additionalSizes, tips } from "@/lib/data";

type SizeValue = "small" | "medium" | "large";

const MenuCard = () => {
  const [menuItems, setMenuItems] = useState<FormData[]>([]);
  const [hasItems, setHasItems] = useState<boolean>(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [tipIndex, setTipIndex] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllMenuItems();
        setMenuItems(data);
        setHasItems(data.length > 0);
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({
          title: "Error in getting all the menu",
          description: `${error}`,
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleCardSelection = (id: string) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id],
    );
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    console.log(value);
  };

  const sortMenuItems = (items: FormData[], sortBy: string) => {
    switch (sortBy) {
      case "category":
        return menuItems.sort((a, b) => a.category.localeCompare(b.category));
      case "stock":
        return menuItems.sort((a, b) => parseInt(b.stock) - parseInt(a.stock));
      case "option":
        return menuItems.sort((a, b) =>
          a.option === b.option ? 0 : a.option ? -1 : 1,
        );
      default:
        return items;
    }
  };

  return (
    <section className="w-full p-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-3xl">MENU ITEMS</span>
            {hasItems ? <AddMenuForm /> : ""}
          </CardTitle>
          <CardDescription>List of all menus</CardDescription>
        </CardHeader>
        <CardContent
          className={`${hasItems ? "" : "items-center"} flex w-full flex-grow flex-col justify-center gap-8`}
        >
          <div className={`${hasItems ? " flex " : "hidden"}`}>
            <Select onValueChange={handleSortChange}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Sort menus by:" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="option">Ordering Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row flex-wrap gap-6">
            {hasItems ? (
              sortMenuItems(menuItems, sortBy).map((item) => (
                <Card
                  className={`group w-[320px] border-2 transition-all delay-200 hover:cursor-pointer hover:border-primary ${
                    selectedCards.includes(item.id ?? "")
                      ? "border-2 border-primary"
                      : ""
                  }`}
                  key={item.id}
                  onClick={() => toggleCardSelection(item.id ?? "")}
                >
                  <CardHeader className="relative flex h-32 items-center justify-center">
                    <Image
                      src="/ITEM-PICTURE.png"
                      fill
                      alt="item picture"
                      className="h-full w-full rounded-t-lg object-cover transition-all group-hover:opacity-75"
                    />
                    <DeleteMenu menuItem={item} />
                    <EditMenuForm menuItem={item} />
                  </CardHeader>
                  <Separator />
                  <CardContent>
                    <div className="flex flex-col text-lg">
                      <div className="my-2 h-8">
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-primary">
                          {item.name}
                        </h2>
                      </div>
                      <div className="mt-4 flex flex-row gap-4 text-center">
                        <Card className="p-2">
                          <span className="font-bold">Price </span> &#8369;
                          {item.price}
                        </Card>
                        <Card className="p-2">
                          <span className="font-bold">Cost </span> &#8369;
                          {item.cost}
                        </Card>
                      </div>
                      {item.additional ? (
                        <div className="mt-4">
                          <p className="text-center font-bold">Additionals</p>

                          <div className="mt-4 flex items-center justify-center gap-4">
                            {additionalSizes.map((data) => (
                              <Card
                                className="p-3 text-center"
                                key={data.value}
                              >
                                <span className="font-bold">
                                  {data.label.charAt(0)}
                                </span>
                                <br />
                                &#8369;{item[data.value as SizeValue]}
                              </Card>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <p className="text-center font-bold">Additionals</p>

                          <div className="mt-4 flex items-center justify-center gap-4">
                            <Card className="border-dashed p-3 text-center">
                              No additionals added to {item.name}
                              <br />
                            </Card>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-center">
                      <span className="font-bold">Stock no.</span> {item.stock}
                    </div>
                    <div>
                      {item.option ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <ShieldCheck className="text-primary" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Enabled for ordering</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <ShieldX className="text-destructive" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Disabled for ordering</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="group flex w-[400px] flex-col items-center gap-4 rounded-lg border-2 border-dashed p-6 transition-colors hover:cursor-pointer hover:border-primary">
                <h3 className="text-center text-muted-foreground group-hover:text-primary">
                  There is no menu created yet!
                </h3>
                <AddMenuForm />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <span className="text-muted-foreground transition-all">
            {tips[tipIndex]}
          </span>
        </CardFooter>
      </Card>
    </section>
  );
};

export default MenuCard;
