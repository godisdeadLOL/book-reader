import { BookPublic } from "@/schemas"
import { Wrap, For, Badge, Skeleton } from "@chakra-ui/react"

export const Tags = ({ bookData }: { bookData?: BookPublic }) => {
    const tags = bookData ? bookData.tags.split(",").map((item: string) => item.trim()) : Array(8).fill(undefined)

    return (
        <Wrap gap={2}>
            <For each={tags}>
                {(item, index) => (
                    item ?
                        <Badge variant={"outline"} key={index}>{item}</Badge> :
                        <Skeleton h={4} w={`${64 + (index % 2 === 0 ? 1 : -1) * 8}px`} key={index}>...</Skeleton>
                )}
            </For>
        </Wrap>
    )
}