import React, { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/header";
import PlaceOrderMenu from "./components/placeOrderMenu";

import ChartComponent from "./components/chart";

import axios from "axios";

export const AppContext = React.createContext();

function App(props) {
	const [chartData, setChartData] = useState([]);
	const [selectedInstrument, setSelectedInstrument] =
		useState("BBG333333333");
	const [selectedInstrumentData, setSelectedInstrumentData] = useState();
	const [formData, setFormData] = useState({
		figi: selectedInstrumentData?.figi,
		start_price: 0,
		steps: 0,
		q_per_step: 0,
		price_step: 0,
	});

	useEffect(() => {
		if (!selectedInstrument.length) return;
		axios
			.get("http://176.112.66.214:4040/get_instrument", {
				params: { figi: selectedInstrument },
			})
			.then((response) => {
				setSelectedInstrumentData(
					response.data ? response.data.instrument : null
				);
				axios
					.get("http://176.112.66.214:4040/get_candlestick_data", {
						params: {
							figi: selectedInstrument,
							timeframe: "m5",
						},
					})
					.then((response) => {
						setChartData(response.data);
					});
			});
	}, [selectedInstrument]);

	return (
		<>
			<AppContext.Provider value={{ setSelectedInstrument }}>
				<Header />
			</AppContext.Provider>
			<div className="workflow">
				<AppContext.Provider value={{ formData }}>
					<ChartComponent {...props} data={chartData} />
				</AppContext.Provider>
				<AppContext.Provider value={{ formData, setFormData }}>
					<PlaceOrderMenu instrument={selectedInstrumentData} />
				</AppContext.Provider>
			</div>
		</>
	);
}

export default App;
