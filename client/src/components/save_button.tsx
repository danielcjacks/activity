import { Box, Fab, Tooltip } from '@material-ui/core'
import { Save } from '@material-ui/icons'
import { observer } from 'mobx-react-lite'
import { theme } from '../theme'
import { LoadingContainer } from './loading_container'

type SaveButtonProps = {
  can_save: boolean
  is_loading: boolean
  on_save: React.MouseEventHandler<HTMLButtonElement> | undefined
}

export const SaveButton = observer(
  ({ can_save, is_loading, on_save }: SaveButtonProps) => {
    return (
      <Tooltip title={can_save ? 'Save changes' : 'No changes to save'}>
        <Box position="fixed" bottom={75} right={15}>
          <Fab
            color="primary"
            style={{
              backgroundColor: theme.palette.success.main,
            }}
            onClick={on_save}
            disabled={!can_save}
          >
            <LoadingContainer is_loading={is_loading}>
              <Save
                style={{
                  color: 'white',
                }}
                fontSize="large"
              />
            </LoadingContainer>
          </Fab>
        </Box>
      </Tooltip>
    )
  }
)
