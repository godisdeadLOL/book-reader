import { chakra, IconButton, NativeSelect } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";


type ArrowSelectProps = {
    value: any
    values: { key: any; label: string }[]
    disabled: boolean
    onChange?: (value: any) => void
}
const ArrowSelectBase = ({ value, values, disabled = false, onChange = undefined, ...other }: ArrowSelectProps) => {

    const currentIndex = values.findIndex((entry) => entry.key === value)

    return <NativeSelect.Root disabled={disabled} w="fit" size={"sm"} gap={2} {...other} onChange={(e: any) => onChange?.(parseInt(e.target.value))}>
        <IconButton disabled={currentIndex === 0 || disabled} onClick={() => onChange?.(values[currentIndex - 1].key)} size="xs" variant="outline">
            <LuChevronLeft />
        </IconButton>

        <NativeSelect.Field value={value} textAlign="center" w={32} px={2} scrollbarWidth="thin">
            {values.map((item: { key: any; label: string }) => (
                <option key={item.key} value={item.key}>
                    {item.label}
                </option>
            ))}
        </NativeSelect.Field>

        <IconButton disabled={currentIndex === values.length - 1 || disabled} onClick={() => onChange?.(values[currentIndex + 1].key)} size="xs" variant="outline">
            <LuChevronRight />
        </IconButton>
    </NativeSelect.Root>
}

export const ArrowSelect = chakra(ArrowSelectBase)
