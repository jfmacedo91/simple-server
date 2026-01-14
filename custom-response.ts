import type { ServerResponse } from "node:http";

export interface CustomResponse extends ServerResponse {
	status(code: number): CustomResponse;
	json(data: any): void;
}

export function customResponse(response: ServerResponse) {
	const res = response as CustomResponse;
	res.status = (code) => {
		res.statusCode = code;
		return res;
	}

	res.json = (data) => {
		try {
			const body = JSON.stringify(data);
			res.setHeader("Content-Type", "application/json");
			res.end(body);
		} catch {
			res.status(500).end(data);
		}
	}

	return res;
}