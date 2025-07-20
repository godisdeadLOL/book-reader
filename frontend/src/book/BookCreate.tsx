import { BookForm, BookFormFields } from "@/book/BookForm"
import { ImageUpload } from "@/components/ImageUpload"
import { toaster } from "@/components/ui/toaster"
import { useToken } from "@/hooks/useToken"
import { handleResponse } from "@/utils"
import { Button, Field, Input, Stack, Textarea } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "preact/hooks"
import { useForm } from "react-hook-form"
import { LuBook, LuPlus } from "react-icons/lu"
import { useNavigate } from "react-router"

export const BookCreate = () => {
	const token = useToken()


	const navigate = useNavigate()
	const mutation = useMutation({
		mutationFn: (request: BookFormFields) => {
			const formData = new FormData()
			formData.append("create_request", JSON.stringify({ ...request, id: undefined, image: undefined }))
			formData.append("image", request.image)

			toaster.info({ title: "Создание книги...", duration: import.meta.env.VITE_TOAST_DURATION })
			return fetch(`${import.meta.env.VITE_BASE_URL}/books/${request.id}`, {
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
		}
	})

	return <BookForm onSubmit={request => mutation.mutate(request)} loading={mutation.isPending} required>
		<LuBook /> Создать
	</BookForm>
}
