import { resolve } from "path";
import { Route } from "../decorator/router";





export const router = app => {
  const apiPath = resolve(__dirname,'../routes')
  const router = new Route(app, apiPath)



  router.init()
} 