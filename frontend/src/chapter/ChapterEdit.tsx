import { Button, Field, Heading, Input, Stack, Textarea } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { LuPen } from "react-icons/lu"
import { useCurrentBookQuery, useCurrentChapterQuery } from "@/hooks/queries"
import { useMutation } from "@tanstack/react-query"
import { toaster } from "@/components/ui/toaster"
import { handleResponse } from "@/utils"
import { useEffect, useState } from "preact/hooks"
import { useToken } from "@/hooks/useToken"
import { useNavigate } from "react-router"

type ChapterEditRequest = {
	title: string
	content: string
}

export const ChapterEdit = () => {
	const { data: chapterData, isPending } = useCurrentChapterQuery()
	const [isLoading, setLoading] = useState(false)
	const isDisabled = isLoading || isPending

	const { data: book_data } = useCurrentBookQuery()

	const token = useToken()
	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<ChapterEditRequest>()

	const mutation = useMutation({
		onMutate: () => {
			toaster.info({ title: "Изменение главы...", duration: import.meta.env.VITE_TOAST_DURATION })
			setLoading(true)
		},
		mutationFn: (request: any) => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/chapters/${chapterData!.id}`, {
				method: "PUT",
				body: JSON.stringify(request),
				headers: {
					"Content-Type": "application/json",
					Token: token ?? "",
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: () => {
			toaster.success({ title: "Глава создана", duration: import.meta.env.VITE_TOAST_DURATION })
			navigate(`/${book_data!.id}/${chapterData!.index}`)
		},
		onError: (error) => toaster.error({ title: error.message, duration: import.meta.env.VITE_TOAST_DURATION }),
		onSettled: () => {
			setLoading(false)
		},
	})

	const onSubmit = (request: ChapterEditRequest) => {
		mutation.mutate(request)
	}

	useEffect(() => {
		if (!chapterData) return

		setValue("title", chapterData.title)
		setValue("content", chapterData.content)
	}, [chapterData])

	return (
		<>
			<Heading mb={8}>Редактирование главы</Heading>

			<Stack gap={4} asChild>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Field.Root disabled={isDisabled} required invalid={!!errors.title}>
						<Field.Label>Название</Field.Label>

						<Input {...register("title", { required: "Поле обязательно", minLength: { value: 3, message: "Минимум 3 символа" } })} placeholder={"Название"} />
						<Field.ErrorText> {errors.title?.message} </Field.ErrorText>
					</Field.Root>

					<Field.Root disabled={isDisabled} required invalid={!!errors.content}>
						<Field.Label>Содержимое</Field.Label>
						<Textarea {...register("content", { required: "Поле обязательно", minLength: { value: 3, message: "Минимум 3 символа" } })} minH={32} autoresize maxH={48} placeholder={"Содержимое"} />
						<Field.ErrorText> {errors.content?.message} </Field.ErrorText>
					</Field.Root>

					<Button disabled={isDisabled} loading={isLoading} w="100%" type={"submit"} mt={8}>
						<LuPen /> Применить
					</Button>
				</form>
			</Stack>
		</>
	)
}
