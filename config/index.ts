const config = {
  port: 8800,
  auth_default_password: '123456',
  ADMIN_GITHUB_LOGIN_NAME: 'yahiko7', // 博主的 github 登录的账户名 user
  dbUrl: `mongodb://localhost/blog`,
  GITHUB: {
    client_id: 'c6a96a84105bb0be1fe5',
    client_secret: '463f3994ab5687544b2cddbb6cf44920bf179ad9',
    access_token_url: 'https://github.com/login/oauth/access_token',
    fetch_user_url: 'https://api.github.com/user', // 用于 oauth2
    fetch_user: 'https://api.github.com/users/' // fetch user url https://api.github.com/users/gershonv
  },
  authorization: {
    tokenKey: "yahiko7",
    expiresIn: '36000s'
  }
  
}

export default config

