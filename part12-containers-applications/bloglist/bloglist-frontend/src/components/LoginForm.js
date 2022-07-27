import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, username, password, handleUsernameChange, handlePasswordChange }) => (
  <form onSubmit={handleLogin}>
    <div>
        Username:
      <input
        id='username'
        type="text"
        value={username}
        name="Username"
        onChange={handleUsernameChange}
      />
    </div>
    <div>
        Password:
      <input
        id='password'
        type="password"
        value={password}
        name="Password"
        onChange={handlePasswordChange}
      />
    </div>
    <button id='login-button' type="submit">Login</button>
  </form>
)

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired
}

export default LoginForm