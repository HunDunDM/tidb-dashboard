import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts-gl'

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

function ResultBar3D({
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
    let maxValue = 0

    const source = data.map((row) => {
      keys.push(String(row[0]))
      categories.push(String(row[1] ?? defaultCategory))
      maxValue = Math.max(maxValue, Number(row[2]))
      return {
        value: [
          String(row[0]),
          String(row[1] ?? defaultCategory),
          Number(row[2]),
        ],
      }
    })
    keys = Array.from(new Set(keys)).sort()
    categories = Array.from(new Set(categories)).sort()

    return {
      title: {
        text: columnNames[2],
        left: 'center',
        top: 20,
        textStyle: {
          color: '#333',
        },
      },
      tooltip: {},
      visualMap: {
        max: maxValue,
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026',
          ],
        },
      },
      xAxis3D: {
        name: columnNames[0],
        type: 'category',
        data: keys,
      },
      yAxis3D: {
        name: columnNames[1],
        type: 'category',
        data: categories,
      },
      zAxis3D: {
        name: columnNames[2],
        type: 'value',
      },
      grid3D: {
        boxWidth: 200,
        boxDepth: 80,
        light: {
          main: {
            intensity: 1.2,
          },
          ambient: {
            intensity: 0.3,
          },
        },
      },
      series: [
        {
          type: 'bar3D',
          data: source,
          shading: 'color',
          label: {
            show: false,
            textStyle: {
              fontSize: 16,
              borderWidth: 1,
            },
          },
          itemStyle: {
            opacity: 0.7,
          },
          emphasis: {
            label: {
              textStyle: {
                fontSize: 20,
                color: '#900',
              },
            },
            itemStyle: {
              color: '#900',
            },
          },
        },
      ],
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

export default ResultBar3D
