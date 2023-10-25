const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

class APIs {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Make a GET request to retrieve data.
     * @param endpoint - The API endpoint to call.
     * @param params - Optional query parameters.
     */
    async get(endpoint: string, params?: Record<string, any>): Promise<any> {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (params) {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Check if the response is JSON or not.
        const contentType = response.headers.get('Content-Type');
        if (contentType?.includes('application/json')) {
            return await response.json();
        }

        // If not JSON, return the whole response
        return await response;
    }

    /**
     * Make a POST request to store data.
     * @param endpoint - The API endpoint to call.
     * @param body - The data to send in the request body.
     */
    async post(endpoint: string, body: Record<string, any>): Promise<any> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    }
}

export const service = new APIs(API_BASE_URL);