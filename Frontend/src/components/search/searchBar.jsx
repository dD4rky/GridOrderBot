import axios from "axios";

import SearchResultMenu from "./searchResultMenu";
import { useState } from "react";
import "./searchBar.css";

function SearchBar() {
	const [value, setValue] = useState("");
	const [visibility, setVisibility] = useState(false);
	const [instruments, setInstruments] = useState([]);

	const handleChange = (event) => {
		setValue(event.target.value);
		if (event.target.value == "") {
			setVisibility(false);
			return;
		} else {
			setVisibility(true);
		}
		axios
			.get("http://176.112.66.214:4040/get_instruments", {
				params: {
					query: event.target.value,
				},
			})
			.then((response) => {
				if (event.target.value == response.data["query"]) {
					setInstruments(response.data["instruments"]);
				}
			});
	};

	return (
		<>
			<input
				className="searchBar"
				type="text"
				value={value}
				onChange={handleChange}
				placeholder="TMOS"
			/>

			<SearchResultMenu
				instruments={instruments}
				visibility={visibility}
				setVisibility={setVisibility}
			/>
		</>
	);
}

export default SearchBar;
