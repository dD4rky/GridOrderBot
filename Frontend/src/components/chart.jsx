import {
	CandlestickSeries,
	createChart,
	ColorType,
	LineStyle,
	CrosshairMode,
} from "lightweight-charts";
import React, { useEffect, useRef, useContext } from "react";
import { AppContext } from "../App";
import "./chart.css";

function ChartComponent(props) {
	const { formData } = useContext(AppContext);
	const { data } = props;

	const chartContainerRef = useRef();
	const chartRef = useRef();
	const seriesRef = useRef();
	const priceLinesRef = useRef([]);

	useEffect(() => {
		const handleResize = () => {
			if (chartRef.current) {
				chartRef.current.applyOptions({
					width: chartContainerRef.current.clientWidth,
				});
			}
		};

		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: "#242424" },
				textColor: "#eeeeee",
			},
			grid: {
				vertLines: { color: "#343434", style: LineStyle.Solid },
				horzLines: { color: "#343434", style: LineStyle.Solid },
			},
			crosshair: { mode: CrosshairMode.Magnet },
			width: chartContainerRef.current.clientWidth,
			height: chartContainerRef.current.clientHeight,
			timeScale: {
				timeVisible: true,
				secondsVisible: false,
			},
		});

		chartRef.current = chart;

		const series = chart.addSeries(CandlestickSeries);
		seriesRef.current = series;

		series.setData(data);

		for (let i = 0; i < formData.steps; i += 1) {
			const priceLine = series.createPriceLine({
				price: formData.start_price - formData.price_step * i,
				color: '#fcd912',
				lineWidth: 1,
				lineStyle: LineStyle.LargeDashed,
			});
			priceLinesRef.current.push(priceLine);
		}

		chart.timeScale().fitContent();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);

			if (chartRef.current) {
				chartRef.current.remove();
				chartRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		if (seriesRef.current) {
			seriesRef.current.setData(data);

			for (let i = 0; i < formData.steps; i += 1) {
				if (priceLinesRef.current.length > i) {
					priceLinesRef.current[i].applyOptions({price : formData.start_price - formData.price_step * i});
				} else {
					const newPriceLine = seriesRef.current.createPriceLine({
						price: formData.start_price - formData.price_step * i,
						color: '#fcd912',
						lineWidth: 1,
						lineStyle: LineStyle.LargeDashed,
					});
					priceLinesRef.current.push(newPriceLine);
				}
			}

			// Удалить лишние линии, если steps уменьшилось
			while (priceLinesRef.current.length > formData.steps) {
				const lineToRemove = priceLinesRef.current.pop();
				seriesRef.current.removePriceLine(lineToRemove);
			}
		}
	}, [data, formData]);

	return <div ref={chartContainerRef} className="chart" />;
}

export default ChartComponent;
