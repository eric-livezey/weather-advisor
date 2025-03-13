async function request(baseUrl, endpoint, options) {
    options = options || {};
    const url = new URL(endpoint, baseUrl);
    for (const [key, value] of Object.entries(options.params || {})) {
        url.searchParams.append(key, String(value));
    }
    const request = new Request(url, { headers: options.headers, method: options.method, body: options.body });
    const res = await fetch(request);
    if (res.ok) {
        return await res.json();
    } else {
        throw new Error(`${res.status} ${res.statusText}`);
    }
}

export {
    request
}