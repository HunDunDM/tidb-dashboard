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

interface IResultPieProps {
  results?: QueryeditorRunResponse
  height: number
}

function ResultPie({ results, height }: IResultPieProps) {
  const opt = useMemo(() => {
    if (!results) {
      return null
    }

    const columnNames = results.column_names ?? []
    if (columnNames.length !== 2) {
      return null
    }

    const data = results.rows ?? []
    const source = data
      .map((row) => ({
        name: String(row[0]),
        value: Number(row[1]),
      }))
      .sort(function (a, b) {
        return a.value - b.value
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
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      visualMap: {
        show: false,
        min: 80,
        max: height,
        inRange: {
          colorLightness: [0, 1],
        },
      },
      series: [
        {
          name: columnNames[0],
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: source,
          roseType: 'radius',
          label: {
            color: 'rgba(0, 0, 0)',
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0)',
            },
            smooth: 0.2,
            length: 10,
            length2: 20,
          },
          itemStyle: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200
          },
        },
      ],
    }
  }, [results, height])

  return (
    <div className={styles.result}>
      <ScrollablePane>
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

export default ResultPie
