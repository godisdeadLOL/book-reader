import { Box, HStack, Skeleton, Stack, SkeletonText, Center, Spinner } from "@chakra-ui/react"
import { forwardRef } from "preact/compat"

export const CommentEntrySkeleton = () => {
    return <Box>
        <HStack gap={4} alignItems="start" pb={4}>
            <Skeleton w={8} h={8} />

            <Stack gap={1} justifyContent="start">
                <Skeleton w={32} h={4} />
                <Skeleton w={24} h={3} />
            </Stack>
        </HStack>

        <SkeletonText noOfLines={2} />
    </Box>
}

export const CommentBlockSkeleton = () => {
    return <>
        {Array(5).fill(undefined).map(_ => <CommentEntrySkeleton />)}
    </>
}

export const CommentBlockLoading = forwardRef(({ }, ref) => {
    return <Center ref={ref}>
        <Spinner size="lg" />
    </Center>
})