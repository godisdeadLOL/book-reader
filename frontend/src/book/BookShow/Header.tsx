import { BookPublic } from "@/schemas"
import { Image, Box, Skeleton } from "@chakra-ui/react"

const Wrapper = ({ children }: any) => <Box mx="auto" w="fit">{children}</Box>

const HeaderSkeleton = () => (<Wrapper>
    <Skeleton height={"256px"} aspectRatio={0.65} />
    <Skeleton mx="auto" fontSize="sm" mt={4} w={256 * 0.65 * 0.9}>...</Skeleton>
    <Skeleton mx="auto" fontSize="xs" mt={2} w={256 * 0.65 * 0.7}>...</Skeleton>
</Wrapper>)

export const Header = ({ bookData }: { bookData?: BookPublic }) => {
    if (!bookData) return <HeaderSkeleton />

    return <Wrapper>
        <Image rounded="md" height={"256px"} mx={"auto"} src={`${import.meta.env.VITE_BASE_URL}/covers/${bookData.cover_path}`} />

        <Box fontSize="md" fontWeight="bold" textAlign="center" mt={4}>
            {bookData.title}
        </Box>
        <Box fontSize="sm" color="GrayText" textAlign="center">
            {bookData.title_original}
        </Box>
    </Wrapper>
}