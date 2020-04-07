export const GITHUB ={
  client_id: 'yyy',
  client_secret: 'xxx',
  access_token_url: 'https://github.com/login/oauth/access_token',
  fetch_user_url: 'https://api.github.com/user', // 用于 oauth2
  fetch_user: 'https://api.github.com/users/' // fetch user url https://api.github.com/users/gershonv
}
export default {
  port: 8800,
  auth_default_password: '123456',
  ADMIN_GITHUB_LOGIN_NAME: 'Yahiko7', // 博主的 github 登录的账户名 user
  dbUrl: `mongodb://localhost/blog`,
  authorization: {
    tokenKey: "yahiko7",
    expiresIn: '36000s'
  },
  TOKEN: {
    secret: 'guo-test', // secret is very important!
    expiresIn: '720h' // token 有效期
  },
  
}

