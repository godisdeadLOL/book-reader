import { toaster } from "@/components/ui/toaster"
import { useCurrentChaptersQuery, useCurrentParams } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { handleResponse } from "@/utils"
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "preact/hooks"
import { useNavigate } from "react-router"

type ChapterDeleteDialogueProps = {
	triggerButton: any
	id: number
}
export const ChapterDeleteDialogue = ({ triggerButton, id }: ChapterDeleteDialogueProps) => {
	const token = useToken()
	const navigate = useNavigate()

	const { refetch } = useCurrentChaptersQuery()

	const { book_id } = useCurrentParams()

	const [isLoading, setIsLoading] = useState(false)
	const isDisabled = isLoading

	const queryClient = useQueryClient()
	const mutation = useMutation({
		onMutate: () => {
			setIsLoading(true)
			toaster.info({ title: "Удаление главы...", duration: import.meta.env.VITE_TOAST_DURATION })
		},
		mutationFn: () => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/chapters/${id}`, {
				method: "DELETE",
				headers: {
					Token: token ?? "",
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: (result) => {
			toaster.success({ title: "Глава удалена", duration: import.meta.env.VITE_TOAST_DURATION })
			navigate(`/${book_id!}`)

			queryClient.setQueryData(["chapter_list", book_id!], (data: any) => data.filter((entry: any) => entry.id != result.id))
			refetch()
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
								Удаление главы
							</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<p>Вы точно хотите удалить эту главу?</p>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button disabled={isDisabled} variant="outline">
									Отмена
								</Button>
							</Dialog.ActionTrigger>
							<Button loading={isLoading} disabled={isDisabled} colorPalette="red" onClick={() => mutation.mutate()}>
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
