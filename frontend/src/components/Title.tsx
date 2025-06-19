import { Box } from "@chakra-ui/react"

export const Title = ({ children }: any) => {
	return (
		<Box overflow="hidden" textOverflow="ellipsis" textWrap="nowrap">
			{children}
		</Box>
	)
}
