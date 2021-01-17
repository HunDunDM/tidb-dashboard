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

interface IResultCategoryStackProps {
  results?: QueryeditorRunResponse
  defaultCategory?: string
  height: number
}

function ResultCategoryStack({
  results,
  defaultCategory = 'NULL',
  height,
}: IResultCategoryStackProps) {
  const opt = useMemo(() => {
    if (!results) {
      return null
    }

    const columnNames = results.column_names ?? []
    const data = results.rows ?? []
    let keys: Array<string> = []
    let categories: Array<string> = []

    data.forEach((row) => {
      keys.push(String(row[0]))
      categories.push(String(row[1] ?? defaultCategory))
    })

    keys = Array.from(new Set(keys)).sort()
    categories = Array.from(new Set(categories)).sort()
    const matrix: Array<Array<number>> = []
    categories.forEach(() => {
      matrix.push(new Array<number>())
    })
    data.forEach((row) => {
      const key = String(row[0])
      const category = String(row[1] ?? defaultCategory)
      matrix[categories.indexOf(category)][keys.indexOf(key)] = Number(row[2])
    })
    const series = categories.map((category, i) => ({
      name: category,
      type: 'bar',
      stack: columnNames[2],
      data: matrix[i],
      label: {
        show: false,
      },
    }))
    return {
      title: {
        text: columnNames[2],
        left: 'center',
        top: 20,
        textStyle: {
          color: '#333',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        name: columnNames[0],
        type: 'value',
      },
      yAxis: {
        name: columnNames[2],
        type: 'category',
        data: keys,
      },
      legend: {
        data: categories,
      },
      series: series,
    }
  }, [results, defaultCategory])

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

export default ResultCategoryStack
