import { BookDeleteDialogue } from "@/book/BookDeleteDialogue"
import { ContinueButton } from "@/book/BookShow/ContinueButton"
import { AdaptiveButton } from "@/components/AdaptiveButton"
import { useCurrentChaptersQuery, useCurrentParams } from "@/hooks/queries"
import { useCurrentBookmarkData } from "@/hooks/useBookmark"
import { useNavigateChapter } from "@/hooks/useNavigateChapter"
import { useToken } from "@/hooks/useToken"
import { BookPublic } from "@/schemas"
import { Center, Button, Skeleton } from "@chakra-ui/react"
import { LuBookOpen, LuPen, LuTrash } from "react-icons/lu"
import { Link, useNavigate } from "react-router"

const Wrapper = ({ children }: any) => <Center my={4} gap={4}>{children}</Center>

const ControlsSkeleton = () => {
    return <Wrapper> <Skeleton h={6} w={32} /> </Wrapper>
}

export const Controls = ({ bookData }: { bookData?: BookPublic }) => {
    if (!bookData) return <ControlsSkeleton />

    const token = useToken()

    const { isBookmarked } = useCurrentBookmarkData()
    const navigate = useNavigate()
    const { generatePath } = useNavigateChapter()

    const { data: chaptersData } = useCurrentChaptersQuery()
    const firstChapter = chaptersData ? (chaptersData.length > 0 ? chaptersData[0] : undefined) : undefined

    return <Wrapper>
        {isBookmarked ?
            <ContinueButton /> :
            <Button size="xs" variant="outline" disabled={!chaptersData} asChild>
                <Link to={firstChapter ? generatePath(firstChapter.getReference()) : ""}><LuBookOpen />Начать чтение</Link>
            </Button>
        }

        {token && (
            <>
                <AdaptiveButton disabled={!bookData} onClick={() => navigate("./book_edit")} colorPalette={"blue"} label="Редактировать" size="xs" icon={<LuPen />} variant="outline" />
                <BookDeleteDialogue>
                    <AdaptiveButton disabled={!bookData} colorPalette={"red"} label="Удалить" size="xs" icon={<LuTrash />} variant="outline" />
                </BookDeleteDialogue>
            </>
        )}
    </Wrapper>
}