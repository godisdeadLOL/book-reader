import { ImageUpload } from "@/components/ImageUpload"
import { BookPublic } from "@/schemas"
import { Stack, Field, Input, Textarea, Button } from "@chakra-ui/react"
import { useEffect } from "preact/hooks"
import { useForm } from "react-hook-form"

export type BookFormFields = {
    id: string
    title: string
    title_original: string
    description: string
    tags: string
    image: File
}

type BookFormProps = {
    bookData?: BookPublic
    disabled?: boolean
    loading?: boolean
    required?: boolean

    onSubmit: (request: BookFormFields) => void

    children: any
}
export const BookForm = ({ onSubmit, bookData = undefined, disabled = false, loading = false, required = false, children }: BookFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch

    } = useForm<BookFormFields>()
    const file = watch("image")

    useEffect(() => {
        if (!bookData) return

        setValue("id", bookData.id)
        setValue("title", bookData.title)
        setValue("title_original", bookData.title_original)
        setValue("description", bookData.description)
        setValue("tags", bookData.tags)

    }, [bookData])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
                <Field.Root disabled={disabled} required={required} invalid={!!errors.id}>
                    <Field.Label>ID Книги</Field.Label>

                    <Input placeholder={"ID"} {...register("id", { pattern: { value: /^[a-z0-9\_\-]+$/i, message: "Недействительный ID" } })} />
                    <Field.ErrorText> {errors.id?.message} </Field.ErrorText>
                </Field.Root>

                <Field.Root disabled={disabled} required={required} invalid={!!errors.title}>
                    <Field.Label>Название (Переведенное)</Field.Label>

                    <Input placeholder={"Название"} {...register("title")} />
                    <Field.ErrorText> {errors.title?.message} </Field.ErrorText>
                </Field.Root>

                <Field.Root disabled={disabled} required={required} invalid={!!errors.title_original}>
                    <Field.Label>Название (Оригинальное)</Field.Label>

                    <Input {...register("title_original")} placeholder={"Название"} />
                    <Field.ErrorText> {errors.title_original?.message} </Field.ErrorText>
                </Field.Root>

                <Field.Root disabled={disabled} required={required} invalid={!!errors.description}>
                    <Field.Label>Описание</Field.Label>
                    <Textarea
                        {...register("description")}
                        minH={32}
                        autoresize
                        maxH={48}
                        placeholder={"Описание"}
                    />
                    <Field.ErrorText> {errors.description?.message} </Field.ErrorText>
                </Field.Root>

                <Field.Root disabled={disabled} required={required} invalid={!!errors.tags}>
                    <Field.Label>Теги</Field.Label>
                    <Input {...register("tags")} placeholder={"Теги"} />
                    <Field.HelperText>Теги должны быть разделены запятыми</Field.HelperText>
                    <Field.ErrorText> {errors.tags?.message} </Field.ErrorText>
                </Field.Root>

                <Field.Root disabled={disabled} required={required}>
                    <Field.Label>Обложка</Field.Label>

                    <ImageUpload maxSize={2} file={file} onFileAccept={(file) => setValue("image", file)} />
                </Field.Root>
            </Stack>

            <Button disabled={disabled} loading={loading} w="100%" type={"submit"} mt={8}>
                {children}
            </Button>
        </form>
    )
}
