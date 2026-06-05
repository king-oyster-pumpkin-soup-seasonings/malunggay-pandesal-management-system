import Title from "@/components/title";
import { Google_Sans_Flex } from "next/font/google";

const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  weight: "600",
});

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-green-300 font-sans dark:bg-black">
      <main className="flex max-w-3xl w-full flex-col items-center justify-center py-16 bg-white dark:bg-black sm:items-start">
        <Title title="MALUNGGAY PANDESAL" />
        <h3 className="text-4xl self-center mb-4 font-extrabold tracking-widest text-green-300">
          Management System
        </h3>
        <Image
          src="/malunggay-pandesal-vehicle-pixel.png"
          alt="Malunggay Pandesal Vehicle"
          width={400}
          height={400}
          className="self-center"
        />
      </main>
    </div>
  );
}
