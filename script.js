function saveEmail() {
  const email = document.getElementById("emailInput").value.trim();
  const msg = document.getElementById("emailMessage");

  if (!email || !email.includes("@")) {
    msg.innerText = "Please enter a valid email.";
    return;
  }

  let list = JSON.parse(localStorage.getItem("bookworm_email_list") || "[]");
  list.push(email);
  localStorage.setItem("bookworm_email_list", JSON.stringify(list));

  msg.innerText = "Thanks! You are subscribed.";
}
