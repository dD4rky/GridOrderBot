function quotationToFloat(quotation) {
	if (!quotation) return null;
	return quotation.units + quotation.nano / 1e9;
}

export default quotationToFloat;
