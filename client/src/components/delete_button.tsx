import { IconButton, Tooltip } from '@material-ui/core'
import { theme } from '../theme'

type DeleteButtonProps = {
    is_deleted: boolean
    on_delete: React.MouseEventHandler<HTMLButtonElement> | undefined
    on_restore: React.MouseEventHandler<HTMLButtonElement> | undefined
}

export const DeleteButton = ({ is_deleted, on_delete, on_restore }: DeleteButtonProps) => {
    return is_deleted
        ? <Tooltip title='Delete'>
            <IconButton
                style={{ color: theme.palette.error.main }}
                onClick={on_delete}
            >
            </IconButton>
        </Tooltip>
        : <Tooltip title='Restore'>
            <IconButton
                onClick={on_restore}
            >
            </IconButton>
        </Tooltip>
}