import { Prose } from "@/components/ui/prose"
import { BookPublic } from "@/schemas"
import { Box, Link, SkeletonText } from "@chakra-ui/react"
import { useState } from "preact/hooks"
import Markdown from "react-markdown"

const Wrapper = ({ children }: any) => <Box mb={6}>{children}</Box>

const DescriptionSkeleton = () => <Wrapper><SkeletonText noOfLines={5} /></Wrapper>


export const Description = ({ bookData }: { bookData?: BookPublic }) => {
    if (!bookData) return <DescriptionSkeleton />

    const [expanded, setExpanded] = useState(false)

    return <Wrapper>
        <Prose maxW={"full"} mb={2} fontSize="sm" lineClamp={expanded ? "none" : 5}>
            <Markdown>{bookData.description}</Markdown>
        </Prose>

        <Link onClick={() => setExpanded(value => !value)} fontSize="sm" color="blue.500">{expanded ? "Свернуть" : "Подробнее..."}</Link>
    </Wrapper>
}