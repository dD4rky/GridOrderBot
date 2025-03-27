import React, { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/header";
import PlaceOrderMenu from "./components/orderMenu/placeOrderMenu";
import OrderList from "./components/orderMenu/orderList";

import ChartComponent from "./components/chart/chart";

import axios from "axios";

export const AppContext = React.createContext();

function App() {
	const [selectedInstrument, setSelectedInstrument] =
		useState("BBG333333333");
	const [selectedInstrumentData, setSelectedInstrumentData] = useState();
	const [formData, setFormData] = useState({
		figi: selectedInstrument,
		start_price: 0,
		steps: 0,
		q_per_step: 0,
		price_step: 0,
	});

	useEffect(() => {
		if (!selectedInstrument.length) return;
		axios
			.get(`${window.location.origin}/router/get_instrument`, {
				params: { figi: selectedInstrument },
			})
			.then((response) => {
				setSelectedInstrumentData(
					response.data ? response.data.instrument : null
				);
			});
	}, [selectedInstrument]);

	return (
		<>
			<AppContext.Provider value={{ setSelectedInstrument }}>
				<Header />
			</AppContext.Provider>
			<div className="workflow">
				<AppContext.Provider value={{ formData }}>
					<ChartComponent instrument={selectedInstrument}/>
				</AppContext.Provider>
				<div className="orderBar">
					<AppContext.Provider value={{ formData, setFormData }}>
						<PlaceOrderMenu instrument={selectedInstrumentData} />
					</AppContext.Provider>
					<OrderList />
				</div>
			</div>
		</>
	);
}

export default App;
