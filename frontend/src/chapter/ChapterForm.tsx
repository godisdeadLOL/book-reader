import { ChapterPublic } from "@/schemas"
import { Stack, Field, Input, Textarea, Button, NumberInput, InputGroup, CloseButton, IconButton } from "@chakra-ui/react"
import { forwardRef } from "preact/compat"
import { useEffect, useRef, useState } from "preact/hooks"
import { useForm } from "react-hook-form"
import { LuX } from "react-icons/lu"

const NullableNumberInput = forwardRef(({ placeholder = "", onChange, onBlur, ...other }: any, ref) => {
    const [clearable, setClearable] = useState(false)

    const limitValue = (value: string | undefined) => {
        const parsed = parseInt(value ?? "")
        if (!value) return ""
        else if (parsed < 1) return "1"
        else return value
    }

    useEffect(() => {
        updateClearable(inputRef.current.value)
    }, [])

    const updateClearable = (value: string) => {
        setClearable(!!value)
    }

    const handleChange = (e: any) => {
        e.target.value = limitValue(e.target.value)
        onChange(e)

        updateClearable(e.target.value)
    }

    const handleBlur = (e: any) => {
        e.target.value = limitValue(e.target.value)
        onBlur(e)

        updateClearable(e.target.value)
    }

    const inputRef = useRef<any>()
    const onClear = () => {
        inputRef.current.value = ""
        inputRef.current.dispatchEvent(new Event("change", { bubbles: true }))

        updateClearable("")
    }

    return <NumberInput.Root width="full" ref={ref} onChange={handleChange} onBlur={handleBlur} {...other}>
        <InputGroup
            endElement={clearable && <IconButton onClick={onClear} size="xs" variant="ghost" mr={-2}><LuX /></IconButton>}
        >
            <NumberInput.Input ref={inputRef} placeholder={placeholder} />
        </InputGroup>
    </NumberInput.Root>
})

export type ChapterFormFields = {
    volume: number | null
    index: number | null
    title: string
    content: string
}

type ChapterFormProps = {
    chapterData?: ChapterPublic
    disabled?: boolean
    loading?: boolean
    required?: boolean

    onSubmit: (request: ChapterFormFields) => void

    children: any
}
export const ChapterForm = ({ onSubmit, chapterData = undefined, disabled = false, loading = false, required = false, children }: ChapterFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
    } = useForm<ChapterFormFields>({ defaultValues: { "volume": null, "index": null } })

    useEffect(() => {
        if (!chapterData) return

        setValue("content", chapterData.content)
        setValue("index", chapterData.index)
        setValue("title", chapterData.title)
        setValue("volume", chapterData.volume)

    }, [chapterData])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
                <Field.Root disabled={disabled}>
                    <Field.Label>Том</Field.Label>

                    <NullableNumberInput {...register("volume", { setValueAs: (value) => parseInt(value) || null })} placeholder="Без тома" />

                </Field.Root>

                <Field.Root disabled={disabled}>
                    <Field.Label>Номер</Field.Label>

                    <NullableNumberInput {...register("index", { setValueAs: (value) => parseInt(value) || null })} placeholder="Номер не указан" />

                </Field.Root>

                <Field.Root disabled={disabled} required={required}>
                    <Field.Label>Название</Field.Label>
                    <Input {...register("title")} placeholder={"Название"} />
                </Field.Root>

                <Field.Root disabled={disabled} required={required}>
                    <Field.Label>Содержимое</Field.Label>
                    <Textarea {...register("content")} minH={32} autoresize maxH={48} placeholder={"Содержимое"} />
                </Field.Root>

            </Stack>

            <Button disabled={disabled} loading={loading} w="100%" type={"submit"} mt={8}>
                {children}
            </Button>
        </form>
    )
}
