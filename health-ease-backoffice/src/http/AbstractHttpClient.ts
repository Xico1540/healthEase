/**
 * An abstract class for handling HTTP requests.
 * This class provides methods to perform HTTP operations such as GET, POST, PUT, and DELETE.
 * It includes a timeout mechanism to handle requests that take too long to respond.
 */
export default abstract class AbstractHttpClient<T> {
    private readonly baseUrl: string;

    private readonly timeout: number = 20000;

    protected constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    protected abstract getHeaders(contentType?: string): Promise<Headers>;

    private createTimeoutPromise(): Promise<Response> {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Request timed out")), this.timeout);
        });
    }

    public async post(endpoint: string, data: T, contentType?: string): Promise<Response> {
        const requestInit: RequestInit = {
            method: "POST",
            headers: await this.getHeaders(contentType || undefined),
            body: data instanceof URLSearchParams ? data.toString() : JSON.stringify(data),
        };
        return Promise.race([fetch(`${this.baseUrl}/${endpoint}`, requestInit), this.createTimeoutPromise()]);
    }

    public async get(endpoint: string, contentType?: string): Promise<Response> {
        const requestInit: RequestInit = {
            method: "GET",
            headers: await this.getHeaders(contentType || undefined),
        };
        return Promise.race([fetch(`${this.baseUrl}/${endpoint}`, requestInit), this.createTimeoutPromise()]);
    }

    public async put(endpoint: string, data: T, contentType?: string): Promise<Response> {
        const requestInit: RequestInit = {
            method: "PUT",
            headers: await this.getHeaders(contentType || undefined),
            body: data instanceof URLSearchParams ? data.toString() : JSON.stringify(data),
        };
        return Promise.race([fetch(`${this.baseUrl}/${endpoint}`, requestInit), this.createTimeoutPromise()]);
    }

    public async delete(endpoint: string, contentType?: string): Promise<Response> {
        const requestInit: RequestInit = {
            method: "DELETE",
            headers: await this.getHeaders(contentType || undefined),
        };
        return Promise.race([fetch(`${this.baseUrl}/${endpoint}`, requestInit), this.createTimeoutPromise()]);
    }
}
