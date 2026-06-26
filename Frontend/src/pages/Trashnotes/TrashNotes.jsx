import React from 'react'
import { useState, useEffect } from 'react';
import './TrashNotes.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../component/Search/SearchBar';
import { toast } from 'react-toastify';

const TrashNotes = () => {

    const navigate = useNavigate()
    let [profilepic, setprofilepic] = useState("");
    let [username, setusername] = useState("");
    let [notes, setNotes] = useState([]);
    let [filternotes, setfilternotes] = useState([]);
    let [categoryFilter, setcategoryFilter] = useState('All');
    let [searchText, setsearchText] = useState("");
    let [filterby, setfilterby] = useState("Newest First")

    useEffect(() => {
        if (categoryFilter !== 'All') {
            let ans = []
            if (filterby === 'Newest First') {
                ans = [...notes].sort(
                    (a, b) => new Date(b.DateTime) - new Date(a.DateTime)
                )
            }
            else if (filterby === 'Oldest First') {
                ans = [...notes].sort(
                    (a, b) => new Date(a.DateTime) - new Date(b.DateTime)
                )
            }
            else if (filterby === 'A-Z') {
                ans = [...notes].sort((a, b) =>
                    a.title.localeCompare(b.title)
                )
            }
            else if (filterby === 'Z-A') {
                ans = [...notes].sort((a, b) =>
                    b.title.localeCompare(a.title)
                )
            }

            ans = ans.filter((note) => {
                return categoryFilter == note.category && note.isDeleted === true
            })
            setfilternotes(ans)
        }
        else {
            let ans2 = []
            if (filterby === 'Newest First') {
                ans2 = [...notes].sort(
                    (a, b) => new Date(b.DateTime) - new Date(a.DateTime)
                )
            }
            else if (filterby === 'Oldest First') {
                ans2 = [...notes].sort(
                    (a, b) => new Date(a.DateTime) - new Date(b.DateTime)
                )
            }
            else if (filterby === 'A-Z') {
                ans2 = [...notes].sort((a, b) =>
                    a.title.localeCompare(b.title)
                )
            }
            else if (filterby === 'Z-A') {
                ans2 = [...notes].sort((a, b) =>
                    b.title.localeCompare(a.title)
                )
            }

            ans2 = ans2.filter((note) => {
                return note.isDeleted === true
            })
    
            setfilternotes(ans2)
        }

    }, [categoryFilter,filterby]);


    function shownotes() {
        try {
            axios.get(`/api/notes/showdata`)
                .then((response) => {

                    setNotes(response.data.note)
                    setfilternotes(response.data.note)
                })
                .catch((err) => {
                    toast.error(err);
                })
        } catch (error) {
            console.log("Error throw from show notes: ", error);
        }

    }

    function getprofilepic() {
        axios.get(`/api/user/getpic`, { withCredentials: true })
            .then((response) => {
                setprofilepic(response.data.profilepic);
            })
            .catch((err) => {
                console.log(err);

            })
    }

    useEffect(() => {
        axios.get('/api/user/check-auth')
            .then((e) => {
                console.log("User successfully Login")
                setusername(e.data.userdata.username)
                if (username) {
                    shownotes()
                    getprofilepic()
                }
            })
            .catch((e) => {
                navigate('/Login')
            })

    }, [username]);

    useEffect(() => {
        let timer = setTimeout(() => {
            let query = searchText.toLowerCase().trim();

            let ans = notes.filter(e => {
                return e.title.toLowerCase().includes(query);
            })
            setfilternotes(ans);


        }, 400);

        return () => {
            clearTimeout(timer);
        }


    }, [searchText, notes])


    function restore(id) {

        axios.put(`/api/notes/restore/${id}`)
            .then((e) => {
                if (e.data.success) {
                    shownotes()
                    toast.success(e.data.message, { autoClose: 400 })
                }
                else {
                    toast.error(e.data.message, { autoClose: 400 })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function permanentlyDelete(id) {
        axios.delete(`api/notes/premenentdelete/${id}`)
            .then((e) => {
                if (e.data.success) {
                    toast.success(e.data.message)
                    shownotes()
                }
                else {
                    toast.error(e.data.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function deleteeverynotes() {
        axios.delete(`api/notes/premenentdeleteAll`)
            .then((e) => {
                if (e.data.success) {
                    toast.success(e.data.message)
                    shownotes()
                }
                else {
                    toast.error(e.data.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="trash-page">

            <nav className="trash-navbar">

                <h2>🗑️ Trash Bin</h2>

                <div className="user-box">

                    <span>{username}</span>

                    <img
                        src={`http://localhost:3000/${profilepic}` || `http://10.65.122.219:3000/${profilepic}`}
                        alt="profile"
                    />

                </div>

            </nav>

            <div className="trash-header">
                <div
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Back</span>
                </div>
                <h1>Deleted Notes</h1>
                <p>
                    Restore important notes or permanently remove them.
                </p>
            </div>

            {SearchBar(searchText, setsearchText, categoryFilter, setcategoryFilter, filterby, setfilterby)}


            <div className="category">
                <div className="category-name">
                    <span>Category : </span>{categoryFilter}

                </div>
                <div className="category-name" id='delete-every' onClick={() => {
                    deleteeverynotes()
                }} >
                    <span>Delete Every Note</span>
                </div>
            </div>

            <div className="trash-container">

                {filternotes.map(note => (

                    note.isDeleted === true ? (

                        <div className="trash-card" key={note.id}>

                            <div className="note-heading">
                                <h3>{note.title}</h3>
                                <i className="fa-solid fa-thumbtack" onClick={() => {
                                    toast.warning("Before you must restore note", { autoClose: 400 })
                                }} style={note.isPin ? { backgroundColor: 'red' } : { backgroundColor: 'transparent' }}  ></i>
                            </div>


                            <p>
                                {note.description}
                            </p>

                            <div className="trash-time">
                                {new Date(note.DateTime).toLocaleString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: '2-digit'
                                })}
                            </div>

                            <div className="trash-btns">

                                <button className="restore-btn" onClick={() => {
                                    restore(note.id)
                                }} >
                                    Restore
                                </button>

                                <button className="delete-btn" onClick={() => {
                                    permanentlyDelete(note.id)
                                }} >
                                    Delete Forever
                                </button>

                            </div>

                        </div>
                    ) : null
                )
                )}


            </div>

        </div>
    )
}

export default TrashNotes
