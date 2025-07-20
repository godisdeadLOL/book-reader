import { ActionDialogue } from "@/components/ActionDialogue"
import { toaster } from "@/components/ui/toaster"
import { useCurrentChaptersQuery, useCurrentParams } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { handleResponse } from "@/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"

type ChapterDeleteDialogueProps = {
	chapterId?: number

	open?: boolean
	setOpen?: (open: boolean) => void

	children?: any
}

export const ChapterDeleteDialogue = ({ chapterId = undefined, open = undefined, setOpen = undefined, children = undefined }: ChapterDeleteDialogueProps) => {
	const { bookId } = useCurrentParams()
	const token = useToken()

	const { refetch } = useCurrentChaptersQuery()

	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const mutation = useMutation({
		onMutate: () => {
			toaster.info({ title: "Удаление главы...", duration: import.meta.env.VITE_TOAST_DURATION })
		},
		mutationFn: () => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/chapters/${chapterId}`, {
				method: "DELETE",
				headers: {
					Token: token ?? "",
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: () => {
			toaster.success({ title: "Глава удалена", duration: import.meta.env.VITE_TOAST_DURATION })
			navigate(`/${bookId!}`)

			queryClient.setQueryData(["book_show", "chapter_list"], (data: any) => data.filter((entry: any) => entry.id !== chapterId))
			refetch()
		}
	})

	return (
		<ActionDialogue disabled={!chapterId} open={open} setOpen={setOpen} title="Удаление главы" description="Вы действительно хотите удалить эту главу?" promise={() => mutation.mutateAsync()}>{children}</ActionDialogue>
	)
}
