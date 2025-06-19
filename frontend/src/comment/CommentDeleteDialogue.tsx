import { toaster } from "@/components/ui/toaster"
import { useCurrentParams } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { CommentPublic } from "@/schemas"
import { handleResponse } from "@/utils"
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "preact/hooks"

type CommentDeleteDialogueProps = {
	triggerButton: any
	data?: CommentPublic
}
export const CommentDeleteDialogue = ({ triggerButton, data }: CommentDeleteDialogueProps) => {
	const token = useToken()
	const { book_id, chapter_index } = useCurrentParams()

	const [isLoading, setIsLoading] = useState(false)

	const queryClient = useQueryClient()
	const mutation = useMutation({
		onMutate: () => {
			setIsLoading(true)
			toaster.info({ title: "Удаление комментария...", duration: import.meta.env.VITE_TOAST_DURATION })
		},
		mutationFn: () => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/comments/${data!.id}`, {
				method: "DELETE",
				headers: {
					Token: token ?? "",
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: (result) => {
			toaster.success({ title: "Комментарий удален", duration: import.meta.env.VITE_TOAST_DURATION })
			queryClient.setQueryData(["comment_list", book_id, chapter_index], (data: CommentPublic[]) => data.filter((entry) => entry.id != result.id))
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
							<Dialog.Title>Удаление комментария</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<p>Вы точно хотите удалить этот комментарий?</p>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button disabled={isLoading} variant="outline">
									Отмена
								</Button>
							</Dialog.ActionTrigger>
							<Button loading={isLoading} disabled={isLoading} colorPalette="red" onClick={() => mutation.mutate()}>
								Удалить
							</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<CloseButton size="sm" disabled={isLoading} />
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}
