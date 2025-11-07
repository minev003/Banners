import { FormControl, FormLabel, Input, Button, Box } from '@mui/joy'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'
import BannerService from '../../services/banner.service.ts'
import { BannerDto } from '../../services/dto/banner.dto.ts'

export default function Banner() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { setPageData } = usePageData()

    const [link, setLink] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (id === 'new') {
            setPageData({ title: 'Banners > Create' })
        } else {
            setPageData({ title: 'Banners > Edit' })
            if (id) {
                BannerService.getBanner(id).then((banner) => {
                    if (banner) {
                        setLink(banner.link)
                        setImageUrl(banner.imageUrl)
                    }
                })
            }
        }
    }, [id, setPageData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const banner: BannerDto = {
            link: link,
            imageUrl: imageUrl,
        }

        if (!id || id === 'new') {
            await BannerService.createBanner(banner)
        } else {
            await BannerService.updateBanner(id, banner)
        }

        setLoading(false)
        navigate('/banners')
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <form onSubmit={handleSubmit}>
                <FormControl required sx={{ mb: 2 }}>
                    <FormLabel>Link</FormLabel>
                    <Input
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="test"
                    />
                </FormControl>

                <FormControl required sx={{ mb: 2 }}>
                    <FormLabel>Image URL</FormLabel>
                    <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="test"
                    />
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => navigate('/banners')}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="solid" loading={loading}>
                        {id === 'new' ? 'Create' : 'Save'}
                    </Button>
                </Box>
            </form>
        </Box>
    )
}