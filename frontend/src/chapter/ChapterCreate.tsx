import { Button, Field, Heading, Input, Stack, Textarea } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { LuPlus } from "react-icons/lu"
import { useCurrentBookQuery } from "@/hooks/queries"
import { useMutation } from "@tanstack/react-query"
import { toaster } from "@/components/ui/toaster"
import { handleResponse } from "@/utils"
import { useToken } from "@/hooks/useToken"
import { useState } from "preact/hooks"
import { useNavigate } from "react-router"

type ChapterCreateRequest = {
	book_id: number
	title: string
	content: string
}

export const ChapterCreate = () => {
	const token = useToken()
	const { data: bookData } = useCurrentBookQuery()

	const [isLoading, setIsLoading] = useState(false)
	const isDisabled = isLoading || !bookData

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ChapterCreateRequest>()

	const navigate = useNavigate()
	const mutation = useMutation({
		onMutate: () => {
			setIsLoading(true)
		},
		mutationFn: (request: ChapterCreateRequest) => {
			toaster.info({ title: "Добавление главы...", duration: import.meta.env.VITE_TOAST_DURATION })
			return fetch(`${import.meta.env.VITE_BASE_URL}/chapters`, {
				method: "POST",
				body: JSON.stringify(request),
				headers: {
					"Content-Type": "application/json",
					Token: `${token ?? ""}`,
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: (chapter) => {
			toaster.success({ title: "Глава создана", duration: import.meta.env.VITE_TOAST_DURATION })
			navigate(`/${bookData!.id}/${chapter.index}`)
		},
		onError: (error) => toaster.error({ title: error.message, duration: import.meta.env.VITE_TOAST_DURATION }),
		onSettled: () => {
			setIsLoading(false)
		},
	})

	const onSubmit = (request: ChapterCreateRequest) => {
		request.book_id = bookData!.id
		mutation.mutate(request)
	}

	return (
		<>
			<Heading mb={8}>Создание главы</Heading>

			<Stack gap={4} asChild>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Field.Root disabled={isDisabled} required invalid={!!errors.title}>
						<Field.Label>Название</Field.Label>

						<Input
							{...register("title", { required: "Поле обязательно", minLength: { value: 3, message: "Минимум 3 символа" }, maxLength: { value: 100, message: "Максимум 100 символов" } })}
							placeholder={"Название"}
						/>
						<Field.ErrorText> {errors.title?.message} </Field.ErrorText>
					</Field.Root>

					<Field.Root disabled={isDisabled} required invalid={!!errors.content}>
						<Field.Label>Содержимое</Field.Label>
						<Textarea
							{...register("content", { required: "Поле обязательно", minLength: { value: 3, message: "Минимум 3 символа" }, maxLength: { value: 1000, message: "Максимум 1000 символов" } })}
							minH={32}
							autoresize
							maxH={48}
							placeholder={"Содержимое"}
						/>
						<Field.ErrorText> {errors.content?.message} </Field.ErrorText>
					</Field.Root>

					<Button disabled={isDisabled} loading={isLoading} w="100%" type={"submit"} mt={8}>
						<LuPlus /> Добавить
					</Button>
				</form>
			</Stack>
		</>
	)
}
