import { BookForm } from "@/book/BookForm"
import { Box, Icon } from "@chakra-ui/react"
import { LuAlarmClock } from "react-icons/lu"

export const Demo = () => {

	return <Box bg="red" w={64}>
		Вова как дела? <Icon><LuAlarmClock /></Icon> Сосал или нет? а может да?
	</Box>
}