import React, { useState, useCallback, useRef } from 'react'
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
import ResultCategoryStack, { HEIGHT } from './ResultCategoryStack'

import styles from './index.module.less'
import client, { QueryeditorRunResponse } from '@lib/client'
import ReactAce from 'react-ace/lib/ace'
import { getValueFormat } from '@baurine/grafana-value-formats'
import { generateSQL, DEFAULT_CATEGORY } from './generate'

const MAX_DISPLAY_ROWS = 1000

const NEED_SELECT_TABLE_PATTERN = new Set([
  'table_region_peer_count',
  'table_region_leader_count',
])

function App() {
  const [results, setResults] = useState<QueryeditorRunResponse | undefined>()
  const [defaultCategory, setDefaultCategory] = useState<string | undefined>()
  const [isRunning, setRunning] = useState(false)
  const [isHiddenEditor, setHiddenEditor] = useState(true)
  const editor = useRef<ReactAce>(null)
  const { t } = useTranslation()

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
      setDefaultCategory(DEFAULT_CATEGORY[fieldsValue.pattern])
      setResults(resp.data)
    } finally {
      setRunning(false)
    }
    editor.current?.editor.focus()
  }, [])

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
              echarts: undefined,
            }}
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
                        <Select.Option value="sbtest1">sbtest1</Select.Option>
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
              {!isResultsEmpty && (
                <ResultCategoryStack
                  results={results}
                  defaultCategory={defaultCategory}
                />
              )}
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
            <div className={styles.resultCategoryStackContainer}>
              {!isResultsEmpty && (
                <ResultCategoryStack
                  results={results}
                  defaultCategory={defaultCategory}
                />
              )}
            </div>
          </Split>
        )}
      </div>
    </Root>
  )
}

export default App
