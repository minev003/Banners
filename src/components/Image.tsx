import { AspectRatio, Skeleton } from '@mui/joy'
import { useEffect, useState } from 'react'
import ImageService from '../services/image.service.ts'

export default function Image(props: {
    url?: string
}) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [imageSrc, setImageSrc] = useState<string>()

    useEffect(() => {
        if (props.url) {
            ImageService.fetchImage(props.url)
                .then((value) => {
                    if (value) {
                        setImageSrc(value)
                        setIsLoaded(true)
                    }
                },
                )
        }
        //url
    }, [props.url])

    useEffect(() => {
        if (imageSrc) {
            return () => URL.revokeObjectURL(imageSrc)
        }
    }, [imageSrc])

    return (
        <AspectRatio
            ratio="2"
            objectFit="cover"
        >
            <Skeleton
                loading={!isLoaded}
                variant="overlay"
            >
                <img
                    src={imageSrc}
                    style={{
                        ...(isLoaded ? {} : { visibility: 'hidden' }),
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                    alt="Banner"
                    onLoad={() => setIsLoaded(true)}
                    onError={() => {
                        setImageSrc('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial" font-size="20">No image</text></svg>')
                        setIsLoaded(true)
                    }}
                />
            </Skeleton>
        </AspectRatio>
    )
}
