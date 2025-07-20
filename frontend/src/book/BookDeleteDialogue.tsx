import { ActionDialogue } from "@/components/ActionDialogue"
import { toaster } from "@/components/ui/toaster"
import { useCurrentParams } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { handleResponse } from "@/utils"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"


export const BookDeleteDialogue = ({children} : any) => {
	const token = useToken()
	const { bookId } = useCurrentParams()

	const navigate = useNavigate()
	const mutation = useMutation({
		onMutate: () => {
			toaster.info({ title: "Удаление книги...", duration: import.meta.env.VITE_TOAST_DURATION })
		},
		mutationFn: () => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/books/${bookId}`, {
				method: "DELETE",
				headers: { Token: token ?? "" }
			}).then((res) => handleResponse(res))
		},
		onSuccess: () => {
			toaster.success({ title: "Книга удалена", duration: import.meta.env.VITE_TOAST_DURATION })
			navigate("/")
		}
	})

	return (
		<ActionDialogue title="Удаление книги" description="Вы точно хотите удалить эту книгу?" promise={() => mutation.mutateAsync()}>{children}</ActionDialogue>
	)
}
