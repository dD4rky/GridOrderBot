import SearchResultItem from "./searchResultItem";
import "./searchResultMenu.css";

function SearchResultMenu({ instruments, visibility, setVisibility }) {
	return (
		<ul
			className={`${
				visibility ? "searchResultMenu" : "searchResultMenu hidden"
			}`}
		>
			{instruments.map((item) => (
				<SearchResultItem
					key={item.figi}
					name={item.name}
					ticker={item.ticker}
					figi={item.figi}
					setVisibility={setVisibility}
				/>
			))}
		</ul>
	);
}

export default SearchResultMenu;
