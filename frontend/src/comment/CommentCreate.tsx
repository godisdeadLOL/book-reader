import { toaster } from "@/components/ui/toaster"
import { useCurrentChapterQuery, useCurrentParams } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { CommentPublic } from "@/schemas"
import { handleResponse } from "@/utils"
import { Stack, Field, Input, Textarea, Button, Wrap } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef, useState } from "preact/hooks"
import ReCAPTCHA from "react-google-recaptcha"
import { useForm } from "react-hook-form"

type CommentCreateRequest = {
	user: string
	content: string
}

export const CommentCreate = () => {
	const { data: chapterData } = useCurrentChapterQuery(false)
	if (!chapterData) return <></>

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<CommentCreateRequest>()

	const token = useToken()
	const [captchaValue, setCaptchaValue] = useState<string | null>(null)
	const captchaRef = useRef<ReCAPTCHA>()

	const queryClient = useQueryClient()
	const mutation = useMutation({
		onMutate: () => {
			toaster.info({ title: "Добавление комментария...", duration: import.meta.env.VITE_TOAST_DURATION })
		},
		mutationFn: (request: any) => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/comments?chapter_id=${chapterData?.id}`, {
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

			let previous = new CommentPublic(result)
			queryClient.setQueriesData<CommentPublic[]>(
				{ queryKey: ["book_show", "chapter_show", "comments"], exact: false },
				(data) => {
					if (!data) return undefined

					const last = data[data.length - 1]

					const updated = [previous, ...data.slice(0, -1)]
					previous = last

					return updated
				}
			)

			// очистить форму
			reset()
			if (captchaRef.current) captchaRef.current.reset()
		}
	})

	const onSubmit = (request: CommentCreateRequest) => {
		mutation.mutate(request)
	}

	return (
		<Stack gap={4} pb={8} asChild>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Field.Root disabled={mutation.isPending} required invalid={!!errors.user}>
					<Input {...register("user")} placeholder={"Имя"} />
					<Field.ErrorText> {errors.user} </Field.ErrorText>
				</Field.Root>

				<Field.Root disabled={mutation.isPending} required invalid={!!errors.content}>
					<Textarea {...register("content")} placeholder={"Напишите свой комментарий"} minH={32} autoresize />
					<Field.ErrorText> {errors.content} </Field.ErrorText>
				</Field.Root>

				{!token && <ReCAPTCHA ref={captchaRef} onChange={(value) => setCaptchaValue(value)} sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY} />}

				<Button disabled={!captchaValue && !token} loading={mutation.isPending} type="submit" variant="outline">
					Отправить
				</Button>
			</form>
		</Stack>
	)
}
