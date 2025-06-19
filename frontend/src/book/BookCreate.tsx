import { toaster } from "@/components/ui/toaster"
import { useToken } from "@/hooks/useToken"
import { handleResponse } from "@/utils"
import { Box, Button, Field, FileUpload, Icon, Input, Stack, Textarea } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "preact/hooks"
import { useForm } from "react-hook-form"
import { LuImage, LuPlus } from "react-icons/lu"
import { useNavigate } from "react-router"

type BookCreateRequest = {
	title: string
	title_original: string
	description: string
	tags: string
}

export const BookCreate = () => {
	const token = useToken()
	const [file, setFile] = useState<any | null>(null)

	const [loading, setLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<BookCreateRequest>()

	const navigate = useNavigate()

	const mutation = useMutation({
		onMutate: () => {
			setLoading(true)
		},
		mutationFn: (request: BookCreateRequest) => {
			const formData = new FormData()
			formData.append("payload", JSON.stringify(request))
			formData.append("image", file)

			toaster.info({ title: "Создание книги...", duration: import.meta.env.VITE_TOAST_DURATION })
			return fetch(`${import.meta.env.VITE_BASE_URL}/books`, {
				method: "POST",
				body: formData,
				headers: {
					Token: token ?? "",
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: (result: any) => {
			toaster.success({ title: "Книга создана", duration: import.meta.env.VITE_TOAST_DURATION })
			navigate(`/${result.id}`)
		},
		onError: (error) => toaster.error({ title: error.message, duration: import.meta.env.VITE_TOAST_DURATION }),
		onSettled: () => {
			setLoading(false)
		}
	})

	const onSubmit = (request: BookCreateRequest) => {
		mutation.mutate(request)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack gap={4}>
				<Field.Root disabled={loading} required invalid={!!errors.title}>
					<Field.Label>Название (Переведенное)</Field.Label>

					<Input
						{...register("title", { required: "Поле обязательно", minLength: { value: 3, message: "Минимум 3 символа" }, maxLength: { value: 100, message: "Максимум 100 символов" } })}
						placeholder={"Название"}
					/>
					<Field.ErrorText> {errors.title?.message} </Field.ErrorText>
				</Field.Root>

				<Field.Root disabled={loading} required invalid={!!errors.title_original}>
					<Field.Label>Название (Оригинальное)</Field.Label>

					<Input
						{...register("title_original", { required: "Поле обязательно", minLength: { value: 3, message: "Минимум 3 символа" }, maxLength: { value: 100, message: "Максимум 100 символов" } })}
						placeholder={"Название"}
					/>
					<Field.ErrorText> {errors.title_original?.message} </Field.ErrorText>
				</Field.Root>

				<Field.Root disabled={loading} required invalid={!!errors.description}>
					<Field.Label>Описание</Field.Label>
					<Textarea
						{...register("description", { required: "Поле обязательно", minLength: { value: 3, message: "Минимум 3 символа" }, maxLength: { value: 1000, message: "Максимум 1000 символов" } })}
						minH={32}
						autoresize
						maxH={48}
						placeholder={"Описание"}
					/>
					<Field.ErrorText> {errors.description?.message} </Field.ErrorText>
				</Field.Root>

				<Field.Root disabled={loading} required invalid={!!errors.tags}>
					<Field.Label>Теги</Field.Label>
					<Input
						{...register("tags", { required: "Поле обязательно", minLength: { value: 3, message: "Минимум 3 символа" }, maxLength: { value: 30, message: "Максимум 30 символов" } })}
						placeholder={"Теги"}
					/>
					<Field.HelperText>Теги должны быть разделены запятыми</Field.HelperText>
					<Field.ErrorText> {errors.tags?.message} </Field.ErrorText>
				</Field.Root>

				<Field.Root disabled={loading} required>
					<Field.Label>Обложка</Field.Label>

					<FileUpload.Root alignItems="stretch" maxFileSize={1024 * 1024} accept={["image/*"]} onFileAccept={(details) => setFile(details.files[0])}>
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
										<Box color="fg.muted">Размер до 1 мб</Box>
									</>
								)}
							</FileUpload.DropzoneContent>
						</FileUpload.Dropzone>
					</FileUpload.Root>
				</Field.Root>
			</Stack>

			<Button loading={loading} w="100%" type={"submit"} mt={8}>
				<LuPlus /> Создать
			</Button>
		</form>
	)
}
