import { useState } from "react";
import "./Registration.css";
import axios from 'axios'
import { toast } from "react-toastify";

function Registration() {
  const [formData, setFormData] = useState(
    {
      fullname: "",
      email: "",
      mobileno: "",
      password: "",
      confirmpassword: "",
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      toast.error("Passwords do not match!")
      return;
    }




    try {
      let response = await axios.post('/api/user/register', formData)

      setFormData(
        {
          fullname: "",
          email: "",
          mobileno: "",
          password: "",
          confirmpassword: "",
        }
      )

      if (response.data.success) toast.success(response.data.message)
      else toast.error(response.data.message)

    }
    catch (error) {
      toast.error(error)
    }

  }

  return (
    <>
      <div className="container">
        <form className="register-form" onSubmit={handleSubmit} method="post">
          <h2>Registration</h2>

          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="mobileno"
            placeholder="Mobile Number"
            value={formData.mobileno}
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

          <input
            type="password"
            name="confirmpassword"
            placeholder="Confirm Password"
            value={formData.confirmpassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
}

export default Registration;