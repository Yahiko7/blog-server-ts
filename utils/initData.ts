import config from '../config'
import UserController from '../controllers/UserController'
// const ArticleController = require('../controllers/article')
import UserService from '../services/UserService'
/**
 * init Data
 */

export default () => {
  
  (new UserController(new UserService())).initGithubUser(config.ADMIN_GITHUB_LOGIN_NAME) // 创建 role === 1 的账号 from github...
  // ArticleController.initAboutPage()
}