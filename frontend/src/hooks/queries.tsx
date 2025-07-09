import { BookPreview, BookPublic, ChapterPreview, ChapterPublic, CommentPublic } from "@/schemas"
import { ChapterReference } from "@/types"
import { handleResponse, parseValue } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "preact/hooks"
import { useLocation, useParams } from "react-router"

export const useCurrentParams = () => {
	const { book_id, chapter_volume, chapter_index } = useParams()

	const modeRaw = useLocation().pathname.split("/").slice(-1)[0]
	const mode = ["book_create", "book_edit", "chapter_create", "chapter_edit"].find(mode => mode === modeRaw)

	const chapterReferenceValue = chapter_index ?
		new ChapterReference(parseValue(chapter_volume) || null, parseValue(chapter_index)!) :
		undefined
	const [chapterReference, setChapterReference] = useState<ChapterReference | undefined>(chapterReferenceValue)

	useEffect(() => {
		setChapterReference(chapterReferenceValue)
	}, [book_id, chapter_volume, chapter_index])

	return {
		bookId: book_id,
		chapterReference: chapterReference!,
		mode
	}
}

export const useBooksQuery = () => {
	return useQuery<BookPreview[]>({
		queryKey: ["book_list"],
		queryFn: () => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/books`)
				.then((res) => handleResponse(res))
				.then((json: any[]) => json.map(entry => new BookPreview(entry)))
		},
	})
}

export const useCurrentBookQuery = () => {
	const { bookId } = useCurrentParams()

	return useQuery<BookPublic>({
		queryKey: ["book_show"],
		queryFn: () => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/books/${bookId}`)
				.then((res) => handleResponse(res))
				.then(json => new BookPublic(json))
		},
	})
}

export const useCurrentChaptersQuery = () => {
	const { bookId } = useCurrentParams()

	return useQuery<ChapterPreview[]>({
		queryKey: ["book_show", "chapter_list"],
		queryFn: () =>
			fetch(`${import.meta.env.VITE_BASE_URL}/chapters/query?book_id=${bookId}`)
				.then((res) => handleResponse(res))
				.then((json: any[]) => json.map(entry => new ChapterPreview(entry)))
	})
}

export const useChapterQuery = (chapterReference: ChapterReference, enabled: boolean = true) => {
	const { bookId } = useCurrentParams()
	const query = `book_id=${bookId}&index=${chapterReference.index}` + (chapterReference.volume ? `&volume=${chapterReference.volume}` : '')

	return useQuery<ChapterPublic>({
		queryKey: ["book_show", "chapter_show", chapterReference.volume, chapterReference.index],
		queryFn: () => fetch(`${import.meta.env.VITE_BASE_URL}/chapters/query/?${query}`)
			.then((res) => handleResponse(res))
			.then(json => new ChapterPublic(json)),
		enabled: enabled
	})
}

export const useCurrentChapterQuery = (enabled: boolean = true) => {
	const { chapterReference } = useCurrentParams()
	return useChapterQuery(chapterReference, enabled)
}

export const useCurrentCommentsQuery = () => {
	const { bookId: book_id } = useCurrentParams()

	return useQuery<CommentPublic[]>({
		queryKey: ["comment_list", book_id],
		// queryFn: () => fetch(`${import.meta.env.VITE_BASE_URL}/comments?book_id=${book_id}&chapter_index=${chapter_index}`).then((res) => handleResponse(res)),
	})
}

