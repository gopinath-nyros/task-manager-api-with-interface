// script for profile picture
const avatar = document.getElementById("avatar");
const profilePicture = document.getElementById("profilepicture");
avatar.addEventListener("change", () => {
  uploadFile(avatar.files[0]);
});

const uploadFile = async (file) => {
  // add file to FormData object
  const fd = new FormData();
  fd.append("avatar", file);
  const url = `/users/me/avatar`;
  const response = await fetch(url, {
    method: "POST",
    body: fd,
  });
  const data = await response.json();
  console.log(data.userid);
  if (response.status === 200) {
    const url = `/users/${data.userid}/avatar`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "image/png",
      },
    });
    const result = await response.blob();
    const objectURL = URL.createObjectURL(result);
    console.log(objectURL);
    profilePicture.src = objectURL;
  } else {
    alert("please provide only image format");
  }
};
