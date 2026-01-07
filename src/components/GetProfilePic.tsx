export async function GetProfilePic(username: string) {
    const response = await fetch(`http://localhost:8000/users/profile_pic?username=${username}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const res = await response.json();
    if (res.errorCode === 5000) {
        console.log(5000);
        return 5000;
    }
    if (res.errorCode === 5001) {
        console.log(5001);
        return 5001;
    }
    if (res.errorCode != 0) {
        console.log(5002);
        return;
    }
    const data = res.payload.data.profile_url;
    console.log(data);
    return data;
}
