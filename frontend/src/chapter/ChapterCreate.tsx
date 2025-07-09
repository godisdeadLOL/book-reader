import { ChapterForm, ChapterFormFields } from "@/chapter/ChapterForm"
import { toaster } from "@/components/ui/toaster"
import { useCurrentParams } from "@/hooks/queries"
import { useClearQueries } from "@/hooks/useClearQueries"
import { useNavigateChapter } from "@/hooks/useNavigateChapter"
import { useToken } from "@/hooks/useToken"
import { ChapterPublic } from "@/schemas"
import { ChapterReference } from "@/types"
import { handleResponse } from "@/utils"
import { useMutation } from "@tanstack/react-query"
import { LuPlus } from "react-icons/lu"

export const ChapterCreate = () => {
	const { bookId } = useCurrentParams()

	const token = useToken()
	const { navigate } = useNavigateChapter()

	const { clearChapterList } = useClearQueries()

	const mutation = useMutation({
		onMutate: () => {
			toaster.info({ title: "Добавление главы...", duration: import.meta.env.VITE_TOAST_DURATION })
		},
		mutationFn: ({ bookId, request }: { bookId: string, request: ChapterFormFields }) => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/chapters?book_id=${bookId}`, {
				method: "POST",
				body: JSON.stringify(request),
				headers: {
					"Content-Type": "application/json",
					Token: `${token ?? ""}`,
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: (chapter: ChapterPublic) => {
			toaster.success({ title: "Глава создана", duration: import.meta.env.VITE_TOAST_DURATION })
			clearChapterList()
			navigate(new ChapterReference(chapter.volume, chapter.index))
		},
		onError: (error) => toaster.error({ title: error.message, duration: import.meta.env.VITE_TOAST_DURATION }),
	})

	return (
		<ChapterForm onSubmit={(request) => mutation.mutate({ bookId: bookId!, request })} required={true} disabled={mutation.isPending} loading={mutation.isPending}>
			<LuPlus /> Добавить
		</ChapterForm>
	)
}
