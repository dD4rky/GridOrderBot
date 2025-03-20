import axios from "axios";
import { useState } from "react";

import OrderItem from "./orderItem"

import "./orderList.css"
function OrderList() {
	const [orders, setOrders] = useState([]);

	axios.get(`${window.location.origin}/router/get_orders`).then((response) => { setOrders(response.data.orders || []) });

    return (
        <>
			<div className="orderListBlock">
				<div className="blockLabel">
					<h2>Bid/Ask</h2>
				</div>
				<ul className="orderList">
					{orders.map((item, index) => (
						<OrderItem figi={item.figi} key={"ol-"+index}></OrderItem>
					))}
				</ul>
			</div>
        </>
    )
}

export default OrderList;

// {instruments.map((item) => (
//     <SearchResultItem
//         key={item.figi}
//         name={item.name}
//         ticker={item.ticker}
//         figi={item.figi}
//         setVisibility={setVisibility}
//     />
// ))}