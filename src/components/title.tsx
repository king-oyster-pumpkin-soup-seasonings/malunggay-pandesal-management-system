import { Bowlby_One } from "next/font/google";

const bowlbyOne = Bowlby_One({
  subsets: ["latin"],
  weight: "400",
});

export default function Title({
  title,
}: Readonly<{
  title: string;
}>) {
  return (
    <h1
      className={`text-5xl text-center self-center mb-4 ${bowlbyOne.className} text-green-400`}>
      {title}
    </h1>
  );
}
