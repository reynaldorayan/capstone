import { PropsWithChildren } from "react";

import Image from "next/image";
import leaf from "@/assets/leaf.svg";

import Footer from "./partials/footer";
import Header from "./partials/header";

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <main>
      <div className="absolute inset-0 overflow-hidden">
        <div className="leaf w-10 h-10">
          <Image src={leaf.src} alt="leaf" height={30} width={30} />
        </div>
        <div className="leaf w-10 h-10">
          <Image src={leaf.src} alt="leaf" height={100} width={100} />
        </div>
        <div className="leaf w-10 h-10">
          <Image src={leaf.src} alt="leaf" height={50} width={50} />
        </div>
        <div className="leaf w-10 h-10">
          <Image src={leaf.src} alt="leaf" height={30} width={40} />
        </div>
        <div className="leaf w-10 h-10">
          <Image src={leaf.src} alt="leaf" height={90} width={90} />
        </div>
        <div className="leaf w-10 h-10">
          <Image src={leaf.src} alt="leaf" height={80} width={80} />
        </div>
        <div className="leaf w-10 h-10">
          <Image src={leaf.src} alt="leaf" height={40} width={40} />
        </div>
        <div className="leaf w-10 h-10">
          <Image src={leaf.src} alt="leaf" height={70} width={70} />
        </div>
        <div className="leaf w-10 h-10">
          <Image src={leaf.src} alt="leaf" height={60} width={60} />
        </div>
      </div>

      <Header />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </main>
  );
}
