import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import { observer } from 'mobx-react-lite'


export const MotivatorsPage = observer(() => {
    return <> Motivator table
    </>
})

const MotivatorsTable = observer(() => {
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Importance</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            
        </TableBody>
    </Table>
})