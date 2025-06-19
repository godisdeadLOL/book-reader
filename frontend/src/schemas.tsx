export type BookPublic = {
	id: number
	title: string
	title_original: string
	description: string
	tags: string
	cover_path: string
	chapter_count: number
}

export type BookPreview = {
	id: number
	title: string
	title_original: string
	cover_path: string
}

export type ChapterPublic = {
	id: number
	index: number
	title: string
	content: string
	total_amount: number
}

export type ChapterPreview = {
	id: number
	index: number
	title: string
	updated_at: string
}

export type CommentPublic = {
	id: number
	user: string
	content: string
	updated_at: string
}
