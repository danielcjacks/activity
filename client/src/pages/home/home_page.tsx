import { format } from 'date-fns'
import { observer } from 'mobx-react-lite'
import en_au from 'date-fns/locale/en-AU'
import { cloneDeep, range, set } from 'lodash'
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@material-ui/core'
import { home_store } from './home_store'
import { useEffect } from 'react'
import { action } from 'mobx'
import { VegaLite } from 'react-vega'
import { get_motivator_color } from '../graph/graph_page'
import { differenceInCalendarDays } from 'date-fns/esm'

export const HomePage = observer(() => {
  useEffect(() => {
    home_store.fetch_behaviours()
    home_store.fetch_behaviour_events()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <center>
            <Card style={{ maxWidth: '500px' }}>
              <Box padding={0}>
                <Greeting />
              </Box>
            </Card>
          </center>
        </Grid>
        <Grid item xs={12}>
          <center>
            <Card style={{ maxWidth: '500px' }}>
              <CardContent>
                <BehaviourLog />
              </CardContent>
            </Card>
          </center>
        </Grid>
        <Grid item xs={12}>
          <center>
            <Card style={{ maxWidth: '500px' }}>
              <CardContent>
                <SpineChart />
              </CardContent>
            </Card>
          </center>
        </Grid>
      </Grid>
    </div>
  )
})

const Greeting = observer(() => {
  const date = new Date()
  const locale = cloneDeep(en_au)

  set(locale, ['localize', 'dayPeriod'], (day_period) => day_period)
  // should be a string like 'morning' or 'evening'
  const time_message = format(date, 'BBBB', { locale })

  return <h1 style={{ color: 'darkgrey' }}>Good {time_message}</h1>
})

const BehaviourLog = observer(() => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      }}
    >
      {home_store.behaviours.map((behaviour, i) => (
        <BehaviourItem key={behaviour.id} behaviour_index={i} />
      ))}
    </div>
  )
})

type Props = {
  behaviour_index: number
}

const BehaviourItem = observer(({ behaviour_index }: Props) => {
  const behaviour = home_store.behaviours[behaviour_index]

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={!!behaviour.behaviour_event}
          onChange={(e) => home_store.toggle_behaviour_event(behaviour_index)}
        />
      }
      label={behaviour.name}
    />
  )
})

const SpineChart = observer(() => {
  const values = home_store.behaviour_events
    .map((el) => ({
      positivity: el.positivity,
      days_passed: differenceInCalendarDays(
        new Date(),
        new Date(el.time_stamp)
      ),
    }))
    .filter((el) => el.days_passed <= 30)
    .concat(
      new Array(30).fill(0).map((_, i) => ({ positivity: 0, days_passed: i }))
    )

  return (
    <>
      <VegaLite
        spec={{
          // width: '100%',
          height: 400,
          mark: {
            type: 'bar',
          },
          transform: [
            {
              calculate: 'datum.positivity + 5',
              as: 'order',
            },
          ],
          encoding: {
            y: {
              field: 'days_passed',
              type: 'ordinal',
              // aggregate: 'average',
              axis: {
                gridColor: 'dimgrey',
                title: 'Days ago',
                titleColor: 'grey',
                labelColor: 'lightgrey',
              },
            },
            x: {
              field: 'positivity',
              type: 'quantitative',
              sort: {
                field: 'order',
              },
              axis: {
                grid: false,
                title: 'Away / Towards (Total)',
                titleColor: 'grey',
                labelColor: 'lightgrey',
              },
            },
            color: {
              field: 'positivity',
              scale: {
                domain: range(-5, 6),
                range: range(-5, 6).map((positivity) =>
                  get_motivator_color(positivity, -5, 5)
                ),
              },
              legend: {
                labelColor: 'lightgrey',
                title: 'Away / Towards',
                titleColor: 'grey'
              }
            },
            order: {
              field: 'positivity',
              aggregate: 'count',
            },
            tooltip: [
              {
                field: 'positivity',
              },
              {
                field: 'order',
              },
            ],
          },
          data: { name: 'table' },
          background: '#424242',
        }}
        // data={{
        //   values,
        // }}
        data={{
          table: values,
        }}
      />
    </>
  )
})
