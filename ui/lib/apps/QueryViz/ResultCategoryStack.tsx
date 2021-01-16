import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

import React, { useMemo } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'

import { QueryeditorRunResponse } from '@lib/client'

import styles from './ResultCategoryStack.module.less'
import { ScrollablePane } from 'office-ui-fabric-react/lib/ScrollablePane'

interface IResultCategoryStackProps {
  results?: QueryeditorRunResponse
  defaultCategory?: String
}

const HEIGHT = 500

function ResultCategoryStack({
  results,
  defaultCategory,
}: IResultCategoryStackProps) {
  const opt = useMemo(() => {
    if (!results) {
      return null
    }

    const columnNames = results.column_names ?? []
    if (columnNames.length !== 3) {
      return null
    }
    const stack = columnNames[2]

    defaultCategory = defaultCategory ?? 'default'
    let keys: Array<String> = []
    let categories: Array<String> = []

    const data = results.rows ?? []

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
      stack: stack,
      data: matrix[i],
      label: {
        show: true,
        position: 'insideRight',
      },
    }))

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: keys,
      },
      legend: {
        data: categories,
      },
      series: series,
    }
  }, [results])

  return (
    <div className={styles.resultCategoryStack}>
      <ScrollablePane>
        <ReactEchartsCore
          echarts={echarts}
          lazyUpdate={true}
          style={{ height: HEIGHT }}
          option={opt}
          theme={'light'}
        />
      </ScrollablePane>
    </div>
  )
}

export default ResultCategoryStack
