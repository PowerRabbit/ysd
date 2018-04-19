import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'

const text = {
    status: {
        ok: 'ok',
        cached: 'cached',
        error: 'error'
    },
    error: {
        noUrl: 'No URL was specified',
        unknown: 'Unknown error'
    }
}

const prepareAllUsersData = (data) => {
    return Array.isArray(data) ? data : [];
}

const prepareUserData = (data) => {
    return data ? [data] : [{}];
}

const cache = {};

const getData = (url, prepareData) => {
    const response = {
        status: text.status.error
    };

    const controller = new AbortController();
    const signal = controller.signal;

    return {
        promise: new Promise((resolve, reject) => {
            if (!url) {
                response.message = text.error.noUrl;
                reject(response);
                return;
            }

            if (cache[url]) {
                response.status = text.status.cached;
                response.data = cache[url];
                resolve(response);
                return;
            }

            fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
                signal
            }).then(res => {
                if (res && res.ok === false) {
                    response.message = res.statusText || text.error.unknown;
                    reject(response);
                } else {
                    return res.json();
                }
            })
            .then(
                (result) => {
                    response.status = text.status.ok;
                    response.data = prepareData(result);
                    cache[url] = response.data;
                    resolve(response);
                },
                (error) => {
                    if (!signal.aborted) {
                        response.message = (error && (error.message || error)) || text.error.unknown;
                        reject(response);
                    }
                }
            )
        }),
        cancel: () => {
            if (controller && controller.abort) {
                controller.abort();
            }
        }
    }
};

const GetUsersData = {
    getAllUsers: (url) => {
        return getData(url, prepareAllUsersData);
    },
    getUser: (url) => {
        return getData(url, prepareUserData);
    },
    textConstants: text
};

export default GetUsersData;

