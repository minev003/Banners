import { BannerDto } from '../../services/dto/banner.dto.ts'
import { Button, Card, CardActions, CardOverflow, Grid, Skeleton, Typography } from '@mui/joy'
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
            <Grid
                xl={3}
                lg={4}
                md={6}
                sm={6}
                xs={12}
            >
                <Card sx={{ height: 400 }}>
                    <CardOverflow>
                        <Image url={props.banner?.imageUrl} />
                    </CardOverflow>
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
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
                    </Box>
                    <CardActions>
                        <IconButton
                            variant="outlined"
                            size="sm"
                            sx={{ width: '20%', alignSelf: 'center' }}
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <Delete />
                        </IconButton>
                        <Button
                            variant="solid"
                            type={'button'}
                            size="md"
                            onClick={() => navigate({ pathname: `/banners/${props.banner!.id}` })}
                            color="primary"
                            sx={{ width: '75%', alignSelf: 'center', fontWeight: 600 }}
                        >
                            Edit
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            {props.banner && (
                <ConfirmModal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    confirm={() => {
                        setShowDeleteModal(false)
                        if (props.delete) {
                            props.delete()
                        }
                    }}
                    action="delete this banner"
                />
            )}
        </>
    )
}