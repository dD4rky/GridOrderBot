import quotationToFloat from "../../utils";
import { useContext } from "react";
import { AppContext } from "../../App";
import "./placeOrderMenu.css";

import axios from "axios";

const Input = ({ label, step, value, handleChange, keyName }) => {
	return (
		<>
			<p className="formInputLabel">{label}</p>
			<input
				className="formInput"
				type="number"
				placeholder={label}
				step={step}
				value={value}
				onChange={handleChange}
				name={keyName}
			/>
		</>
	);
};

function PlaceOrderMenu(instrument) {
	const { formData, setFormData } = useContext(AppContext);

	const handleChange = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setFormData({
			...formData,
			figi: instrument?.instrument?.figi || null,
		});
		if (formData.figi != null) {
			axios.post(
				`${window.location.origin}/router/place_orders`,
				formData
			);
			// .then((response) => {
			// 	console.log(response);
			// });
		}
	};

	const minPriceIncrement =
		quotationToFloat(instrument?.instrument?.min_price_increment) || 0.1;
	const name = instrument?.instrument?.name || "None";
	const figi = instrument?.instrument?.figi || "None";
	const ticker = instrument?.instrument?.ticker || "None";

	return (
		<>
			<div className="placeOrderMenu">
				<div className="blockLabel">
					<h2>{name}</h2>
					<h3>{ticker}</h3>
				</div>
				<form className="orderMenuForm" onSubmit={handleSubmit}>
					<Input
						label="Начальная цена"
						step={minPriceIncrement}
						value={formData.start_price}
						handleChange={handleChange}
						keyName="start_price"
					/>
					<Input
						label="Кол-во ордеров"
						step={1}
						value={formData.steps}
						handleChange={handleChange}
						keyName="steps"
					/>
					<Input
						label="Кол-во лотов на ордер"
						step={1}
						value={formData.q_per_step}
						handleChange={handleChange}
						keyName="q_per_step"
					/>
					<Input
						label="Шаг цены между ордерами"
						step={minPriceIncrement}
						value={formData.price_step}
						handleChange={handleChange}
						keyName="price_step"
					/>
					<button className="submitButton" type="submit">
						Подтвердить
					</button>
				</form>
			</div>
		</>
	);
}

export default PlaceOrderMenu;
