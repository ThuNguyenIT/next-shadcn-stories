import React, { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Minus, Plus, Check } from "lucide-react"
import Image from 'next/image';
import { useLayoutStore } from "@/lib";


interface IState {
    selectedColor: string;
    selectedFont: string;
    fontSize: number;
}
interface IColor {
    value: string;
    class: string;
}

const colors: IColor[] = [
    { value: "red-500", class: "bg-red-500" },
    { value: "yellow-200", class: "bg-yellow-200" },
    { value: "green-200", class: "bg-green-200" },
    { value: "blue-200", class: "bg-blue-200" },
    { value: "pink-200", class: "bg-pink-200" },
    { value: "black", class: "bg-black" },
]

const fonts: string[] = ["Roboto", "Palatino", "Times"]
export default function ReadingCustomization() {
    const { textColor, fontSize, fontFamily, setTextColor, setFontSize, setFontFamily } = useLayoutStore()
    const [state, setState] = useState<IState>({
        selectedColor: textColor,
        selectedFont: fontFamily,
        fontSize: fontSize
    });
    const handleSetStateField = useCallback(
        (field: keyof IState, value: string | number) => {
            setState((prevState) => ({ ...prevState, [field]: value }));
        },
        []
    );


    const handleChooseColor = useCallback((color: string) => {
        setTextColor(color)
        handleSetStateField('selectedColor', color)
    }, [])
    const handleChooseFont = useCallback((font: string) => {
        setFontFamily(font)
        handleSetStateField('selectedFont', font)
    }, [])
    const handleSetFontSize = useCallback((fontSize: number) => {
        setFontSize(fontSize)
        handleSetStateField('fontSize', fontSize)
    }, [])


    return (

        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-transparent">
                    <span className="mr-1 border border-dashed border-gray-400">
                        <Image
                            src="/svg/icon-settings.svg"
                            alt={''}
                            width={32}
                            height={32}
                        />
                    </span>
                    <span>Mẫu sắc & font chữ</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-100 bg-light-blue">
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-sm font-medium">Màu sắc:</h3>
                        <div className="flex space-x-2">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    className={`w-6 h-6 rounded-full ${color.class} flex items-center justify-center border border-custom-red`}
                                    onClick={() => handleChooseColor(color.value)}
                                >
                                    {state.selectedColor === color.value && <Check className="h-4 w-4 text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <h3 className="text-sm font-medium">Font chữ:</h3>
                        <div className="flex space-x-2">
                            {fonts.map((font) => (
                                <button
                                    key={font}
                                    className={`px-3 py-1 border rounded bg-transparent ${state.selectedFont === font ? 'text-custom-red border-custom-red' : ''
                                        }`}
                                    onClick={() => handleChooseFont(font)}
                                >
                                    {font}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <h3 className="text-sm font-medium">Cỡ chữ:</h3>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-6 w-6 border-black"
                                onClick={() => handleSetFontSize(Math.max(state.fontSize - 1, 12))}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{state.fontSize}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-6 w-6 border-black"
                                onClick={() => handleSetFontSize(Math.min(state.fontSize + 1, 32))}
                            >
                                <Plus className="h-4 w-4 text-black" />
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}