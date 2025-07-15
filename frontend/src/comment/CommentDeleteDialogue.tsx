import { ActionDialogue } from "@/components/ActionDialogue"
import { toaster } from "@/components/ui/toaster"
import { useCurrentParams } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { CommentPublic } from "@/schemas"
import { handleResponse } from "@/utils"
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "preact/hooks"

type CommentDeleteDialogueProps = {
	commentId: number
	children: any
}
export const CommentDeleteDialogue = ({ commentId, children }: CommentDeleteDialogueProps) => {
	const token = useToken()
	// const { bookId, chapterIndex } = useCurrentParams()

	const queryClient = useQueryClient()
	const mutation = useMutation({
		onMutate: () => {
			toaster.info({ title: "Удаление комментария...", duration: import.meta.env.VITE_TOAST_DURATION })
		},
		mutationFn: () => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/comments/${commentId}`, {
				method: "DELETE",
				headers: { Token: token ?? "" }
			}).then((res) => handleResponse(res))
		},
		onSuccess: () => {
			toaster.success({ title: "Комментарий удален", duration: import.meta.env.VITE_TOAST_DURATION })

			queryClient.setQueriesData<CommentPublic[]>(
				{ queryKey: ["book_show", "chapter_show", "comments"], exact: false },
				(data) => data?.filter(comment => comment.id !== commentId)
			)
			queryClient.refetchQueries({ queryKey: ["book_show", "chapter_show", "comments"], exact: false })
		},
		onError: (error) => toaster.error({ title: error.message, duration: import.meta.env.VITE_TOAST_DURATION })
	})

	return (
		<ActionDialogue title="Удаление комментария" description="Вы действительно хотите удалить этот комментарий?" promise={() => mutation.mutateAsync()}>{children}</ActionDialogue>
	)
}
