import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container-page flex flex-col items-center py-24 text-center">
        <Image src="/pelican/logo.png" alt="" width={160} height={160} className="h-40 w-40" />
        <h1 className="h-section mt-8">This page washed away.</h1>
        <p className="lede mx-auto mt-4">
          The link may be old or mistyped. Everything we offer is on the home page.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Back to the home page
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
