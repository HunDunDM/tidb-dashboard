import { LineChartOutlined } from '@ant-design/icons'

export default {
  id: 'queryviz',
  routerPrefix: '/queryviz',
  icon: LineChartOutlined,
  translations: require.context('./translations/', false, /\.yaml$/),
  reactRoot: () => import(/* webpackChunkName: "queryviz" */ '.'),
}
