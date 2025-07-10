import { Box, Skeleton } from "@chakra-ui/react"

export const ChapterSkeleton = () => {
    const step = 6

    return <Box overflowAnchor={"none"} id="chapter-skeleton">
        <Skeleton maxW={64}>...</Skeleton>
        {[...Array(12)].map((entry, index) => <Skeleton ml={index % step === 0 ? 8 : 0} h={4} mt={index % step === 0 ? 8 : 2} w={index % step === (step - 1) ? '60%' : 'auto'} />)}
    </Box>
}