import { Image } from "@mantine/core";


export default function BrandSelect() {
    return(
        <div className="flex flex-row w-full justify-between my-8 px-20">
            <div className="border-black border-2 rounded-md w-[12.5rem] h-[4.25rem] flex flex-row items-center justify-center">
                <Image
                    src="/nike.png"
                    h={30}
                    w="auto"
                    fit="contain"
                    fallbackSrc="/placeholder.svg"
                />
            </div>

            <div className="border-black border-2 rounded-md w-[12.5rem] h-[4.25rem] flex flex-row items-center justify-center">
                <Image
                    src="/new balance.png"
                    h={30}
                    w="auto"
                    fit="contain"
                    fallbackSrc="/placeholder.svg"
                />
            </div>

            <div className="border-black border-2 rounded-md w-[12.5rem] h-[4.25rem] flex flex-row items-center justify-center">
                <Image
                    src="/adidas.png"
                    h={30}
                    w="auto"
                    fit="contain"
                    fallbackSrc="/placeholder.svg"
                />
            </div>

            <div className="border-black border-2 rounded-md w-[12.5rem] h-[4.25rem] flex flex-row items-center justify-center">
                <Image
                    src="/puma.png"
                    h={40}
                    w="auto"
                    fit="contain"
                    fallbackSrc="/placeholder.svg"
                />
            </div>

            <div className="border-black border-2 rounded-md w-[12.5rem] h-[4.25rem] flex flex-row items-center justify-center">
                <Image
                    src="/on.png"
                    h={30}
                    w="auto"
                    fit="contain"
                    fallbackSrc="/placeholder.svg"
                />
            </div>
        </div>
    );
}