import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import { observer } from 'mobx-react-lite'


export const ValuesPage = observer(() => {
    return <> Values table
    </>
})

const ValuesTable = observer(() => {
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