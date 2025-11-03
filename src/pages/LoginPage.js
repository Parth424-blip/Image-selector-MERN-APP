export default function LoginPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <p>Click below to login with:</p>
      <a href="http://localhost:5000/auth/google" style={{ margin: "10px" }}>
        <button>Google</button>
      </a>
      <a href="http://localhost:5000/auth/facebook" style={{ margin: "10px" }}>
        <button>Facebook</button>
      </a>
      <a href="http://localhost:5000/auth/github" style={{ margin: "10px" }}>
        <button>GitHub</button>
      </a>
    </div>
  );
}
