// firebaseFunctions.js
import { ref, get, push, set, update, remove } from "firebase/database";
import { getStorage, ref as storRef, uploadBytes } from "firebase/storage";
import type { FormData } from "@/lib/types";
import { db } from "../../firebase";

export const getAllMenuItems = async () => {
  try {
    const menuRef = ref(db, "menu");
    const snapshot = await get(menuRef);

    if (snapshot.exists() && snapshot.hasChildren()) {
      const menuData: FormData[] = [];

      snapshot.forEach((categorySnapshot) => {
        const category = categorySnapshot.key;

        categorySnapshot.forEach((itemSnapshot) => {
          const itemId = itemSnapshot.key;
          const menuItem = itemSnapshot.val();

          const itemData = {
            id: itemId,
            category: category,
            name: menuItem.name,
            price: menuItem.price,
            cost: menuItem.cost,
            stock: menuItem.stock,
            option: menuItem.option,
            additional: menuItem.additional,
            small: menuItem.small,
            medium: menuItem.medium,
            large: menuItem.large,
          };

          menuData.push(itemData);
        });
      });

      return menuData;
    } else {
      return [];
    }
  } catch (error) {
    throw new Error(`Error in getting menu items: ${error}`);
  }
};

export const addMenuItem = async (data: FormData) => {
  try {
    const menuRef = ref(db, `menu/${data.category}`);
    const newMenuRef = push(menuRef);

    await set(newMenuRef, {
      name: data.name,
      category: data.category,
      cost: data.cost,
      price: data.price,
      stock: data.stock,
      option: data.option,
      additional: data.additional,
      small: data.small,
      medium: data.medium,
      large: data.large,
    });
  } catch (error) {
    throw new Error(`Error in adding menu`);
  }
};

export const editMenuItem = async (data: FormData, dataId: string | "") => {
  try {
    const menuItemRef = ref(db, `menu/${data.category}/${dataId}`);

    await update(menuItemRef, data);
  } catch (error) {
    throw new Error(`Error in editing ${data.name} menu`);
  }
};

export const removeSelectedMenuItems = async (selectedIds: string[]) => {
  try {
    const promises = selectedIds.map((itemId) => {
      const menuRef = ref(db, `menu/${itemId}`);
      return remove(menuRef);
    });
    await Promise.all(promises);
    console.log("Selected menu items removed successfully");
    return true; // or you can return any other value to indicate success
  } catch (error) {
    console.error("Error removing selected menu items:", error);
    throw error; // handle error in the component where you call this function
  }
};

export const uploadImageToStorage = async (file: File) => {
  try {
    const storage = getStorage();
    const storageRef = storRef(storage);

    const userImageRef = storRef(storage, `${file}`);
    const imagesRef = storRef(storage, `images/${file}`);

    userImageRef.name === imagesRef.name;
    userImageRef.fullPath === imagesRef.fullPath;

    uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Image uplaoded", snapshot);
    });
  } catch (error) {
    throw error;
  }
};
