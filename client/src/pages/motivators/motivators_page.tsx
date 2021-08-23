import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardHeader,
} from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import { useState, useEffect } from 'react'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'

export const MotivatorsPage = observer(() => {
  return (
    <>
      <Card>
        <CardHeader title={'Motivators'} />
      </Card>
      <MotivatorsTable />
    </>
  )
})

const MotivatorsTable = observer(() => {
  const [motivators, set_motivators] = useState<any[]>([])

  useEffect(() => {
    //the `/prisma` route is hooked up on the backend.
    //the `where: {userId: shared_store.state.userId}` means that only select the values of the current logged in user,
    //similar to a `SELECT * WHERE` in SQL
    server_post(`/prisma/motivator/findMany`, {
      where: { user_id: shared_store.state.user_id },
    })
      .then((respond) => {
        set_motivators(respond)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Positivity</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {motivators.map((motivators) => {
          return (
            <>
              <TableRow>
                <TableCell>{motivators.name}</TableCell>
                <TableCell>{motivators.description}</TableCell>
                <TableCell>{motivators.positivity}</TableCell>
              </TableRow>
            </>
          )
        })}
      </TableBody>
    </Table>
  )
})
