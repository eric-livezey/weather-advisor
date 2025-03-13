async function request(baseUrl, endpoint, options) {
    options = options || {};
    const url = new URL(endpoint, baseUrl);
    url.search =  "?" + new URLSearchParams(options.params).toString();
    const res = await fetch(url, { headers: options.headers, method: options.method, body: options.body });
    if (res.ok) {
        return await res.json();
    } else {
        throw new Error(`${res.status} ${res.statusText}`);
    }
}

export {
    request
}