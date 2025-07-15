import { CommentEntry } from "@/comment/CommentEntry"
import { useCommentsQuery } from "@/hooks/queries"
import { useEffect } from "preact/hooks"

type CommentBlockProps = {
    chapterId: number
    page: number

    isFirst: boolean

    onBlockLoaded?: (isEmpty: boolean) => void
}

export const CommentBlock = ({ chapterId, page, isFirst = false, onBlockLoaded = undefined }: CommentBlockProps) => {
    const { data: commentsData } = useCommentsQuery(chapterId, page)

    useEffect(() => {
        if (commentsData) onBlockLoaded?.(commentsData.length === 0)
    }, [commentsData])

    return <>
        {commentsData && commentsData.map(comment => <CommentEntry commentData={comment} />)}
    </>
}