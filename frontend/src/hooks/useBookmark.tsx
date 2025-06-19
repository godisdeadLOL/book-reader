import { useLocalStorage } from "@uidotdev/usehooks"

export const useBookmark = (book_id: number | string) => {
	const [bookmark, setBookmark] = useLocalStorage<number | null>(`bookmark_${book_id}`, null)
	const clearBookmark = () => setBookmark(null)

	return { bookmark, setBookmark, clearBookmark }
}
