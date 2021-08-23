import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import { useState, useEffect } from 'react'
import { server_post } from '../../server_connector'
import { shared_store } from '../../shared_store'


export const ValuesPage = observer(() => {
    return <> Values table
    </>
})

const ValuesTable = observer(() => {
    const [values, setValues] =  useState<any[]>([])
    
    useEffect(() => {        
        //the `/prisma` route is hooked up on the backend.
        //the `where: {userId: shared_store.state.userId}` means that only select the values of the current logged in user, 
        //similar to a `SELECT * WHERE` in SQL
        server_post(`/prisma/value/findMany`, { 
            where: {userId: shared_store.state.user_id}})
            .then((respond) => {
                setValues(respond)
            })
            .catch((error) =>{
                console.log(error)
            })
    }, []);
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Importance</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {values.map(value => {
                return(
                    <><TableRow>
                        <TableCell>{value.name}</TableCell>
                        <TableCell>{value.description}</TableCell>
                        <TableCell>{value.importance}</TableCell>
                    </TableRow></>
                )
            })}
        </TableBody>
    </Table>
})