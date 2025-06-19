import { BookPreview, BookPublic, ChapterPreview, ChapterPublic, CommentPublic } from "@/schemas"
import { handleResponse } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

export const useCurrentParams = () => {
	const parseValue = (value: string | undefined) => {
		const parsed = parseInt(value ?? "")
		if (isNaN(parsed)) return undefined
		return parsed
	}

	const { book_id, chapter_index } = useParams()
	return { book_id: parseValue(book_id), chapter_index: parseValue(chapter_index ?? "") }
}

export const useBooksQuery = () => {
	return useQuery<BookPreview[]>({
		queryKey: ["book_list"],
		queryFn: () => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/books`).then((res) => handleResponse(res))
		},
	})
}

export const useCurrentBookQuery = () => {
	const { book_id } = useCurrentParams()

	return useQuery<BookPublic>({
		queryKey: ["book_show", book_id],
		queryFn: () => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/books/${book_id}`).then((res) => handleResponse(res))
		},
	})
}

export const useCurrentChaptersQuery = () => {
	const { book_id } = useCurrentParams()

	return useQuery<ChapterPreview[]>({
		queryKey: ["chapter_list", book_id],
		queryFn: () => fetch(`${import.meta.env.VITE_BASE_URL}/chapters?book_id=${book_id}`).then((res) => handleResponse(res)),
	})
}

export const useCurrentChapterQuery = () => {
	const { book_id, chapter_index } = useCurrentParams()

	return useQuery<ChapterPublic>({
		queryKey: ["chapter_show", book_id, chapter_index],
		queryFn: () => fetch(`${import.meta.env.VITE_BASE_URL}/chapters/?book_id=${book_id}&chapter_index=${chapter_index}`).then((res) => handleResponse(res)),
	})
}

export const useCurrentCommentsQuery = () => {
	const { book_id, chapter_index } = useCurrentParams()

	return useQuery<CommentPublic[]>({
		queryKey: ["comment_list", book_id, chapter_index],
		queryFn: () => fetch(`${import.meta.env.VITE_BASE_URL}/comments?book_id=${book_id}&chapter_index=${chapter_index}`).then((res) => handleResponse(res)),
	})
}
