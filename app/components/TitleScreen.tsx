import Image from "next/image";
import type { Ethan } from "@/app/page";
import Arrow from "./Arrow";

type TitleScreenProps = {
    ethan: Ethan;
};

export default function TitleScreen({ ethan }: TitleScreenProps) {
    return (
        <div className="relative min-h-screen w-full h-screen overflow-hidden" style={{ backgroundColor: ethan.color }}>
            <Arrow direction="up" color={ethan.thirdColor} onClick={() => {}} />
            <Image src={'/cloud-long-header.png'} alt={'Clouds'} width={1939} height={592} className="absolute top-[-25%] left-1/2 -translate-x-1/2 z-0"/> 
            <h1 className="relative text-8xl lg:text-[20rem] lg:m-20 z-10" style={{ color: ethan.secondaryColor }}>The <br/>{ethan.name}</h1>
            <Image src={ethan.image} alt={ethan.name} width={431} height={721} className="absolute right-50 bottom-0 h-[90vh] w-auto z-1" />
        </div>
    );
}