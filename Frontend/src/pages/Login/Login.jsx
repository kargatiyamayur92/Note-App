import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response = await axios.post('/api/user/login', formData);

      if (response.data.success) {
        navigate('/dashboard')
        toast.success("User successfully Login", {autoClose:400})
      }
      else{
        toast.error("Something went wrong");
      }

      setFormData(
        {
          emailOrUsername: "",
          password: "",
        }
      )
    } catch (error) {
      alert(`${error}`);
    }


  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleSubmit} method="post" >
        <h2>Login</h2>

        <input
          type="text"
          name="emailOrUsername"
          placeholder="Email or Username"
          value={formData.emailOrUsername}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <p className="register-link">
          Don't have an account? <span onClick={() => {
            navigate('/Register');
          }} >Create account</span>
        </p>
      </form>
    </div>
  );
}

export default Login;