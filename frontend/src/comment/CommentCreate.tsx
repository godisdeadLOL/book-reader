import { toaster } from "@/components/ui/toaster"
import { useCurrentParams } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { handleResponse } from "@/utils"
import { Stack, Input, Textarea, Button, Field } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "preact/hooks"
import ReCAPTCHA from "react-google-recaptcha"
import { useForm } from "react-hook-form"

type CommentCreateRequest = {
	user: string
	content: string
}

export const CommentCreate = () => {
	const { bookId: book_id, chapterIndex: chapter_index } = useCurrentParams()
	const token = useToken()

	const [isLoading, setIsLoading] = useState(false)

	const [captchaValue, setCaptchaValue] = useState<string | null>(null)

	const queryClient = useQueryClient()
	const mutation = useMutation({
		onMutate: () => {
			setIsLoading(true)
		},
		mutationFn: (request: any) => {
			toaster.info({ title: "Добавление комментария...", duration: import.meta.env.VITE_TOAST_DURATION })
			return fetch(`${import.meta.env.VITE_BASE_URL}/comments?book_id=${book_id}&chapter_index=${chapter_index}`, {
				method: "POST",
				body: JSON.stringify(request),
				headers: {
					"Content-Type": "application/json",
					Captcha: captchaValue ?? "",
					Token: token ?? "",
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: (result: any) => {
			toaster.success({ title: "Комментарий добавлен", duration: import.meta.env.VITE_TOAST_DURATION })
			queryClient.setQueryData(["comment_list", book_id, chapter_index], (data: any) => [...data, result])
		},
		onError: (error) => {
			toaster.error({ title: error.message, duration: import.meta.env.VITE_TOAST_DURATION })
		},
		onSettled: () => {
			setIsLoading(false)
			setCaptchaValue(null)
		},
	})

	const onSubmit = (request: CommentCreateRequest) => {
		mutation.mutate(request)
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CommentCreateRequest>()

	return (
		<Stack gap={4} asChild>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Field.Root disabled={isLoading} required invalid={!!errors.user}>
					<Input {...register("user")} placeholder={"Имя"} />
					<Field.ErrorText> {errors.user} </Field.ErrorText>
				</Field.Root>

				<Field.Root disabled={isLoading} required invalid={!!errors.content}>
					<Textarea {...register("content")} placeholder={"Напишите свой комментарий"} minH={32} autoresize />
					<Field.ErrorText> {errors.content} </Field.ErrorText>
				</Field.Root>

				{!captchaValue && !token && !isLoading ? (
					<ReCAPTCHA onChange={(value) => setCaptchaValue(value)} sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY} />
				) : (
					<Button loading={isLoading} type="submit" alignSelf={"start"} colorPalette={"teal"}>
						Отправить
					</Button>
				)}
			</form>
		</Stack>
	)
}
