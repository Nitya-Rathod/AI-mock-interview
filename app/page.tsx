import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_component/Header";
import HeroAni from "./_component/HeroAni";

export default function Home() {
  return (
    <div>
      {/* <Header> */}
      <Header />
      {/* {Hero} */}
      <HeroAni />
    </div>
  );
}
