import { useStrict } from 'mobx'
import React from 'react'
import { render } from 'react-dom'
import App from './app/app'

useStrict(true)

render(<App />, document.getElementById('app'))
