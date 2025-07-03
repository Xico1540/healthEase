export default abstract class AbstractHttpClient<T> {
    // Base URL for the HTTP client
    private readonly baseUrl: string;

    // Timeout duration for HTTP requests
    private readonly timeout: number = 20000;

    // Constructor to initialize the base URL
    protected constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    // Abstract method to get headers, to be implemented by subclasses
    protected abstract getHeaders(contentType?: string): Promise<Headers>;

    // Method to create a timeout promise
    private createTimeoutPromise(): Promise<Response> {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Request timed out")), this.timeout);
        });
    }

    // Method to make a POST request
    public async post(endpoint: string, data: T, contentType?: string): Promise<Response> {
        const requestInit: RequestInit = {
            method: "POST",
            headers: await this.getHeaders(contentType || undefined),
            body: data instanceof URLSearchParams ? data.toString() : JSON.stringify(data),
        };
        return Promise.race([fetch(`${this.baseUrl}/${endpoint}`, requestInit), this.createTimeoutPromise()]);
    }

    // Method to make a GET request
    public async get(endpoint: string, contentType?: string): Promise<Response> {
        const requestInit: RequestInit = {
            method: "GET",
            headers: await this.getHeaders(contentType || undefined),
        };
        return Promise.race([fetch(`${this.baseUrl}/${endpoint}`, requestInit), this.createTimeoutPromise()]);
    }

    // Method to make a PUT request
    public async put(endpoint: string, data: T, contentType?: string): Promise<Response> {
        const requestInit: RequestInit = {
            method: "PUT",
            headers: await this.getHeaders(contentType || undefined),
            body: data instanceof URLSearchParams ? data.toString() : JSON.stringify(data),
        };
        return Promise.race([fetch(`${this.baseUrl}/${endpoint}`, requestInit), this.createTimeoutPromise()]);
    }

    // Method to make a DELETE request
    public async delete(endpoint: string, contentType?: string): Promise<Response> {
        const requestInit: RequestInit = {
            method: "DELETE",
            headers: await this.getHeaders(contentType || undefined),
        };
        return Promise.race([fetch(`${this.baseUrl}/${endpoint}`, requestInit), this.createTimeoutPromise()]);
    }
}