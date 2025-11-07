import BannerService from '../../services/banner.service.ts'
import ScrollableCards from '../../components/ScrollableCards.tsx'
import { useEffect } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import BannerCard from '../../components/banner/BannerCard.tsx'
import FAB from '../../components/FAB.tsx'

export default function Banners() {
    const { setPageData } = usePageData()

    useEffect(() => {
        setPageData({ title: 'Banners' })
    }, [setPageData])

    return (
        <>
            <ScrollableCards
                key={location.pathname}
                loadMore={page => BannerService.getBanners(page)}
                mapCard={(banner, deleteItem) => (
                    <BannerCard
                        key={banner.id}
                        banner={banner}
                        delete={async () => {
                            await BannerService.deleteBanner(banner.id!)
                                .then(() => deleteItem(banner.id!))
                                .catch((reason) => console.error(reason))
                        }}
                    />
                )}
                skeletonMap={(_, i) => <BannerCard key={'skeleton-' + i} />}
            />
            <FAB />
        </>
    )
}
