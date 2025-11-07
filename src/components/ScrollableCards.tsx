import { Grid } from '@mui/joy'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useCallback, useEffect, useState } from 'react'
import { PageRequest } from '../services/dto/page.request.ts'
import { PageResponse } from '../services/dto/page.response.ts'
import Box from '@mui/joy/Box'

export default function ScrollableCards<T>(props: {
    loadMore: (page: PageRequest) => Promise<PageResponse<T> | undefined>
    mapCard: (value: T, deleteItem: (id: string) => void) => React.JSX.Element
    skeletonMap: (_: any, index: number) => React.JSX.Element
}) {
    const initial = [...Array(12)].map(props.skeletonMap)
    const [cards, setCards] = useState<React.JSX.Element[]>(initial)
    const [page, setPage] = useState<number>(-1)
    const [hasMore, setHasMore] = useState<boolean>(true)

    const deleteItem = useCallback((id: string) => {
        setCards((prevCardsState) => {
            const i = prevCardsState.findIndex((card) => card.key == id)
            if (i != -1) {
                const newCards = [...prevCardsState]
                newCards.splice(i, 1)
                return newCards
            }
            return prevCardsState
        })
    }, [])

    const loadBanners = useCallback(async () => {

        const pageToLoad = page + 1;
        const newCards = await props.loadMore({ page: pageToLoad, pageSize: 12 })

        if (!newCards) {
            return
        }

        setPage(newCards.pageNumber)
        setHasMore(newCards.maxPageNumber > newCards.pageNumber)

        const newElements = newCards.content.map((value) => props.mapCard(value, deleteItem))


        setCards((prevCardsState) => {
            if (newCards.pageNumber === 0) {
                const filteredPrevCards = prevCardsState.filter(card => !card.key?.toString().startsWith('skeleton-'));
                // Филтрираме дубликати и при първото зареждане
                const existingKeys = new Set(filteredPrevCards.map(card => card.key?.toString()).filter(Boolean));
                const uniqueNewElements = newElements.filter(element => !existingKeys.has(element.key?.toString()));
                return [...filteredPrevCards, ...uniqueNewElements];
            }

            // Филтрираме дубликати - добавяме само карти с ключове, които още не съществуват
            const existingKeys = new Set(prevCardsState.map(card => card.key?.toString()).filter(Boolean));
            const uniqueNewElements = newElements.filter(element => !existingKeys.has(element.key?.toString()));
            return [...prevCardsState, ...uniqueNewElements];
        });

    }, [page, deleteItem, props])

    useEffect(() => {
        if (page === -1) { // Изпълнява го само за първата страница
            loadBanners().catch((reason) => console.error(reason))
        }
    }, [loadBanners])

    const loadMore = () => {
        loadBanners().catch((reason) => console.error(reason))
    }

    return (
        <Grid>
            <InfiniteScroll
                dataLength={cards.length}
                next={loadMore}
                hasMore={hasMore}
                scrollableTarget="scroll"
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>There are no more items available...</b>
                    </p>
                }
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(1, 1fr)',
                            md: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)',
                        },
                        gap: 2,
                    }}
                >
                    {cards.map((card, _index) => (
                        <React.Fragment key={card.key}>
                            {card}
                        </React.Fragment>
                    ))}
                </Box>
            </InfiniteScroll>
        </Grid>
    )
}
