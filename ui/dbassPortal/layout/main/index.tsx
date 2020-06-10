import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { animated } from 'react-spring'

import { Root } from '@lib/components'

import styles from './index.module.less'

export default function App() {
  return (
    <Root>
      <Router>
        <animated.div className={styles.container}>
          <div className={styles.content}>
            <div id="__spa_content__"></div>
          </div>
        </animated.div>
      </Router>
    </Root>
  )
}