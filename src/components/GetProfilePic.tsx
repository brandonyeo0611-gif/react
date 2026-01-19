export async function GetProfilePic(username: string) {
    const response = await fetch(`https://brandonwebforumgobackend.onrender.com/users/profile_pic?username=${username}`, {
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
        return 5002;
    }
    const data = res.payload.data.profile_url;
    console.log(data);
    return data;
}
