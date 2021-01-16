import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

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
    const data2 = data.map((row) => ({
      name: String(row[0]),
      value: Number(row[1]),
    }))

    return {
      title: {
        text: 'Customized Pie',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc',
        },
      },

      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },

      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1],
        },
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 274, name: '联盟广告' },
            { value: 235, name: '视频广告' },
            { value: 400, name: '搜索引擎' },
          ].sort(function (a, b) {
            return a.value - b.value
          }),
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 0.3)',
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)',
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
  }, [results])

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
