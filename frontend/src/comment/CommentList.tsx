import { useCurrentChapterQuery } from "@/hooks/queries"
import { CommentBlock } from "./CommentBlock"
import { Stack, For } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "preact/hooks"

import { CommentBlockLoading, CommentBlockSkeleton } from "./skeletons"
import { CommentListFallback } from "./CommentListFallback"

const Wrapper = ({ children }: any) => {
	return <Stack gap={8}>{children}</Stack>
}

export const CommentList = () => {
	const { data: chapterData } = useCurrentChapterQuery(false)
	if (!chapterData) return <Wrapper><CommentBlockSkeleton /></Wrapper>

	const [pageCount, setPageCount] = useState(1)
	const [state, setState] = useState<"loading" | "await" | "finished">("loading")

	const onLastChapterLoaded = (isEmpty: boolean) => {
		if (!isEmpty) setState("await")
		else setState("finished")
	}

	const blockLoading = useRef<any>()
	useEffect(() => {
		if (state !== "await") return

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries

				if (entry.isIntersecting) {
					setPageCount(value => value + 1)
					setState("loading")
				}
			},
			{ root: null, rootMargin: "0px", threshold: 1.0 }
		)

		if (blockLoading.current) observer.observe(blockLoading.current)
		return () => { if (blockLoading.current) observer.unobserve(blockLoading.current) }

	}, [state])

	if (state === "finished" && pageCount === 1) return <CommentListFallback />

	return (
		<Wrapper>
			{chapterData && Array(pageCount).fill(undefined).map((_, index) =>
				<CommentBlock
					key={index} isFirst={index === 0}
					onBlockLoaded={index === (pageCount - 1) ? onLastChapterLoaded : undefined} chapterId={chapterData.id} page={index + 1}
				/>)
			}

			{state === "loading" && (pageCount === 1 ? <CommentBlockSkeleton /> : <CommentBlockLoading />)}
			{state === "await" && <CommentBlockLoading ref={blockLoading} />}

		</Wrapper>
	)
}
