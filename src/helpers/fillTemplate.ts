export function fillTemplate(text: string, record: Record<string, string>) {
	return text.replace(/\{(w+)\}/g, (name) => {
		const key = name.replace(/[\{\}]/g, "");
		return record[key] || name;
	});
}
