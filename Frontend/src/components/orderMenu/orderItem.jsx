function OrderItem({figi}) {
    return (
        <>
            <li className="orderItem">
                <h2 className="orderItemName">{figi}</h2>
            </li>
        </>
    )
}

export default OrderItem;