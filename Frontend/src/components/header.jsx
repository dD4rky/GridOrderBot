import SearchBar from "./search/searchBar";
import "./header.css";

function Header() {
	return (
		<header>
			<h1 className="logo">dD<span className="logo_smile">4_O</span>M</h1>
			<SearchBar></SearchBar>
		</header>
	);
}

export default Header;
