import { useContext } from "react";
import { AppContext } from "../../App";
import "./searchResultItem.css";

function SearchResultItem({ name, ticker, figi, setVisibility }) {
	const { setSelectedInstrument } = useContext(AppContext);

	const onClick = (event) => {
		setSelectedInstrument(event.target.closest("li").getAttribute("value"));
		setVisibility(false);
	};

	return (
		<>
			<li
				className="searchResultItem"
				key={figi}
				value={figi}
				onClick={onClick}
			>
				<p className="itemName">{name}</p>
				<p className="itemTicker">{ticker}</p>
				<p className="itemFigi">{figi}</p>
			</li>
		</>
	);
}
export default SearchResultItem;
