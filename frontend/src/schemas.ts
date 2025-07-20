import { ChapterReference } from "@/types"

export class BookPublic {
	public id!: string
	public title!: string
	public title_original!: string
	public description!: string
	public tags!: string
	public cover_path!: string
	public chapter_count!: number

	constructor(obj: Partial<BookPublic>) {
		Object.assign(this, obj)
	}
}

export class BookPreview {
	public id!: string
	public title!: string
	public title_original!: string
	public cover_path!: string

	constructor(obj: Partial<BookPreview>) {
		Object.assign(this, obj)
	}
}

export class ChapterPublic {
	public id!: number
	public volume!: number | null
	public index!: number
	public title!: string
	public content!: string

	getChapterReference() {
		return new ChapterReference(this.volume, this.index)
	}

	constructor(obj: Partial<ChapterPublic>) {
		Object.assign(this, obj)
	}
}
export class ChapterPreview {
	public id!: number
	public volume!: number | null
	public index!: number
	public title!: string
	public updated_at!: string
	public created_at!: string

	getReference() {
		return new ChapterReference(this.volume, this.index)
	}

	constructor(obj: Partial<ChapterPreview>) {
		Object.assign(this, obj)
	}
}
export class CommentPublic {
	public id!: number
	public user!: string
	public content!: string
	public updated_at!: string

	constructor(obj: Partial<CommentPublic>) {
		Object.assign(this, obj)
	}
}
