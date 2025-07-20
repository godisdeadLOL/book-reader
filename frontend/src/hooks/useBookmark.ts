import { useCurrentParams } from "@/hooks/queries"
import { BookmarkData, ChapterReference, ParagraphReference } from "@/types"
import { useLocalStorage } from "@uidotdev/usehooks"
import { useEffect, useMemo, useState } from "preact/hooks"

function parseBookmark(text: string | null): BookmarkData {
	let parsed: BookmarkData | null = null
	try {
		parsed = text ? JSON.parse(text) : null

		if (parsed?.passiveBookmark)
			parsed.passiveBookmark = new ChapterReference(parsed.passiveBookmark.volume, parsed.passiveBookmark.index)

		if (parsed?.activeBookmark?.chapter)
			parsed.activeBookmark.chapter = new ChapterReference(parsed?.activeBookmark?.chapter.volume, parsed?.activeBookmark?.chapter.index)
	} catch { }

	return parsed ?? { activeBookmark: null, passiveBookmark: null }
}

export const useBookmarkData = (bookId: string) => {
	const [bookmarkRaw, setBookmarkRaw] = useLocalStorage<string | null>(`bookmark_${bookId}`, null)
	const [bookmarkData, setBookmarkData] = useState<BookmarkData>(parseBookmark(bookmarkRaw))

	useEffect(() => {
		if (!bookmarkRaw) return
		setBookmarkData(parseBookmark(bookmarkRaw))
	}, [bookmarkRaw])

	const changePassiveBookmark = (chapter: ChapterReference | null) => {
		const data: BookmarkData = { ...bookmarkData, passiveBookmark: chapter }

		setBookmarkData(data)
		setBookmarkRaw(JSON.stringify(data))
	}

	const changeActiveBookmark = (paragraph: ParagraphReference | null) => {
		const data: BookmarkData = { ...bookmarkData, activeBookmark: paragraph }

		setBookmarkData(data)
		setBookmarkRaw(JSON.stringify(data))
	}

	return {
		activeBookmark: bookmarkData.activeBookmark,
		passiveBookmark: bookmarkData.passiveBookmark,
		setActiveBookmark: changeActiveBookmark,
		setPassiveBookmark: changePassiveBookmark,
		isBookmarked: !!bookmarkData.activeBookmark || !!bookmarkData.passiveBookmark
	}
}

export const useCurrentBookmarkData = () => {
	const { bookId } = useCurrentParams()

	return useBookmarkData(bookId!)
}