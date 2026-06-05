import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function Footer() {
  return (
    <footer
      className={`${robotoMono.className} bg-white text-gray-400 py-3 mt-auto text-sm
      `}>
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Malunggay Pandesal Management
          System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
