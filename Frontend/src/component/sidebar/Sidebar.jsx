import { useEffect, useState } from "react";
import "./Sidebar.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardStats from "../../pages/Dashboard/Dashboard";

function Sidebar(props) {

  console.log(props)
 
  const navigate = useNavigate();

  const [emailID, setemailID] = useState('');
  const [username, setUsername] = useState('');
  const [userID, setuserID] = useState('');


  useEffect(() => {
    axios.get('/api/user/check-auth')
      .then((e) => {
        setUsername(e.data.userdata.username);
        setuserID(e.data.userdata.id);
        setemailID(e.data.userdata.email);
      })
      .catch((err) => {
        toast.error(error)
      })
  })

  function LogoutUser() {
    axios.post(`/api/user/logout`)
      .then(() => {
        navigate('/');
        toast.success("Logout successfully", { autoClose: 1000 })
      })
      .catch((err) => {
        toast.error(err)
      })
  }


  return (
    <div className="sidebar" onClick={() => {

      if (props.sidebarData.ISrenderSidebar) {
        props.sidebarData.setISrenderSidebar(false)
        props.sidebarData.setdashboardWidth('100vw')
      }
      else {
        props.sidebarData.setISrenderSidebar(true)
        props.sidebarData.setdashboardWidth('84vw')
      }

    }} >

      <div className="profile">

        <img
          src={`http://localhost:3000/${props.sidebarData.profilepic}`}
          alt="profile"
          onClick={() => {
            navigate('/profilePicture');
            toast.info("Uplode you new profile ", { autoClose: 300 })
          }}
        />

        <h3>{username}</h3>

        <p style={{ marginTop: '1.2rem' }} >{emailID}</p>


      </div>

      <div className="menu">

        <div className="menu-item" onClick={() => {
          navigate('/dashboardStatus')
        }} >
          🏠 Dashboard
        </div>

        <div className="menu-item" onClick={() => {
          navigate('/TrashNotes')
        }} >
          🗑️ Trash Bin
        </div>

        <div className="menu-item">
          ⚙️ Settings
        </div>

        <div className="menu-item">
          ❓ Help
        </div>

      </div>

      <button className="logout-btn" onClick={LogoutUser} >
        🚪 Logout
      </button>

    </div>
  );
}

export default Sidebar;