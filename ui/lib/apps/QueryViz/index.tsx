import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Root, Card } from '@lib/components'
import Split from 'react-split'
import { Button, Typography, Form, Select } from 'antd'
import {
  CaretRightOutlined,
  LoadingOutlined,
  WarningOutlined,
  CheckOutlined,
} from '@ant-design/icons'

import Editor from './Editor'
import ResultCategoryStack from './ResultCategoryStack'
import ResultBar from './ResultBar'
import ResultAreaLine from './ResultAreaLine'

import styles from './index.module.less'
import client, { QueryeditorRunResponse } from '@lib/client'
import ReactAce from 'react-ace/lib/ace'
import { getValueFormat } from '@baurine/grafana-value-formats'
import { generateSQL, DEFAULT_CATEGORY, DEFAULT_ECHARTS } from './generate'

const MAX_DISPLAY_ROWS = 10000

const HEIGHT = 480

const NEED_SELECT_TABLE_PATTERN = new Set([
  'table_region_peer_count',
  'table_region_leader_count',
])

function App() {
  const [results, setResults] = useState<QueryeditorRunResponse | undefined>()
  const [echartsType, setEchartsType] = useState<string | undefined>()
  const [defaultCategory, setDefaultCategory] = useState<string | undefined>()
  const [isRunning, setRunning] = useState(false)
  const [isHiddenEditor, setHiddenEditor] = useState(true)
  const [tables, setTables] = useState<string[]>([])
  const editor = useRef<ReactAce>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const getTables = async () => {
      const resp = await client.getInstance().queryEditorRun({
        max_rows: MAX_DISPLAY_ROWS,
        statements:
          "select table_schema, table_name from information_schema.tables where table_type='BASE TABLE';",
      })
      const data = resp.data.rows ?? []
      const tables = data
        .filter((row) => String(row[0]) !== 'mysql')
        .map((row) => String(row[0]) + '.' + String(row[1]))
      setTables(tables.sort())
    }
    getTables().then()
  }, [])

  const isResultsEmpty =
    !results ||
    (!results.error_msg && (!results.column_names?.length || !results.rows))

  const handleRun = useCallback(async (fieldsValue) => {
    try {
      setRunning(true)
      setResults(undefined)
      let statements = editor.current?.editor.getValue()
      if (fieldsValue.pattern !== 'custom') {
        statements = generateSQL(fieldsValue)
      }
      const resp = await client.getInstance().queryEditorRun({
        max_rows: MAX_DISPLAY_ROWS,
        statements: statements,
      })

      setEchartsType(
        fieldsValue.pattern !== 'custom'
          ? DEFAULT_ECHARTS[fieldsValue.pattern]
          : fieldsValue.echarts
      )
      setDefaultCategory(DEFAULT_CATEGORY[fieldsValue.pattern])
      setResults(resp.data)
    } finally {
      setRunning(false)
    }
    editor.current?.editor.focus()
  }, [])

  let Result
  switch (echartsType) {
    case 'category_stack':
      Result = (
        <ResultCategoryStack
          results={results}
          defaultCategory={defaultCategory}
          height={HEIGHT}
        />
      )
      break
    case 'bar':
      Result = <ResultBar results={results} height={HEIGHT} />
      break
    case 'area_line':
      Result = <ResultAreaLine results={results} height={HEIGHT} />
      break
    default:
      Result = null
  }
  Result = !isResultsEmpty && Result

  return (
    <Root>
      <div className={styles.container}>
        <Card>
          <Form
            onFinish={handleRun}
            layout="inline"
            initialValues={{
              pattern: 'table_region_peer_count',
              table_name: undefined,
              echarts: 'category_stack',
            }}
            onValuesChange={(_, allValues) =>
              setHiddenEditor(allValues?.pattern !== 'custom')
            }
          >
            <Form.Item
              name="pattern"
              label={t('queryviz.pattern.select')}
              rules={[{ required: true }]}
            >
              <Select style={{ width: 240 }}>
                {[
                  'table_region_peer_count',
                  'table_region_leader_count',
                  'custom',
                ].map((value) => (
                  <Select.Option value={value} key={value}>
                    {t('queryviz.pattern.' + value)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev, cur) => prev.pattern !== cur.pattern}
            >
              {({ getFieldValue }) => {
                return (
                  NEED_SELECT_TABLE_PATTERN.has(getFieldValue('pattern')) && (
                    <Form.Item
                      name="table_name"
                      label={t('queryviz.table.select')}
                      rules={[{ required: true }]}
                    >
                      <Select style={{ width: 300 }}>
                        {tables.map((name) => (
                          <Select.Option key={name} value={name}>
                            {name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )
                )
              }}
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev, cur) => prev.pattern !== cur.pattern}
            >
              {({ getFieldValue }) => {
                return (
                  getFieldValue('pattern') === 'custom' && (
                    <Form.Item
                      name="echarts"
                      label={t('queryviz.echarts.select')}
                      rules={[{ required: true }]}
                    >
                      <Select style={{ width: 300 }}>
                        {['bar', 'area_line', 'category_stack'].map((name) => (
                          <Select.Option key={name} value={name}>
                            {t('queryviz.echarts.' + name)}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )
                )
              }}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CaretRightOutlined />}
                onClick={handleRun}
                loading={isRunning}
              >
                {t('queryviz.run')}
              </Button>
            </Form.Item>
            <Form.Item>
              <span>
                {isRunning && <LoadingOutlined spin />}
                {results && results.error_msg && (
                  <Typography.Text type="danger">
                    <WarningOutlined /> Error (
                    {getValueFormat('ms')(results.execution_ms || 0, 1)})
                  </Typography.Text>
                )}
                {results && !results.error_msg && (
                  <Typography.Text className={styles.successText}>
                    <CheckOutlined /> Success (
                    {getValueFormat('ms')(results.execution_ms || 0, 1)},
                    {(results.actual_rows || 0) > (results.rows?.length || 0)
                      ? `Displaying first ${results.rows?.length || 0} of ${
                          results.actual_rows || 0
                        } rows`
                      : `${results.rows?.length || 0} rows`}
                    )
                  </Typography.Text>
                )}
              </span>
            </Form.Item>
          </Form>
        </Card>
        {isHiddenEditor ? (
          <div className={styles.contentContainer}>
            <div
              className={styles.resultCategoryStackContainer}
              style={{ height: HEIGHT }}
            >
              {Result}
            </div>
          </div>
        ) : (
          <Split
            direction="vertical"
            dragInterval={30}
            className={cx(styles.contentContainer, {
              [styles.isCollapsed]: isResultsEmpty,
            })}
            sizes={isResultsEmpty ? [100, 0] : [20, 80]}
            minSize={isResultsEmpty ? 0 : 100}
            expandToMin={false}
          >
            <Card noMarginTop noMarginBottom={!isResultsEmpty} flexGrow>
              <Editor focus ref={editor} />
            </Card>
            <div className={styles.resultCategoryStackContainer}>{Result}</div>
          </Split>
        )}
      </div>
    </Root>
  )
}

export default App
