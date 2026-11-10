import Image from "next/image";
import logoCA from "@/mocks/logoCA.png";

/** Cristo Alegria logo used wherever the product brand mark appears. */
export function BrandLogo() {
  return <Image src={logoCA} alt="Logo Cristo Alegria" className="brand-logo-image" priority />;
}
