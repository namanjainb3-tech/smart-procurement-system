import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = ({ setUser }) => {
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        google_id: result.user.uid,
      };

      await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.log("Login Error:", err.message);
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="p-5 rounded-4 shadow-lg text-center"
        style={{
          width: "100%",
          maxWidth: "520px",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.82))",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.35)",
        }}
      >
        {/* Logo */}
        <div
          className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: "82px",
            height: "82px",
            background:
              "linear-gradient(135deg,#2563eb,#4f46e5,#7c3aed)",
            fontSize: "34px",
            color: "white",
            boxShadow: "0 15px 35px rgba(79,70,229,.28)",
          }}
        >
          🛒
        </div>

        {/* Title */}
        <h1
          className="fw-bold mb-2"
          style={{
            fontSize: "2.2rem",
            color: "#111827",
          }}
        >
          Smart Procurement
        </h1>

        <p
          className="mb-4"
          style={{
            color: "#6b7280",
            fontSize: "1.05rem",
            lineHeight: "1.6",
          }}
        >
          Compare prices instantly, upload grocery lists,
          track deals & receive smart alerts.
        </p>

        {/* Features */}
        <div className="row g-2 mb-4 text-start">
          <div className="col-6">
            <div className="p-2 rounded-3 bg-light small fw-semibold">
              ⚡ Live Price Tracking
            </div>
          </div>

          <div className="col-6">
            <div className="p-2 rounded-3 bg-light small fw-semibold">
              📂 Excel Upload
            </div>
          </div>

          <div className="col-6">
            <div className="p-2 rounded-3 bg-light small fw-semibold">
              📉 Price Alerts
            </div>
          </div>

          <div className="col-6">
            <div className="p-2 rounded-3 bg-light small fw-semibold">
              🧠 Best Platform
            </div>
          </div>
        </div>

        {/* Google Button */}
        <button
          onClick={login}
          className="btn w-100 py-3 fw-semibold rounded-pill"
          style={{
            background:
              "linear-gradient(90deg,#2563eb,#4f46e5,#7c3aed)",
            color: "white",
            border: "none",
            fontSize: "1rem",
            boxShadow: "0 10px 25px rgba(79,70,229,.25)",
          }}
        >
          Continue with Google →
        </button>

        {/* Footer */}
        <p
          className="mt-4 mb-0 small"
          style={{ color: "#9ca3af" }}
        >
          Secure login powered by Google Authentication
        </p>
      </div>
    </div>
  );
};

export default Login;