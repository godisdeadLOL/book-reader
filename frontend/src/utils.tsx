export const clampText = (text: string, maxSize: number) => {
	if (text.length > maxSize) return text.substring(0, maxSize) + "..."
	else return text
}

export const handleResponse = (response: Response) => {
	if (response.ok) return response.json()
	else return Promise.reject(new Error(`${response.status}: ${response.statusText}`))
}

const getLastDigit = (num: number) => num % 10
export const formatTimestamp = (timestamp: string) => {
	// const time = new Date(timestamp + "Z")
	// const now = new Date()

	// const diff = now.getTime() - time.getTime()
	// const minutes = Math.ceil(diff / (1000 * 60))
	// const hours = Math.ceil(diff / (1000 * 60 * 60))

	// const linking = [2, 0, 1, 1, 1, 2, 2, 2, 2, 2]
	// const callings = [
	// 	["минута", "минуты", "минут"],
	// 	["час", "часа", "часов"],
	// ]

	// if (minutes < 60) return `${minutes} ${callings[0][linking[getLastDigit(minutes)]]} назад`
	// else if (hours < 24) return `${hours} ${callings[1][linking[getLastDigit(hours)]]} назад`
	// else {
	// 	const options: any = {
	// 		weekday: "short",
	// 		year: "numeric",
	// 		month: "short",
	// 		day: "numeric",
	// 		hour: "2-digit",
	// 		minute: "2-digit",
	// 	}

	// 	return time.toLocaleString("ru-RU", options)
	// }
	const time = new Date(timestamp + "Z")
	const options: any = {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	}
	return time.toLocaleString("ru-RU", options)
}

export const convertNameToColor = (name: string) => {
	const colors = ["gray", "red", "green", "blue", "teal", "pink", "purple", "cyan", "orange", "yellow"]

	let total = 0
	for (var i = 0; i < name.length; i++) total += name.charCodeAt(i)

	return colors[total % colors.length]
}

export const fixDirectSpeech = (text: string) => {
	return text.replaceAll("\n-", "\n—")
}

// setBookmark(book_id: number, index: number)
// getBookmark(book_id: number) -> number
// clearBookmark(book_id: number)
