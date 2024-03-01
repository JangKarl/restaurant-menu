import MenuCard from "@/components/MenuCard";
import Image from "next/image";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-start justify-between w-full">
            <MenuCard />
        </main>
    );
}
