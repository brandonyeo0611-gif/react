export async function RefreshAccessToken(refreshToken: string) {
    const response = await fetch("http://localhost:8000/RefreshAccessToken", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${refreshToken}` },
    });
    const res = await response.json();
    if (res.errorCode === 1) {
        return 401;
    }
    if (res.errorCode === 2) {
        return 402;
    }
    const data = res.payload.data.AccessToken;
    console.log(data);
    console.log(refreshToken);
    return data;
}
