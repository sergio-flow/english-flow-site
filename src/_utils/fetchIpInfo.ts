const fetchIpInfo = async () => {
    const cached = localStorage.getItem('ipInfo')

    const ipInfo = cached ? JSON.parse(cached) : null

    if (ipInfo) {
        return ipInfo;
    }

    const response = await fetch('https://ipinfo.io/json?token=4bbccde6819c91');
    const data = await response.json();

    localStorage.setItem('ipInfo', JSON.stringify(data));

    return data;
}

export default fetchIpInfo;