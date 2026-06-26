import { useState } from "react";
import "./ProfilePhoto.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ProfilePhoto() {
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [username, setusername] = useState('');
    const [oldpassword, setoldpassword] = useState('')
    const [newpassword, setnewpassword] = useState('')
    const [Confirmpassword, setConfirmpassword] = useState('')



    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);
            setPhoto(URL.createObjectURL(file));
        }
    };

    const handleSubmitpic = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("profilePic", image);

        axios.post('/api/user/profilepicture', formData)
            .then((e) => {
                toast.success("Image uplode successfully");
                navigate('/dashboard');
            })
            .catch((err) => {
                console.log("Error throw from uploade image : ", err)
            })
    };



    const submitusername = (e) => {
        e.preventDefault();

        axios.put('/api/user/chaneusername', { username })
            .then((e) => {
                setusername('')
                if (e.data.success) {
                    toast.success(e.data.message, { autoClose: 400 });
                    navigate('/dashboard');
                }
                else {
                    toast.warning(e.data.message, { autoClose: 400 })
                }
            })
            .catch((err) => {
                console.log("Error throw from username submmmit")
            })
    }


    const sumbitpassword = (e) => {
        e.preventDefault()
        if (newpassword !== Confirmpassword) {
            return toast.error("Password is not same", { autoClose: 300 })
        }

        axios.put('/api/user/passwordupdate', { oldpassword, newpassword })
            .then((e) => {
                if (e.data.success) {
                    toast.success(e.data.message, { autoClose: 300 })
                    setoldpassword('')
                    setnewpassword('')
                    setConfirmpassword('')
                    navigate('/dashboard')
                }
                else {
                    toast.error(e.data.message, { autoClose: 300 })
                }
            })
            .catch((err) => {
                console.log("Error trow from submit password : ", err)
            })
    }

    return (

        <>
            <div
                className="back-btn"
                style={{position:"absolute",top:20,left:20}}
                onClick={() => navigate(-1)}

            >
                <i className="fa-solid fa-arrow-left"></i>
                <span>Back</span>
            </div>

            <div className="profile-container">

                <div className="profile-card">

                    <h2>My Profile</h2>

                    <div className="profile-image-section">

                        <img
                            src={
                                photo ||
                                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            }
                            alt="Profile"
                        />

                        <label htmlFor="fileInput" className="select-btn">
                            Change Photo
                        </label>

                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />

                        <button
                            className="save-photo-btn"
                            onClick={handleSubmitpic}
                        >
                            Upload Photo
                        </button>

                    </div>

                    <div className="section">

                        <h3>Change Username</h3>

                        <input
                            type="text"
                            placeholder="Enter new username"
                            value={username}
                            onChange={(e) => {
                                setusername(e.target.value)
                            }}
                        />

                        <button className="save-btn" onClick={submitusername} >
                            Update Username
                        </button>

                    </div>

                    <div className="section">

                        <h3>Change Password</h3>

                        <input
                            type="password"
                            placeholder="Current Password"
                            value={oldpassword}
                            onChange={(e) => {
                                setoldpassword(e.target.value)
                            }}
                        />

                        <input
                            type="password"
                            placeholder="New Password"
                            value={newpassword}
                            onChange={(e) => {
                                setnewpassword(e.target.value)
                            }}
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={Confirmpassword}
                            onChange={(e) => {
                                setConfirmpassword(e.target.value)
                            }}

                        />

                        <button className="password-btn" onClick={sumbitpassword} >
                            Update Password
                        </button>

                    </div>

                </div>


            </div>

        </>

    );
}

export default ProfilePhoto;