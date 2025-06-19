import { Box, HStack } from "@chakra-ui/react"

export const AppbarBase = ({ title, controls, backButton = null }: any) => {
	return (
		<Box position={"sticky"} backgroundColor={"Background"} zIndex={100} top={0} px={4} h={14} borderBottom={1} borderStyle={"solid"} borderColor={"border"} asChild>
			<HStack gap={2}>
				{backButton}
				{title}
				<Box mx={"auto"} />
				{controls}
			</HStack>
		</Box>
	)
}
