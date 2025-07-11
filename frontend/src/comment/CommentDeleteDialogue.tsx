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
	return <></>
	
	// const token = useToken()
	// const { bookId, chapterIndex } = useCurrentParams()

	// const queryClient = useQueryClient()
	// const mutation = useMutation({
	// 	onMutate: () => {
	// 		toaster.info({ title: "Удаление комментария...", duration: import.meta.env.VITE_TOAST_DURATION })
	// 	},
	// 	mutationFn: () => {
	// 		return fetch(`${import.meta.env.VITE_BASE_URL}/comments/${commentId}`, {
	// 			method: "DELETE",
	// 			headers: { Token: token ?? "" }
	// 		}).then((res) => handleResponse(res))
	// 	},
	// 	onSuccess: (result) => {
	// 		toaster.success({ title: "Комментарий удален", duration: import.meta.env.VITE_TOAST_DURATION })
	// 		queryClient.setQueryData(["comment_list", bookId, chapterIndex], (data: CommentPublic[]) => data.filter((entry) => entry.id !== result.id))
	// 	},
	// 	onError: (error) => toaster.error({ title: error.message, duration: import.meta.env.VITE_TOAST_DURATION })
	// })

	// return (
	// 	<ActionDialogue title="Удаление комментария" description="Вы действительно хотите удалить этот Комментарий?" promise={() => mutation.mutateAsync()}>{children}</ActionDialogue>
	// )
}
