import { format } from 'date-fns'
import { observer } from 'mobx-react-lite'
import en_au from 'date-fns/locale/en-AU'
import { cloneDeep, set } from 'lodash'
import { Checkbox, FormControlLabel, Grid } from '@material-ui/core'
import { home_store } from './home_store'
import { useEffect } from 'react'
import { action } from 'mobx'

export const HomePage = observer(() => {
  useEffect(() => {
    home_store.fetch_behaviours()
  }, [])

  return (
    <>
      <Greeting />
      <BehaviourLog />
    </>
  )
})

const Greeting = observer(() => {
  const date = new Date()
  const locale = cloneDeep(en_au)

  set(locale, ['localize', 'dayPeriod'], (day_period) => day_period)
  // should be a string like 'morning' or 'evening'
  const time_message = format(date, 'BBBB', { locale })

  return <h1>Good {time_message}</h1>
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
          onChange={e => home_store.toggle_behaviour_event(behaviour_index)}
        />
      }
      label={behaviour.name}
    />
  )
})
