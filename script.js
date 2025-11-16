
let matchedGuest = null;

async function findGuest() {
  const nameInput = document.getElementById("name-input");
  const name = nameInput.value.trim();
  const notFoundMsg = document.getElementById("not-found-msg");

  if (!name) {
    notFoundMsg.textContent = "Будь ласка, введіть ім'я.";
    notFoundMsg.style.display = "block";
    return;
  }


  let guestsData = [];
  try {
    const response = await fetch('guests.json');
    if (!response.ok) {
      throw new Error(`Помилка завантаження: ${response.status}`);
    }
    guestsData = await response.json();
  } catch (error) {
    console.error("Помилка завантаження бази гостей:", error);
    notFoundMsg.textContent = "Не вдалося завантажити список гостей. Спробуйте пізніше.";
    notFoundMsg.style.display = "block";
    return;
  }


  const matchedGuest = guestsData.find(
    guest => guest.name.toLowerCase() === name.toLowerCase()
  );

  if (matchedGuest) {
    notFoundMsg.style.display = "none";


    document.getElementById("guest-introduction").style.display = "none";
    document.getElementById("envelope-search-screen").style.display = "flex";


    localStorage.setItem("guest", JSON.stringify(matchedGuest));

    renderEnvelopes();
  } else {
    notFoundMsg.textContent = "Здається, запрошення відсутнє";
    notFoundMsg.style.display = "block";
  }
}


function renderEnvelopes() {
  const container = document.getElementById("search-list");
  const title = document.getElementById("search-title");

  container.innerHTML = "";
  title.textContent = "Шукаємо твоє запрошення…";

  container.className = "envelopes scrolling";

  const track = document.createElement("div");
  track.className = "scroll-track";

  for (let r = 0; r < 2; r++) {
    for (let i = 0; i < 10; i++) {
      const env = document.createElement("div");
      env.className = "envelope";
      track.appendChild(env);
    }
  }

  container.appendChild(track);

  setTimeout(() => {
    const guestName = matchedGuest.name;
    window.location.href = `invite.html?name=${encodeURIComponent(guestName)}`;
  }, 4000);
}


function toAccusative(name, gender = "male") {
  const parts = name.trim().split(" ");
  let firstName = parts[0];
  let lastName = parts[1] || "";


  if (gender === "female") {
    if (firstName.endsWith("а")) firstName = firstName.slice(0, -1) + "у";
    else if (firstName.endsWith("я")) firstName = firstName.slice(0, -1) + "ю";

    if (lastName.endsWith("а")) lastName = lastName.slice(0, -1) + "у";
    else if (lastName.endsWith("я")) lastName = lastName.slice(0, -1) + "ю";

  } else {
    if (firstName.length > 0 && "бвгґджзклмнпрстфхцчшщ".includes(firstName.slice(-1).toLowerCase())) {
      firstName += "а";
    } else if (firstName.endsWith("о")) {
      firstName = firstName.slice(0, -1) + "а";
    }

    if (lastName.length > 0 && "бвгґджзклмнпрстфхцчшщ".includes(lastName.slice(-1).toLowerCase())) {
      lastName += "а";
    } else if (lastName.endsWith("о")) {
      lastName = lastName.slice(0, -1) + "а";
    }
  }

  return firstName + (lastName ? " " + lastName : "");
}
