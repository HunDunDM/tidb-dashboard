export function generateSQL({ pattern = 'custom', table_name = '' }): string {
  const parts = table_name.split('.')
  let where = "s.table_name = '" + table_name + "'"
  if (parts.length === 2) {
    where =
      "s.db_name = '" + parts[0] + "' AND s.table_name = '" + parts[1] + "'"
  }
  switch (pattern) {
    case 'table_region_peer_count':
      return (
        'SELECT p.STORE_ID, s.INDEX_NAME, COUNT(s.REGION_ID) PEER_COUNT FROM INFORMATION_SCHEMA.TIKV_REGION_STATUS s JOIN INFORMATION_SCHEMA.TIKV_REGION_PEERS p on s.REGION_ID = p.REGION_ID WHERE ' +
        where +
        ' GROUP BY INDEX_NAME, p.STORE_ID ORDER BY INDEX_NAME, PEER_COUNT DESC;'
      )
    case 'table_region_leader_count':
      return (
        'SELECT p.STORE_ID, s.INDEX_NAME, COUNT(s.REGION_ID) LEADER_COUNT FROM INFORMATION_SCHEMA.TIKV_REGION_STATUS s JOIN INFORMATION_SCHEMA.TIKV_REGION_PEERS p ON s.REGION_ID = p.REGION_ID WHERE ' +
        where +
        ' AND p.IS_LEADER = 1 GROUP BY INDEX_NAME, p.STORE_ID ORDER BY INDEX_NAME, LEADER_COUNT DESC;'
      )
    case 'table_region_peer_balance':
      return (
        'SELECT p.STORE_ID, COUNT(s.REGION_ID) PEER_COUNT FROM INFORMATION_SCHEMA.TIKV_REGION_STATUS s JOIN INFORMATION_SCHEMA.TIKV_REGION_PEERS p on s.REGION_ID = p.REGION_ID WHERE ' +
        where +
        ' GROUP BY p.STORE_ID ORDER BY PEER_COUNT DESC;'
      )
    case 'table_region_leader_balance':
      return (
        'SELECT p.STORE_ID, COUNT(s.REGION_ID) LEADER_COUNT FROM INFORMATION_SCHEMA.TIKV_REGION_STATUS s JOIN INFORMATION_SCHEMA.TIKV_REGION_PEERS p ON s.REGION_ID = p.REGION_ID WHERE ' +
        where +
        ' AND p.IS_LEADER = 1 GROUP BY p.STORE_ID ORDER BY LEADER_COUNT DESC;'
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
  table_region_peer_count: 'category_stack',
  table_region_leader_count: 'category_stack',
  table_region_peer_balance: 'pie',
  table_region_leader_balance: 'pie',
}
