import Footer from "../../component/Footer/Footer";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


function Home() {
    const navigate = useNavigate();

    /* Theam mode Dark & light */
    let [theme, setTheme] = useState(localStorage.getItem("theamMode"));


    useEffect(() => {
        // document.body.className = theme
        document.body.setAttribute('data-theme', theme)
        localStorage.setItem('theamMode', theme)
    }, [theme])


    function theamMode() {
        if (theme) {
            if (theme == 'light') {
                localStorage.setItem('theamMode', 'dark')
                setTheme('dark')
            }
            else {
                localStorage.setItem('theamMode', 'light')
                setTheme('light')
            }
        }
        else {
            localStorage.setItem('theamMode', 'dark')
            setTheme('dark')
        }
    }



    return (
        <div className="home">

            <nav className="navbar">
                <h2>NoteFlow +</h2>

                <div className="nav-links">
                    <select name="" id="" onChange={(e) => {
                        setTheme(e.target.value);
                    }} >
                        <option value="" aria-readonly style={{color:'#fafafa81'}}>Select Theam</option>
                        <option value="dark">Dark</option>
                        <option value="emerald">Emerald</option>
                        <option value="light">Light</option>
                        <option value="ocean">Ocean</option>
                        <option value="purple">Purple</option>
                        <option value="sunset">Sunset</option>
                    </select>

                    <i className="fa-solid fa-moon" onClick={() => {
                        theamMode()
                    }} ></i>
                    <button className="login-btn" onClick={() => {
                        navigate('/Login');
                    }} >Login</button>
                    <button className="register-btn" onClick={() => {
                        navigate('/Register')
                    }} >Register</button>
                </div>
            </nav>

            <section className="hero">

                <div className="left">
                    <h1>
                        Organize Your Notes
                        <span> Anywhere</span>
                    </h1>

                    <p>
                        Create, edit and manage your notes easily.
                        Access them anytime from anywhere.
                    </p>

                    <button className="start-btn" onClick={() => {
                        navigate('/dashboard')
                    }} >
                        Get Started
                    </button>
                </div>

                <div className="right">

                    <div className="note-card card1">
                        📚 Study Notes
                    </div>

                    <div className="note-card card2">
                        📝 Project Ideas
                    </div>

                    <div className="note-card card3">
                        🚀 Daily Tasks
                    </div>

                </div>

            </section>

            <Footer></Footer>

        </div>
    );
}

export default Home;