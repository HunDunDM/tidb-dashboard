import { calcTimeRange } from '@lib/components'
import moment from 'moment'

export function generateSQL({
  pattern = 'custom',
  table_names = new Array<string>(),
  time_range,
}): string {
  let whereSum = '1 = 1'
  if (table_names.length > 0 && NEED_SELECT_TABLE_PATTERN.has(pattern)) {
    whereSum += ' AND (0 = 1'
    table_names.forEach((table_name) => {
      const parts = table_name.split('.')
      let where = "OR s.table_name = '" + table_name + "'"
      if (parts.length === 2) {
        where =
          " OR (s.db_name = '" +
          parts[0] +
          "' AND s.table_name = '" +
          parts[1] +
          "')"
      }
      whereSum += where
    })
    whereSum += ')'
  }
  if (NEED_SELECT_TIME_PATTERN.has(pattern)) {
    const [startTime, endTime] = calcTimeRange(time_range)
    const startTimeStr = moment(new Date(startTime * 1000)).format(
      "'YYYY-MM-DD HH'"
    )
    const endTimeStr = moment(new Date(endTime * 1000)).format(
      "'YYYY-MM-DD HH'"
    )
    whereSum +=
      ' AND (TIME >= ' + startTimeStr + ' AND TIME <= ' + endTimeStr + ')'
  }
  switch (pattern) {
    case 'table_region_peer_count':
      return (
        'SELECT p.STORE_ID, s.INDEX_NAME, COUNT(s.REGION_ID) PEER_COUNT FROM INFORMATION_SCHEMA.TIKV_REGION_STATUS s JOIN INFORMATION_SCHEMA.TIKV_REGION_PEERS p on s.REGION_ID = p.REGION_ID WHERE ' +
        whereSum +
        ' GROUP BY INDEX_NAME, p.STORE_ID ORDER BY INDEX_NAME, PEER_COUNT DESC;'
      )
    case 'table_region_leader_count':
      return (
        'SELECT p.STORE_ID, s.INDEX_NAME, COUNT(s.REGION_ID) LEADER_COUNT FROM INFORMATION_SCHEMA.TIKV_REGION_STATUS s JOIN INFORMATION_SCHEMA.TIKV_REGION_PEERS p ON s.REGION_ID = p.REGION_ID WHERE ' +
        whereSum +
        ' AND p.IS_LEADER = 1 GROUP BY INDEX_NAME, p.STORE_ID ORDER BY INDEX_NAME, LEADER_COUNT DESC;'
      )
    case 'table_region_peer_balance':
      return (
        'SELECT p.STORE_ID, COUNT(s.REGION_ID) PEER_COUNT FROM INFORMATION_SCHEMA.TIKV_REGION_STATUS s JOIN INFORMATION_SCHEMA.TIKV_REGION_PEERS p on s.REGION_ID = p.REGION_ID WHERE ' +
        whereSum +
        ' GROUP BY p.STORE_ID ORDER BY PEER_COUNT DESC;'
      )
    case 'table_region_leader_balance':
      return (
        'SELECT p.STORE_ID, COUNT(s.REGION_ID) LEADER_COUNT FROM INFORMATION_SCHEMA.TIKV_REGION_STATUS s JOIN INFORMATION_SCHEMA.TIKV_REGION_PEERS p ON s.REGION_ID = p.REGION_ID WHERE ' +
        whereSum +
        ' AND p.IS_LEADER = 1 GROUP BY p.STORE_ID ORDER BY LEADER_COUNT DESC;'
      )
    case 'table_slow_log_count':
      return (
        "SELECT DATE_FORMAT(time, '%Y-%m-%d %H') TIME_HOUR, COUNT(1) LOG_COUNT FROM INFORMATION_SCHEMA.CLUSTER_LOG WHERE " +
        "MESSAGE LIKE '%' AND " +
        whereSum +
        ' GROUP BY TIME_HOUR;'
      )
    case 'table_hot_region_bytes':
      return (
        'SELECT TABLE_NAME, TYPE, SUM(FLOW_BYTES) SUM_FLOW_BYTES FROM INFORMATION_SCHEMA.TIDB_HOT_REGIONS WHERE ' +
        whereSum +
        " AND MAX_HOT_DEGREE > 2 AND TABLE_NAME != 'mysql' GROUP BY TABLE_NAME, TYPE ORDER BY SUM_FLOW_BYTES DESC;"
      )
    default:
      return ''
  }
}

export const DEFAULT_CATEGORY = {
  table_region_peer_count: 'row',
  table_region_leader_count: 'row',
}

export const DEFAULT_ECHARTS = {
  table_region_peer_count: 'bar3d',
  table_region_leader_count: 'category_stack',
  table_region_peer_balance: 'pie',
  table_region_leader_balance: 'pie',
  table_slow_log_count: 'area_line',
  table_hot_region_bytes: 'category_stack',
}

export const NEED_SELECT_TABLE_PATTERN = new Set([
  'table_region_peer_count',
  'table_region_leader_count',
  'table_region_peer_balance',
  'table_region_leader_balance',
  'table_slow_log_count',
  'table_hot_region_bytes',
])

export const NEED_SELECT_TIME_PATTERN = new Set(['table_slow_log_count'])
