import Image from "next/image";

export default function Signature() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative w-full max-w-sm">
        <Image
          src="/Signatur.svg"
          alt="Emil Schröder Unterschrift"
          width={400}
          height={150}
          className="h-auto w-full"
          priority
          draggable={false}
        />
      </div>
    </div>
  );
}

