export class ChapterReference {
    constructor(
        public volume: number | null,
        public index: number
    ) { }

    getRepr(): string {
        const volume = this.volume ? `Том ${this.volume} ` : ''
        const index = `Глава ${this.index}`

        return `${volume}${index}`
    }

    isLater(other: ChapterReference): boolean {
        return (this.volume ?? 0) > (other.volume ?? 0) || this.index > other.index
    }
}

export function isSameChapter(a: ChapterReference, b: ChapterReference) {
    return a.index === b.index && a.volume === b.volume
}

export type ParagraphReference = {
    chapter: ChapterReference
    number: number
}

export function isSameParagraph(a: ParagraphReference, b: ParagraphReference) {
    return isSameChapter(a.chapter, b.chapter) && a.number === b.number
}

export type BookmarkData = {
    passiveBookmark: ChapterReference | null
    activeBookmark: ParagraphReference | null
}