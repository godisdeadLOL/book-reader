import { BookPreview, BookPublic, ChapterPreview, ChapterPublic, CommentPublic } from "@/schemas"
import { ChapterReference } from "@/types"
import { handleResponse, parseValue } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "preact/hooks"
import { useLocation, useParams } from "react-router"

export class QueryError extends Error {
	constructor(public details: { status: number }, message: string) {
		super(message)
	}
}

const retry = (failureCount: number, error: QueryError) => {
	if (error.details.status === 404) return false
	return failureCount > 2
}

export const useCurrentParams = () => {
	const { book_id, chapter_volume, chapter_index } = useParams()

	const modeRaw = useLocation().pathname.split("/").slice(-1)[0]
	const mode = ["book_create", "book_edit", "chapter_create", "chapter_edit"].find(mode => mode === modeRaw)

	const chapterReferenceValue = chapter_index ?
		new ChapterReference(parseValue(chapter_volume) || null, parseValue(chapter_index) ?? -1) :
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
	return useQuery<BookPreview[], QueryError>({
		queryKey: ["book_list"],
		queryFn: () => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/books`)
				.then((res) => handleResponse(res))
				.then((json: any[]) => json.map(entry => new BookPreview(entry)))
		},
		retry
	})
}

export const useCurrentBookQuery = () => {
	const { bookId } = useCurrentParams()

	return useQuery<BookPublic, QueryError>({
		queryKey: ["book_show"],
		queryFn: () => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/books/${bookId}`)
				.then((res) => handleResponse(res))
				.then(json => new BookPublic(json))
		},
		retry
	})
}

export const useCurrentChaptersQuery = () => {
	const { bookId } = useCurrentParams()

	return useQuery<ChapterPreview[], QueryError>({
		queryKey: ["book_show", "chapter_list"],
		queryFn: () =>
			fetch(`${import.meta.env.VITE_BASE_URL}/chapters/query?book_id=${bookId}`)
				.then((res) => handleResponse(res))
				.then((json: any[]) => json.map(entry => new ChapterPreview(entry))),
		retry
	})
}

export const useChapterQuery = (chapterReference: ChapterReference, enabled: boolean = true) => {
	const { bookId } = useCurrentParams()
	const query = `book_id=${bookId}&index=${chapterReference.index}` + (chapterReference.volume ? `&volume=${chapterReference.volume}` : '')

	return useQuery<ChapterPublic, QueryError>({
		queryKey: ["book_show", "chapter_show", chapterReference.volume, chapterReference.index],
		queryFn: () => fetch(`${import.meta.env.VITE_BASE_URL}/chapters/query/?${query}`)
			.then((res) => handleResponse(res))
			.then(json => new ChapterPublic(json)),
		enabled: enabled,
		retry
	})
}

export const useCurrentChapterQuery = (enabled: boolean = true) => {
	const { chapterReference } = useCurrentParams()
	return useChapterQuery(chapterReference, enabled)
}

export const useCommentsQuery = (chapterId: number, page: number) => {
	return useQuery<CommentPublic[], QueryError>({
		queryKey: ["book_show", "chapter_show", "comments", page],
		queryFn: () => fetch(`${import.meta.env.VITE_BASE_URL}/comments?chapter_id=${chapterId}&page=${page}`)
			.then((res) => handleResponse(res))
			.then((json: any[]) => json.map(entry => new CommentPublic(entry))),
		retry
	})
}

