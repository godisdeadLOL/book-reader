import { BookTitle } from "@/book/BookTitle"
import { toaster } from "@/components/ui/toaster"
import { useCurrentBookQuery } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { handleResponse } from "@/utils"
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "preact/hooks"
import { useNavigate } from "react-router"

export const BookDeleteDialogue = ({ triggerButton }: any) => {
	const { data: bookData } = useCurrentBookQuery()
	const token = useToken()

	const [isLoading, setIsLoading] = useState(false)
	const isDisabled = isLoading || !bookData

	const navigate = useNavigate()

	const mutation = useMutation({
		onMutate: () => {
			setIsLoading(true)
			toaster.info({ title: "Удаление книги...", duration: import.meta.env.VITE_TOAST_DURATION })
		},
		mutationFn: () => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/books/${bookData!.id}`, {
				method: "DELETE",
				headers: {
					Token: token ?? "",
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: () => {
			toaster.success({ title: "Книга удалена", duration: import.meta.env.VITE_TOAST_DURATION })
			navigate("/")
		},
		onError: (error) => toaster.error({ title: error.message, duration: import.meta.env.VITE_TOAST_DURATION }),
		onSettled: () => {
			setIsLoading(false)
		},
	})

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>{triggerButton}</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>
								Удаление <BookTitle />
							</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<p>Вы точно хотите удалить эту книгу?</p>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button disabled={isDisabled} variant="outline">
									Отмена
								</Button>
							</Dialog.ActionTrigger>
							<Button disabled={isDisabled} loading={isLoading} colorPalette="red" onClick={() => mutation.mutate()}>
								Удалить
							</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<CloseButton size="sm" disabled={isDisabled} />
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}
