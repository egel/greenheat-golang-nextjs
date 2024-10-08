import { FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="my-7 flex flex-wrap items-center justify-center">
      <div className="flex flex-row gap-2 items-center text-gray-400">
        <span>Made with</span>
        <FaHeart className="transition ease-in-out hover:animate-pulse hover:text-red-400 cursor-pointer" />
        <span>by Maciej Sypien for demonstation purposes</span>
      </div>
    </footer>
  );
}
