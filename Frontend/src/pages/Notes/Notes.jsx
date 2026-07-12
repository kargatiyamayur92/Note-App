import { useState } from "react";
import "./Notes.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import Sidebar from "../../component/sidebar/Sidebar";
import { toast } from 'react-toastify';
import SearchBar from "../../component/Search/SearchBar";
import { TiPinOutline } from "react-icons/ti";
import { jsPDF } from 'jspdf'



function Notes() {


  let [profilepic, setprofilepic] = useState("");
  let [username, setusername] = useState("");

  let [ISrenderSidebar, setISrenderSidebar] = useState(false)
  let [dashboardWidh, setdashboardWidth] = useState('100vw');
  let [submitbtnName, setsubmitbtnName] = useState('Add Note');
  let [editenoteid, seteditenoteid] = useState('');
  let [category, setcategory] = useState('Personal');
  let [categoryFilter, setcategoryFilter] = useState('All');
  let [filterby, setfilterby] = useState("Newest First")
  let [notes, setNotes] = useState([]);
  let [bgcolor, setbgcolor] = useState('');
  const navigate = useNavigate();

  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");




  /* Theam mode Dark & light */
  const [theme, setTheme] = useState(localStorage.getItem("theamMode"));

  useEffect(() => {
    //document.body.className = theme
      document.body.setAttribute('data-theme',theme)
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


  /* Pin note logic */

  function pinNote(id) {

    axios.put(`/api/notes/pin/${id}`, { isPin: true })
      .then((e) => {
        shownotes()
        if (e.data.success) {
          toast.success(e.data.message, { autoClose: 300 })
        }
        else {
          toast.error(e.data.message, { autoClose: 300 })
        }
      })
      .catch((err) => {
        console.log(err)
      })

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


  /* Search feature impliment */

  let [searchText, setsearchText] = useState("");
  let [filternotes, setfilternotes] = useState([]);

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
        return categoryFilter == note.category && note.isDeleted === false
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
        return note.isDeleted === false
      })
      setfilternotes(ans2)
    }

  }, [categoryFilter, filterby]);

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


  function shownotes() {
    try {
      axios.get(`/api/notes/showdata`)
        .then((response) => {
          console.log(response.data);
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
      .catch(() => {
        navigate('/Login');
      })

  }, [username]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if(title === '' || description === ''){
      return toast.error("Enter Title & Description",{autoClose:500})
    }
    if (submitbtnName === "Add Note") {
      try {
        let response = await axios.post('/api/notes/createNote', { title, description, category, bgcolor });

        if (response.data.success) toast.success(response.data.message, { autoClose: 300 })
        else toast.error(response.data.message)

        setTitle("")
        setDescription("")
        setcategory('')
        setbgcolor('')
        shownotes()


      } catch (error) {
        console.log("note data adding FAILD : ", error);
      }
    }
    else {
      try {
        let response = await axios.put(`/api/notes/editeNote/${editenoteid}`, { title, description, category, bgcolor })

        if (response.data.success) toast.success(response.data.message, { autoClose: 300 })
        else toast.error(response.data.message)

        setTitle("")
        setDescription("")
        setsubmitbtnName("Add Note")
        shownotes();
      } catch (error) {
        console.log("note data edite FAILD : ", error);
      }
    }

  };


  function editNote(id) {
    let editenote = notes.find(e => {
      return e.id === id
    })
    setTitle(editenote.title)
    setDescription(editenote.description)
    setsubmitbtnName("Edit Note")

  }

  function deleteNote(id) {

    axios.post(`/api/notes/deletenote/${id}`)
      .then((e) => {
        toast.info(e.data.message, { autoClose: 1000, });
        shownotes()
      })
      .catch((err) => {
        toast.error(e.data.message)
      })
  }

  const generatePDF = () => {

    const pdf = new jsPDF();

    let y = 20;

    // Header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(40, 40, 40);
    pdf.text("My Notes", 75, 15);

    filternotes.forEach((note) => {

      if (!note.isDeleted) {

        // New Page
        if (y > 230) {
          pdf.addPage();
          y = 20;
        }

        // Convert Hex -> RGB
        const hex = (note.color || "#0f172a").replace("#", "");

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        /* Card */

        pdf.setFillColor(250, 250, 250);
        pdf.setDrawColor(220, 220, 220);

        pdf.roundedRect(
          15,
          y,
          180,
          65,
          6,
          6,
          "FD"
        );

        /* Top Color Strip */

        pdf.setFillColor(r, g, b);

        pdf.roundedRect(
          15,
          y,
          180,
          8,
          6,
          6,
          "F"
        );

        /* Title */

        pdf.setTextColor(30, 30, 30);

        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");

        pdf.text(note.title, 22, y + 18);

        /* Description */

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");

        const description = pdf.splitTextToSize(
          note.description,
          165
        );

        pdf.text(description, 22, y + 28);

        /* Footer Line */

        pdf.setDrawColor(230, 230, 230);

        pdf.line(
          20,
          y + 53,
          190,
          y + 53
        );

        /* Category */

        pdf.setFontSize(10);

        pdf.setFont("helvetica", "bold");

        pdf.text(
          `Category : ${note.category}`,
          22,
          y + 60
        );

        /* Date */

        pdf.setFont("helvetica", "normal");

        pdf.text(
          new Date(note.DateTime).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }
          ),
          150,
          y + 60
        );

        y += 75;

      }
    });

    pdf.save("MyNotes.pdf");

  }

  if (ISrenderSidebar) {
    return (
      <>


        <Sidebar sidebarData={{ profilepic, ISrenderSidebar, setISrenderSidebar, setdashboardWidth }} />

        < div className="dashboard" style={{ width: `${dashboardWidh}` }} >


          {/* Navbar */}

          < nav className="navbar" >

            <h2>NoteFlow</h2>

            <div className="user-box">

              <select name="" id="" onChange={(e) => {
                setTheme(e.target.value);
              }} >
                <option value="" aria-readonly style={{ color: '#fafafa81' }}>Select Theam</option>
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
              <span>{username}</span>

              <img
                src={`http://localhost:3000/${profilepic}` || `http://10.65.122.219:3000/${profilepic}`}
                alt="Picture"
                onClick={() => {
                  if (ISrenderSidebar) {
                    setISrenderSidebar(false)
                    setdashboardWidth('100vw')
                  }
                  else {
                    setISrenderSidebar(true)
                    setdashboardWidth('84vw')
                  }
                }}
              />
            </div>

          </nav >

          {/* Add Note */}

          < div className="add-note" >

            <h2>Add New Note</h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="Note Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                placeholder="Write your note..."
                value={description}
                name="description"
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              ></textarea>

              <select
                value={category}
                onChange={(e) => {
                  setcategory(e.target.value)
                }} >

                <option value={'Study'}>Study</option>
                <option value={'Work'}>Work</option>
                <option value={'Ideas'}>Ideas</option>
                <option value={'Personal'}>Personal</option>

              </select>

              <button>{submitbtnName}</button>

            </form>

          </div >


          {/*search btn */}

          {SearchBar(searchText, setsearchText, categoryFilter, setcategoryFilter, filterby, setfilterby, generatePDF)}

          {/* Notes */}

          <div className="category-name">
            <span>Category : </span>{categoryFilter}
          </div>
          <div className="notes-container">

            {filternotes.map((note) => (

              note.isPin && note.isDeleted === false ? (

                < div key={note.id} className="noteCard" >

                  <div className="note-heading">
                    <h3>{note.title}</h3>
                    <i className="fa-solid fa-thumbtack" onClick={() => {
                      pinNote(note.id);
                    }} style={note.isPin ? { backgroundColor: 'red' } : { backgroundColor: 'transparent' }}  ></i>
                  </div>


                  <p>{note.description}</p>

                  <div className="btn-group">
                    <button onClick={() => {
                      seteditenoteid(note.id);
                      editNote(note.id);
                      toast.info("You can edit")
                    }}>Edit</button>

                    <button onClick={() => {
                      deleteNote(note.id);
                    }} >Delete</button>

                  </div>
                  <div className="time">
                    <p>{new Date(note.DateTime).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: '2-digit'
                    })}</p>
                  </div>
                </div>) : null

            ))
            }

            {filternotes.map((note) => (

              !note.isPin && note.isDeleted === false ? (

                < div key={note.id} className="noteCard" >

                  <div className="note-heading">
                    <h3>{note.title}</h3>
                    <i className="fa-solid fa-thumbtack" onClick={() => {
                      pinNote(note.id);
                    }} style={note.isPin ? { backgroundColor: 'red' } : { backgroundColor: 'transparent' }}  ></i>
                  </div>


                  <p>{note.description}</p>

                  <div className="btn-group">
                    <button onClick={() => {
                      seteditenoteid(note.id);
                      editNote(note.id);
                      toast.info("You can edit")
                    }}>Edit</button>

                    <button onClick={() => {
                      deleteNote(note.id);
                    }} >Delete</button>
                  </div>
                  <div className="time">
                    <p>{new Date(note.DateTime).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: '2-digit'
                    })}</p>
                  </div>
                </div>

              ) : null
            ))}



          </div>

        </div >
      </>

    )

  }

  else {
    return (

      < div className="dashboard" style={{ width: `${dashboardWidh}` }} >

        {/* Navbar */}

        < nav className="navbar" >

          <h2>NoteFlow</h2>

          <div className="user-box">

            <select name="" id="" onChange={(e) => {
              setTheme(e.target.value);
            }} >
              <option value="" aria-readonly style={{ color: '#fafafa81' }}>Select Theam</option>
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
            <span>{username}</span>

            <img
              src={`http://localhost:3000/${profilepic}` || `http://10.65.122.219:3000/${profilepic}`}
              alt="Picture"
              onClick={() => {
                if (ISrenderSidebar) {
                  setISrenderSidebar(false)
                  setdashboardWidth('100vw')
                }
                else {
                  setISrenderSidebar(true)
                  setdashboardWidth('84vw')
                }

              }}
            />
          </div>

        </nav >

        {/* Add Note */}

        < div className="add-note" >

          <h2>Add New Note</h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Note Title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Write your note..."
              value={description}
              name="description"
              onChange={(e) =>
                setDescription(e.target.value)
              }
            ></textarea>

            <select
              value={category}
              onChange={(e) => {
                setcategory(e.target.value)
              }} >

              <option value={'Study'}>Study</option>
              <option value={'Work'}>Work</option>
              <option value={'Ideas'}>Ideas</option>
              <option value={'Personal'}>Personal</option>

            </select>
            <label htmlFor="bgcolor">Note Background Color</label>
            <input type="color"
              name="bgcolor"
              value={bgcolor}
              onChange={(e) => {
                setbgcolor(e.target.value)
              }}
              style={{ width: '100%', cursor: 'pointer' }}
            />

            <button>{submitbtnName}</button>

          </form>

        </div >


        {/*search btn */}

        {SearchBar(searchText, setsearchText, categoryFilter, setcategoryFilter, filterby, setfilterby, generatePDF)}

        {/* Notes */}

        <div className="category-name">
          <span>Category : </span>{categoryFilter}
        </div>
        <div className="notes-container">

          {filternotes.map((note) => (

            note.isPin && note.isDeleted === false ? (

              < div key={note.id} className="noteCard" style={{ backgroundColor: `${note.color}` }} >

                <div className="note-heading">
                  <h3>{note.title}</h3>
                  <i className="fa-solid fa-thumbtack" onClick={() => {
                    pinNote(note.id);
                  }} style={note.isPin ? { backgroundColor: 'red' } : { backgroundColor: 'transparent' }}  ></i>
                </div>


                <p>{note.description}</p>

                <div className="btn-group">
                  <button onClick={() => {
                    seteditenoteid(note.id);
                    editNote(note.id);
                    toast.info("You can edit")
                  }}>Edit</button>

                  <button onClick={() => {
                    deleteNote(note.id);
                  }} >Delete</button>

                </div>
                <div className="time">
                  <p>{new Date(note.DateTime).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: '2-digit'
                  })}</p>
                </div>
              </div>) : null

          ))
          }

          {filternotes.map((note) => (

            !note.isPin && note.isDeleted === false ? (

              < div key={note.id} className="noteCard" style={{ backgroundColor: `${note.color}` }} >

                <div className="note-heading">
                  <h3>{note.title}</h3>
                  <i className="fa-solid fa-thumbtack" onClick={() => {
                    pinNote(note.id);
                  }} style={note.isPin ? { backgroundColor: 'red' } : { backgroundColor: 'transparent' }}  ></i>
                </div>


                <p>{note.description}</p>

                <div className="btn-group">
                  <button onClick={() => {
                    seteditenoteid(note.id);
                    editNote(note.id);
                    toast.info("You can edit")
                  }}>Edit</button>

                  <button onClick={() => {
                    deleteNote(note.id);
                  }} >Delete</button>
                </div>
                <div className="time">
                  <p>{new Date(note.DateTime).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: '2-digit'
                  })}</p>
                </div>
              </div>

            ) : null
          ))}



        </div>

      </div >
    )

  }
























}


export default Notes;