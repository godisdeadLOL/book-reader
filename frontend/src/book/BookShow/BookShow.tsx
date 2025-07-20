import { Tabs, chakra, Separator, Button, HStack } from "@chakra-ui/react"
import { LuArrowUpDown } from "react-icons/lu"
import { useCurrentBookQuery, useCurrentChaptersQuery } from "@/hooks/queries"
import { useEffect, useState } from "preact/hooks"
import { ChapterList } from "@/chapter/ChapterList"
import { useClearQueries } from "@/hooks/useClearQueries"

import { Header } from "./Header"
import { Description } from "./Description"
import { Tags } from "./Tags"
import { Controls } from "./Controls"
import { useNavigate } from "react-router"

export const BookShow = () => {
	const { data: bookData, isError } = useCurrentBookQuery()
	const { data: chaptersData } = useCurrentChaptersQuery()

	const { clearChapterShow } = useClearQueries()
	useEffect(() => {
		clearChapterShow()
	}, [])

	useEffect(() => {
		if (bookData) document.title = bookData?.title
	}, [bookData])

	const navigate = useNavigate()
	useEffect(() => {
		if (isError) navigate("/")
	}, [isError])

	const [reverse, setReverse] = useState(false)

	return (
		<>
			<Header bookData={bookData} />
			<Controls bookData={bookData} />

			<Tabs.Root defaultValue={"description"} unmountOnExit={true} lazyMount={true}>
				<Tabs.List>
					<Tabs.Trigger value={"description"}> Описание </Tabs.Trigger>
					<Tabs.Trigger value={"chapters"}>
						Главы
						<chakra.span fontFamily={"mono"} fontSize={"x-small"} mb={-1}>
							{chaptersData ? chaptersData.length : ""}
						</chakra.span>
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value={"description"} pb={8}>
					<Description bookData={bookData} />
					<Tags bookData={bookData} />
				</Tabs.Content>

				<Tabs.Content value={"chapters"}>
					<HStack>
						<Button size="xs" variant="outline" onClick={() => setReverse(value => !value)}> <LuArrowUpDown /> Сортировать </Button>
						{/* <Button size="xs" variant="outline"> <LuArrowDown /> К главе </Button> */}
					</HStack>

					<Separator my={4} />

					<ChapterList reverse={reverse} />

				</Tabs.Content>
			</Tabs.Root>
		</>
	)
}
