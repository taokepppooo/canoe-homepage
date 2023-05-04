import { basicRoutes } from './basic'

const routes = [basicRoutes]

const routeList: string[] = []
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRouteNames = (array: any[]) =>
  array.forEach((item) => {
    routeList.push(item.name)
    getRouteNames(item.children || [])
  })

getRouteNames(routes)

export { routes, routeList }
