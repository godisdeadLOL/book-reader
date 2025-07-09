import { Flex, Skeleton, Stack } from "@chakra-ui/react"

const ChapterEntrySkeleton = () => {
    return <Flex gap={2} fontSize="xs" alignItems="center" height="36px">
        <Skeleton w={14}>...</Skeleton>
        <Skeleton flexGrow={1} maxW={32}>...</Skeleton>
        <Skeleton w={20} ml={"auto"}>...</Skeleton>
    </Flex>
}

type ChapterListSkeletonProps = {
    count?: number
}
export const ChapterListSkeleton = ({ count = 10 }: ChapterListSkeletonProps) => {
    return <Stack gap={2}>
        {Array(count).fill(undefined).map(() => <ChapterEntrySkeleton />)}
    </Stack>
}