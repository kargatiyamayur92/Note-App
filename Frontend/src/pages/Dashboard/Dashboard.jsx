import { useEffect, useState } from "react";
import "./DashboardStats.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "../../component/chartAnalysis/Chart";


function DashboardStats() {

    let navigate = useNavigate()

    let [mostusedcategory, setmostusedcategory] = useState("");
    let [notes, setnotes] = useState([])
    let [dashboardStatusdata, setdashboardStatusdata] = useState(
        {
            total: 0,
            pin: 0,
            study: 0,
            work: 0,
            ideas: 0,
            personal: 0,
        }
    )

    useEffect(() => {
        axios.get('/api/notes/showdata')
            .then((e) => {
                console.log(e.data.note)
                setnotes(e.data.note)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])


    useEffect(() => {
        setdashboardStatusdata(
            {
                total: notes.length,
                pin: notes.filter(note => note.isPin === true).length,
                study: notes.filter(note => note.category === 'Study').length,
                work: notes.filter(note => note.category === 'Work').length,
                ideas: notes.filter(note => note.category === 'Ideas').length,
                personal: notes.filter(note => note.category === 'Personal').length,
            }
        )
    }, [notes])


    useEffect(() => {

        if (dashboardStatusdata.study > dashboardStatusdata.work &&
            dashboardStatusdata.study > dashboardStatusdata.ideas &&
            dashboardStatusdata.study > dashboardStatusdata.personal
        ) {
            setmostusedcategory("Study")
        }
        else if (dashboardStatusdata.work > dashboardStatusdata.study &&
            dashboardStatusdata.work > dashboardStatusdata.ideas &&
            dashboardStatusdata.work > dashboardStatusdata.personal
        ) {
            setmostusedcategory("Work")
        }
        else if (dashboardStatusdata.ideas > dashboardStatusdata.study &&
            dashboardStatusdata.ideas > dashboardStatusdata.work &&
            dashboardStatusdata.ideas > dashboardStatusdata.personal
        ) {
            setmostusedcategory("Ideas")
        }
        else if (dashboardStatusdata.personal > dashboardStatusdata.study &&
            dashboardStatusdata.personal > dashboardStatusdata.ideas &&
            dashboardStatusdata.personal > dashboardStatusdata.work
        ) {
            setmostusedcategory("Personal")
        }

    }, [dashboardStatusdata])

    return (
        <div className="stats-page">

            <div className="stats-header">
                <div
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Back</span>
                </div>
                <h1>📊 Dashboard Analytics</h1>
                <p>Track your notes activity and productivity</p>
            </div>

            <div className="stats-grid">

                <div className="stat-card">
                    <h3>Total Notes</h3>
                    <span>{dashboardStatusdata.total}</span>
                </div>

                <div className="stat-card">
                    <h3>Pinned Notes</h3>
                    <span>{dashboardStatusdata.pin}</span>
                </div>

                <div className="stat-card">
                    <h3>Study Notes</h3>
                    <span>{dashboardStatusdata.study}</span>
                </div>

                <div className="stat-card">
                    <h3>Work Notes</h3>
                    <span>{dashboardStatusdata.work}</span>
                </div>

                <div className="stat-card">
                    <h3>Personal Notes</h3>
                    <span>{dashboardStatusdata.personal}</span>
                </div>

                <div className="stat-card">
                    <h3>Ideas</h3>
                    <span>{dashboardStatusdata.ideas}</span>
                </div>

            </div>

            <div className="charts-container">
                <Chart data={[
                    {
                        name: "Study",
                        value: dashboardStatusdata.study,
                        default: 0,
                    },
                    {
                        name: "Work",
                        value: dashboardStatusdata.work,
                        default: 0,
                    },
                    {
                        name: "Personal",
                        value: dashboardStatusdata.personal,
                        default: 0,
                    },
                    {
                        name: "Ideas",
                        value: dashboardStatusdata.ideas,
                        default: 0,
                    }
                ]} />
                <Chart data={[
                    {
                        name: "Pinned",
                        value: dashboardStatusdata.pin,
                        default: 0,
                    },
                    {
                        name: "UnPinned",
                        value: dashboardStatusdata.total - dashboardStatusdata.pin,
                        default: 0,
                    }

                ]} />
                <Chart data={[
                    {
                        name: "Total",
                        value: dashboardStatusdata.total,
                        default: 0,
                    }

                ]} />

            </div>




            <div className="recent-section">

                <h2>📌 Quick Overview</h2>

                <div className="overview-card">
                    <p>
                        You have created <b>{dashboardStatusdata.total} Notes</b> and pinned
                        <b> {dashboardStatusdata.pin} important notes</b>.
                    </p>

                    <p>
                        Most used category:
                        <b> {mostusedcategory} Notes </b>
                    </p>
                </div>

            </div>

        </div>
    );
}

export default DashboardStats;