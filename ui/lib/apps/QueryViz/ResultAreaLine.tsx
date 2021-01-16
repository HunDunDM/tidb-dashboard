import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'

import React, { useMemo } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'

import { QueryeditorRunResponse } from '@lib/client'

import styles from './Result.module.less'
import { ScrollablePane } from 'office-ui-fabric-react/lib/ScrollablePane'

interface IResultAreaLineProps {
  results?: QueryeditorRunResponse
  height: number
}

function ResultAreaLine({ results, height }: IResultAreaLineProps) {
  const opt = useMemo(() => {
    if (!results) {
      return null
    }

    const columnNames = results.column_names ?? []
    const data = results.rows ?? []
    const keys = data.map((row) => String(row[0])).sort()
    const values: Array<number> = []
    data.forEach((row) => {
      values[keys.indexOf(String(row[0]))] = Number(row[1])
    })

    return {
      title: {
        text: columnNames[1],
        left: 'center',
        top: 20,
        textStyle: {
          color: '#333',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      xAxis: {
        type: 'category',
        data: keys,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'line',
          data: values,
          areaStyle: {},
        },
      ],
    }
  }, [results])

  return (
    <div className={styles.result}>
      <ScrollablePane style={{ height }}>
        <ReactEchartsCore
          echarts={echarts}
          lazyUpdate={true}
          style={{ height }}
          option={opt}
          theme={'light'}
        />
      </ScrollablePane>
    </div>
  )
}

export default ResultAreaLine
