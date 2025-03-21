import axios from "axios";
import { useState, useEffect } from "react";

import quotationToFloat from "../../utils";

import "./orderItem.css";

function OrderItem({ orderData }) {
	const [data, setData] = useState({
		...orderData,
		ticker: "None",
		name: "None",
	});

	useEffect(() => {
		axios
			.get(`${window.location.origin}/router/get_instrument`, {
				params: {
					figi: orderData.figi,
				},
			})
			.then((response) => {
				setData({
					...data,
					...response.data.instrument,
				});
				console.log(data);
			});
		// console.log(data);
	}, []);

	return (
		<>
			<li className="orderItem">
				<h2 className="orderItemName">{data.name}</h2>
				<h3 className="orderItemTicker">{data.ticker}</h3>
				<p>
					<span className="orderItemLabel">Price:</span>
					<span className="orderItemData">
						{quotationToFloat(data.initial_security_price) *
							data.lot}
					</span>
				</p>
				<p>
					<span className="orderItemLabel">Count:</span>
					<span className="orderItemData">
						{data.lots_executed}/{data.lots_requested}
					</span>
				</p>
			</li>
		</>
	);
}

export default OrderItem;

// execution_report_status	OrderExecutionReportStatus	Текущий статус заявки.
// lots_requested	int64	Запрошено лотов.
// lots_executed	int64	Исполнено лотов.
// initial_order_price	MoneyValue	Начальная цена заявки. Произведение количества запрошенных лотов на цену.
// executed_order_price	MoneyValue	Исполненная цена заявки. Произведение средней цены покупки на количество лотов.
// total_order_amount	MoneyValue	Итоговая стоимость заявки, включающая все комиссии.
// average_position_price	MoneyValue	Средняя цена позиции по сделке.
// figi	string	Figi-идентификатор инструмента.
// direction	OrderDirection	Направление заявки.
// initial_security_price	MoneyValue	Начальная цена за 1 инструмент. Для получения стоимости лота требуется умножить на лотность инструмента.
// currency	string	Валюта заявки.
// order_type	OrderType	Тип заявки.
// order_date	google.protobuf.Timestamp	Дата и время выставления заявки в часовом поясе UTC.
