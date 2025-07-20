import { BookForm, BookFormFields } from "@/book/BookForm"
import { ImageUpload } from "@/components/ImageUpload"
import { toaster } from "@/components/ui/toaster"
import { useCurrentBookQuery, useCurrentParams } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { handleResponse } from "@/utils"
import { Box, Button, Field, FileUpload, Icon, Input, Stack, Textarea } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "preact/hooks"
import { useForm } from "react-hook-form"
import { LuImage, LuPen } from "react-icons/lu"
import { useNavigate } from "react-router"

type BookEditMutationParams = {
	bookId: string
	request: BookFormFields
}

export const BookEdit = () => {
	const { bookId } = useCurrentParams()
	const { data: bookData } = useCurrentBookQuery()

	const token = useToken()
	const navigate = useNavigate()


	const mutation = useMutation({
		mutationFn: ({ bookId, request }: BookEditMutationParams) => {
			const formData = new FormData()
			formData.append("update_request", JSON.stringify({ ...request, image: undefined }))
			if (request.image) formData.append("image", request.image)

			toaster.info({ title: "Изменение книги...", duration: import.meta.env.VITE_TOAST_DURATION })
			return fetch(`${import.meta.env.VITE_BASE_URL}/books/${bookId}`, {
				method: "PUT",
				body: formData,
				headers: {
					Token: token ?? "",
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: (result: any) => {
			toaster.success({ title: "Книга изменена", duration: import.meta.env.VITE_TOAST_DURATION })
			navigate(`/${result.id}`)
		}
	})

	return <BookForm onSubmit={request => mutation.mutate({ bookId: bookId!, request })} disabled={!bookData} loading={mutation.isPending} bookData={bookData}>
		<LuPen /> Применить
	</BookForm>
}
