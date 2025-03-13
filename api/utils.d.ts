declare interface RequestOptions {
    method?: string;
    params?: Record<string, string | number | boolean | string[] | number[] | boolean[]>;
    headers?: Record<string, string>;
    body?: ReadableStream;
}

declare function request(baseUrl: string, endpoint: string, options?: RequestOptions): any;

export {
    RequestOptions,
    request
}