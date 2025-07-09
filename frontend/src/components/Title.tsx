import { Box, chakra, Skeleton } from "@chakra-ui/react"

export const Title = chakra(({ children, ...other }: any) => {

	// if(!children) return <Skeleton>...</Skeleton>

	return <Box overflow="hidden" textOverflow="ellipsis" textWrap="nowrap" {...other}>
		{children}
	</Box>
})