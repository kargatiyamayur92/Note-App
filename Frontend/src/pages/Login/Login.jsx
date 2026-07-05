import { useEffect, useState, useRef } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate()
  const [otpemail, setotpemail] = useState('');
  const [otp, setotp] = useState('');
  const [newpassword, setnewpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const timerelement = document.querySelector('.forgatepasswordcontainer span');
  const [IsVerify, SetIsVerify] = useState(false);
  const IsVerifyRef = useRef(false)

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
        toast.success("User successfully Login", { autoClose: 400 })
      }
      else {
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

  function otpverify(e) {
    if (!otpemail) {
      return toast.error("Enter Your Email", { autoClose: 300 })
    }
    if (e.target.textContent === 'Get Otp' || e.target.textContent === 'Resend OTP') {
      axios.post('/api/user/sendOTP', { otpemail })
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            document.querySelector('.forgatepasswordcontainer input[type="number"]').style.display = 'flex'
            document.querySelector('.forgatepasswordcontainer button').textContent = "Verify OTP"
            document.querySelector('.forgatepasswordcontainer span').style.display = 'flex';

            let timeRemaining = 30;

            //OTP timer
            let countdown = setInterval(() => {
              let minutes = Math.floor(timeRemaining / 60);
              let seconds = timeRemaining % 60;

              minutes = minutes < 10 ? "0" + minutes : minutes;
              seconds = seconds < 10 ? "0" + seconds : seconds;

              timerelement.textContent = `${minutes}:${seconds}`

              timeRemaining--

              if (IsVerifyRef.current) {
                clearInterval(countdown);
              }

              if (timeRemaining < 0) {
                clearInterval(countdown);
                timerelement.textContent = "OTP was expaired"
                timerelement.style.color = "red";
                document.querySelector('.forgatepasswordcontainer button').textContent = "Resend OTP"
                setotp('')
              }

            }, 1000);


          }
          else {
            toast.error(response.data.message, { autoClose: 300 });
            setotp('')
          }

        })
        .catch((err) => {
          console.log(err)
        })
    } else if (e.target.textContent === 'Verify OTP') {
      axios.post('/api/user/verifyOTP', { otpemail, otp })
        .then((response) => {
          if (response.data.success) {
            SetIsVerify(true)
            IsVerifyRef.current = true

            toast.success(response.data.message, { autoClose: 300 });
            document.querySelector('.forgatepasswordcontainer button').textContent = "Set New Password"
            document.querySelector('.forgatepasswordcontainer input[placeholder="New password"]').style.display = 'flex';
            document.querySelector('.forgatepasswordcontainer input[placeholder="Confirm password"]').style.display = 'flex';
            document.querySelector('.forgatepasswordcontainer span').style.display = 'none';
          }
          else {
            if (response.data.success === false && response.data.message === 'OTP was expaired') {
              document.querySelector('.forgatepasswordcontainer button').textContent = "Get Otp"
              setotp('')
            }
            toast.error(response.data.message, { autoClose: 400 });
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
    else if (e.target.textContent === 'Set New Password') {
      if (newpassword && confirmpassword) {
        if (newpassword !== confirmpassword) {
          setnewpassword('')
          setconfirmpassword('')
          return toast.error("New password and Confirm password are not same", { autoClose: 300 })
        }
      }
      else {
        return toast.error("New password or confirm password is empty")
      }

      axios.post('/api/user/setnewpassword', { otpemail, newpassword, confirmpassword })
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message, { autoClose: 300 });
            document.querySelector('.forgatepasswordcontainer input[type="number"]').style.display = 'none'
            document.querySelector('.forgatepasswordcontainer input[placeholder="New password"]').style.display = 'none';
            document.querySelector('.forgatepasswordcontainer input[placeholder="Confirm password"]').style.display = 'none';
            document.querySelector('.forgatepasswordcontainer').style.display = 'none'
            document.querySelector('.forgatepasswordcontainer button').textContent = "Set New Password"
          }
          else {
            toast.error(response.data.message, { autoClose: 300 });
          }

          setotpemail('')
          setotp('')
          setnewpassword('')
          setconfirmpassword('')

        })
        .catch((err) => {
          console.log("error throw from set password api : ", err);
        })

    }

  }

  return (
    <>
      <div className="container" onClick={() => {
        document.querySelector('.forgatepasswordcontainer').style.display = 'none'
      }}>
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
          <div className="links">
            <p className="register-link">
              Don't have an account? <span onClick={() => {
                navigate('/Register');
              }} >Create account</span>
            </p>
            <small onClick={(e) => {
              e.stopPropagation();
              document.querySelector('.forgatepasswordcontainer').style.display = 'flex';
            }}>Forgate Password</small>
          </div>

        </form>

      </div>
      <div className="forgatepasswordcontainer">
        <input type="text" placeholder="username or email" name="email" value={otpemail} onChange={(e) => {
          setotpemail(e.target.value);
        }} />
        <input type="number" placeholder="Enter OTP" maxLength={6} name="otp" value={otp} onChange={(e) => {
          setotp(e.target.value);
        }} />
        <span>00:00</span>
        <input type="text" placeholder="New password" name="new password" value={newpassword} required onChange={(e) => {
          setnewpassword(e.target.value);
        }} />
        <input type="text" placeholder="Confirm password" name="confirm Password" value={confirmpassword} required onChange={(e) => {
          setconfirmpassword(e.target.value);
        }} />
        <button onClick={otpverify}>Get Otp</button>
      </div>
    </>
  );
}

export default Login;