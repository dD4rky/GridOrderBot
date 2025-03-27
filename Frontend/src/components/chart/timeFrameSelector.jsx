import "./timeFrameSelector.css";

function TimeFrameSelector({ timeframes, setTimeframe }) {
	const onValueChange = (event) => {
		setTimeframe(event.target.value);
	};

	return (
		<form className="timefameSelectorForm">
			<ul className="timefameRadioButtonList">
				{timeframes.map((item, index) => (
					<TimeFrameButton
						name={item}
						index={index}
						key={index}
						update={onValueChange}
					/>
				))}
			</ul>
		</form>
	);
}

function TimeFrameButton({ name, index, update }) {
	return (
		<>
			<li className="timefameRadioButton">
				<input
					type="radio"
					id={name}
					name="timeframe"
					value={name}
					defaultChecked={index == 0}
					onChange={update}
				/>
				<label for={name} className="timefameRadioButtonLabel">
					{name}
				</label>
			</li>
		</>
	);
}

export default TimeFrameSelector;
