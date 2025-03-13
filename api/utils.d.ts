declare interface RequestOptions {
    method?: string;
    params?: string[][] | Record<string, string> | string | URLSearchParams;
    headers?: Record<string, string>;
    body?: ReadableStream;
}

declare function request(baseUrl: string, endpoint: string, options?: RequestOptions): any;

export {
    RequestOptions,
    request
}