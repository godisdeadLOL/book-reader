import { Container } from "@chakra-ui/react"
import { BrowserRouter, Route, Routes } from "react-router"
import { BookCreate } from "@/book/BookCreate"
import { BookList } from "@/book/BookList"
import { BookShow } from "@/book/BookShow"
import { LoginForm } from "@/LoginForm"
import { ChapterCreate } from "@/chapter/ChapterCreate"
import { Toaster } from "@/components/ui/toaster"
import { ChapterShow } from "@/chapter/ChapterShow"
import { BookTitle } from "@/book/BookTitle"
import { ChapterEdit } from "@/chapter/ChapterEdit"
import { Appbar } from "@/appbar/Appbar"
import { AppbarChapter } from "@/appbar/AppbarChapter"
import { BookEdit } from "@/book/BookEdit"

const Screen = ({ appbar, content }: any) => {
	return (
		<>
			{appbar}
			<Container maxW={"breakpoint-lg"} py={4}>
				{content}
			</Container>
		</>
	)
}

export const App = () => {
	return (
		<BrowserRouter>
			<Toaster />
			<Routes>
				<Route path="auth" element={<LoginForm />} />

				<Route path="" element={<Screen appbar={<Appbar title="Каталог" />} content={<BookList />} />} />

				<Route path="book_create" element={<Screen appbar={<Appbar title="Создание книги" />} content={<BookCreate />} />} />

				<Route path=":book_id" element={<Screen appbar={<Appbar title={<BookTitle />} />} content={<BookShow />} />} />
				<Route path=":book_id/:chapter_index" element={<Screen appbar={<AppbarChapter />} content={<ChapterShow />} />} />
				<Route path=":book_id/:chapter_index/chapter_edit" element={<Screen appbar={<AppbarChapter />} content={<ChapterEdit />} />} />

				<Route path=":book_id/chapter_create" element={<Screen appbar={<Appbar title="Добавление главы" />} content={<ChapterCreate />} />} />
				<Route path=":book_id/book_edit" element={<Screen appbar={<Appbar title={<>Редактирование<BookTitle /></>} />} content={<BookEdit />} />} />
			</Routes>
		</BrowserRouter>
	)
}
