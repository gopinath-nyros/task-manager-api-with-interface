// script for deleting the user
async function removeAccount() {
  const confirmation = window.confirm("are you sure to delete your account ?");
  if (confirmation) {
    const url = "/removeaccount";
    const response = await fetch(url, {
      method: "DELETE",
      redirect: "follow",
    });
    if (response.status === 200) {
      window.location.href = "/";
    } else {
      alert("something went wrong");
    }
  }
}
