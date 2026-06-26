import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";

function SearchBar(searchText, setsearchText, categoryFilter, setcategoryFilter, filterby, setFilterby,generatePDF) {

    return (
        <div className="search-container">

            <div className="search-box">

                <FaSearch className="search-icon" />

                <input
                    type="text"
                    placeholder="Search your notes..."
                    value={searchText}
                    onInput={(e) => {
                        console.log(e.target.value);
                        setsearchText(e.target.value)
                    }}
                />

            </div>
            <div className="category-filter">
                <select
                    value={categoryFilter}
                    onChange={(e) =>

                        setcategoryFilter(e.target.value)
                    }>

                    <option value={'All'}>All</option>
                    <option value={'Study'}>Study</option>
                    <option value={'Work'}>Work</option>
                    <option value={'Ideas'}>Ideas</option>
                    <option value={'Personal'}>Personal</option>
                </select>
            </div>
            <div className="filterby">
                <select name="" id="" value={filterby} onChange={(e) => {
                    setFilterby(e.target.value)
                }} >
                    <option value="Newest First">Newest First</option>
                    <option value="Oldest First">Oldest First</option>
                    <option value="A-Z">A-Z</option>
                    <option value="Z-A">Z-A</option>
                </select>
            </div>
            <div className="generate-pdf" onClick={()=>{
                generatePDF()
            }}>
                <button>Generate PDF</button>
            </div>

        </div>
    );
}

export default SearchBar;