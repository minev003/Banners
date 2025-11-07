import { Button } from '@mui/joy'
import Add from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'

export default function FAB() {
    const navigate = useNavigate()

    return (
        <Button
            style={{
                position: 'fixed',
                right: '72px',
                bottom: '32px',
                height: '72px',
                borderRadius: '50%',
            }}
            size="lg"
            onClick={() => navigate('/banners/new')}
        >
            <Add />
        </Button>
    )
}