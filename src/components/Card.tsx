import Image from "next/image";

export interface CardProps {
  id: string;
  title: string;
}

export function Card({ id, title }: CardProps) {
  return (
    <div>
      <Image src={"/card.png"} alt={title} width={60} height={90} className="w-full h-full object-cover opacity-80" />
    </div>
  );
}
