import { useQueryClient } from "@tanstack/react-query"

export const useClearQueries = () => {
    const queryClient = useQueryClient()

    const clearBookShow = () => {
        queryClient.removeQueries({queryKey: ["book_show"]})
    }

    const clearChapterList = () => {
        queryClient.removeQueries({queryKey: ["book_show", "chapter_list"]})
    }

    const clearChapterShow = () => {
        queryClient.removeQueries({queryKey: ["book_show", "chapter_show"]})
    }

    return {
        clearBookShow, clearChapterList, clearChapterShow
    }
}