import { BannerDto } from '../../services/dto/banner.dto.ts'
import { Button, Card, CardActions, CardOverflow, Skeleton, Typography } from '@mui/joy'
import Box from '@mui/joy/Box'
import IconButton from '@mui/joy/IconButton'
import { Delete } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import Image from '../Image.tsx'
import { useState } from 'react'
import ConfirmModal from '../ConfirmModal.tsx'

export default function BannerCard(props: { banner?: BannerDto; delete?: () => void }) {
    const navigate = useNavigate()
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    return (
        <>
            <Card
                component="a"
                href={props.banner?.link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    height: 400,
                    width: '100%',
                    minWidth: 280,
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: '0.3s',
                    overflow: 'hidden',
                    '&:hover': {
                        boxShadow: 'xl',
                        translate: '0 -4px',
                    },
                }}
            >
                <CardOverflow>
                    <Image url={props.banner?.imageUrl} />
                </CardOverflow>

                <Box sx={{ flexGrow: 1, p: 2 }}>
                    <Typography
                        level="title-lg"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%',

                        }}
                    >
                        <Skeleton
                            loading={!props.banner}
                            variant="text"
                            sx={{ width: '100%', height: '100%' }}
                        >
                            {props.banner?.link}
                        </Skeleton>
                    </Typography>
                </Box>

                <CardActions
                    onClick={(e) => e.stopPropagation()}
                    sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}
                >
                    <IconButton
                        variant="outlined"
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setShowDeleteModal(true)
                        }}
                    >
                        <Delete />
                    </IconButton>

                    <Button
                        variant="solid"
                        type="button"
                        size="md"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            navigate(`/banners/${props.banner!.id}`)
                        }}
                        color="primary"
                        sx={{ fontWeight: 600 }}
                    >
                        Edit
                    </Button>
                </CardActions>
            </Card>

            {props.banner && (
                <ConfirmModal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    confirm={() => {
                        setShowDeleteModal(false)
                        if (props.delete) props.delete()
                    }}
                    action="delete this banner"
                />
            )}
        </>
    )
}