'use strict';
import getGithub from './getGithub'

export default app => {
  app.use(getGithub)
}