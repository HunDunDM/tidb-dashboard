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
        'select p.store_id, s.index_name, count(s.region_id) cnt from INFORMATION_SCHEMA.TIKV_REGION_STATUS s join INFORMATION_SCHEMA.tikv_region_peers p on s.region_id = p.region_id where ' +
        where +
        ' group by index_name, p.store_id order by index_name,cnt desc;'
      )
    case 'table_region_leader_count':
      return (
        'select p.store_id, s.index_name, count(s.region_id) cnt from INFORMATION_SCHEMA.TIKV_REGION_STATUS s join INFORMATION_SCHEMA.tikv_region_peers p on s.region_id = p.region_id where ' +
        where +
        ' and p.is_leader = 1 group by index_name, p.store_id order by index_name,cnt desc;'
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
}
