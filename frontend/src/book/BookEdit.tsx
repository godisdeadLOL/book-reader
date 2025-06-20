import { toaster } from "@/components/ui/toaster"
import { useCurrentBookQuery } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { handleResponse } from "@/utils"
import { Box, Button, Field, FileUpload, Icon, Input, Stack, Textarea } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "preact/hooks"
import { useForm } from "react-hook-form"
import { LuImage, LuPen } from "react-icons/lu"
import { useNavigate } from "react-router"

type BookEditRequest = {
	title: string
	title_original: string
	description: string
	tags: string
}

export const BookEdit = () => {
	const { data: bookData, refetch } = useCurrentBookQuery()
	const [isLoading, setLoading] = useState(false)
	const isDisabled = isLoading || !bookData

	const token = useToken()
	const navigate = useNavigate()

	const [file, setFile] = useState<any | null>(null)
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<BookEditRequest>()

	const mutation = useMutation({
		onMutate: () => {
			setLoading(true)
		},
		mutationFn: (request: BookEditRequest) => {
			const formData = new FormData()
			formData.append("payload", JSON.stringify(request))
			if (!!file) formData.append("image", file)

			toaster.info({ title: "Изменение книги...", duration: import.meta.env.VITE_TOAST_DURATION })
			return fetch(`${import.meta.env.VITE_BASE_URL}/books/${bookData!.id}`, {
				method: "PUT",
				body: formData,
				headers: {
					Token: token ?? "",
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: (result: any) => {
			toaster.success({ title: "Книга изменена", duration: import.meta.env.VITE_TOAST_DURATION })
			refetch()
			navigate(`/${result.id}`)
		},
		onError: (error) => toaster.error({ title: error.message, duration: import.meta.env.VITE_TOAST_DURATION }),
		onSettled: () => {
			setLoading(false)
		},
	})

	const onSubmit = (request: BookEditRequest) => {
		mutation.mutate(request)
	}

	useEffect(() => {
		if (!bookData) return

		setValue("title", bookData.title)
		setValue("title_original", bookData.title_original)
		setValue("description", bookData.description)
		setValue("tags", bookData.tags)
	}, [bookData])

	return (
		<form onSubmit={handleSubmit(onSubmit)} onError={() => alert(15)}>
			<Stack gap={4}>
				<Field.Root disabled={isDisabled} invalid={!!errors.title}>
					<Field.Label>Название (Переведенное)</Field.Label>

					<Input {...register("title", { minLength: { value: 3, message: "Минимум 3 символа" }, maxLength: { value: 100, message: "Максимум 100 символов" } })} placeholder={"Название"} />
					<Field.ErrorText> {errors.title?.message} </Field.ErrorText>
				</Field.Root>

				<Field.Root disabled={isDisabled} invalid={!!errors.title_original}>
					<Field.Label>Название (Оригинальное)</Field.Label>

					<Input {...register("title_original", { minLength: { value: 3, message: "Минимум 3 символа" } })} placeholder={"Название"} />
					<Field.ErrorText> {errors.title_original?.message} </Field.ErrorText>
				</Field.Root>

				<Field.Root disabled={isDisabled} invalid={!!errors.description}>
					<Field.Label>Описание</Field.Label>
					<Textarea {...register("description", { minLength: { value: 3, message: "Минимум 3 символа" } })} minH={32} autoresize maxH={48} placeholder={"Описание"} />
					<Field.ErrorText> {errors.description?.message} </Field.ErrorText>
				</Field.Root>

				<Field.Root disabled={isDisabled} invalid={!!errors.tags}>
					<Field.Label>Теги</Field.Label>
					<Input {...register("tags", { minLength: { value: 3, message: "Минимум 3 символа" } })} placeholder={"Теги"} />
					<Field.HelperText>Теги должны быть разделены запятыми</Field.HelperText>
					<Field.ErrorText> {errors.tags?.message} </Field.ErrorText>
				</Field.Root>

				<Field.Root disabled={isDisabled}>
					<Field.Label>Обложка</Field.Label>

					<FileUpload.Root alignItems="stretch" maxFileSize={2 * 1024 * 1024} accept={["image/*"]} onFileAccept={(details) => setFile(details.files[0])}>
						<FileUpload.HiddenInput />
						<FileUpload.Dropzone>
							<Icon size="md" color="fg.muted">
								<LuImage />
							</Icon>
							<FileUpload.DropzoneContent>
								{file ? (
									<FileUpload.FileText />
								) : (
									<>
										<Box>Перетащите файл сюда</Box>
										<Box color="fg.muted">Размер до 2 мб</Box>
									</>
								)}
							</FileUpload.DropzoneContent>
						</FileUpload.Dropzone>
					</FileUpload.Root>
				</Field.Root>
			</Stack>

			<Button disabled={isDisabled} loading={isLoading} w="100%" type={"submit"} mt={8}>
				<LuPen /> Применить
			</Button>
		</form>
	)
}
