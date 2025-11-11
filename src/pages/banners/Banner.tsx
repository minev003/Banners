import { FormControl, FormLabel, Input, Button, Box, FormHelperText } from '@mui/joy'
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

    // states for error messages
    const [linkError, setLinkError] = useState('')
    const [imageUrlError, setImageUrlError] = useState('')

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

        let isValid = true

        setLinkError('')
        setImageUrlError('')

        if (!link.trim()) {
            setLinkError('Link field is required.')
            isValid = false
        } else if (!link.includes('http')) {
            setLinkError('Link must include "http" or "https".')
            isValid = false
        }

        if (!imageUrl.trim()) {
            setImageUrlError('Image URL field is required.')
            isValid = false
        } else if (!imageUrl.includes('http')) {
            setImageUrlError('Image URL must include "http" or "https"')
            isValid = false
        }

        // If the form is not validstop execution.
        if (!isValid) {
            setLoading(false)
            return
        }

        setLoading(true)

        const banner: BannerDto = {
            link: link,
            imageUrl: imageUrl,
        }

        try {
            if (!id || id === 'new') {
                await BannerService.createBanner(banner)
            } else {
                await BannerService.updateBanner(id, banner)
            }
            navigate('/banners')
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <form onSubmit={handleSubmit}>
                <FormControl required sx={{ mb: 2 }} error={!!linkError}>
                    <FormLabel>Link</FormLabel>
                    <Input
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="e.g. https://example.com"
                        error={!!linkError}
                    />
                    {linkError && <FormHelperText>{linkError}</FormHelperText>}
                </FormControl>

                <FormControl required sx={{ mb: 2 }} error={!!imageUrlError}>
                    <FormLabel>Image URL</FormLabel>
                    <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="e.g. https://example.com/image.jpg"
                        error={!!imageUrlError}
                    />
                    {imageUrlError && <FormHelperText>{imageUrlError}</FormHelperText>}
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