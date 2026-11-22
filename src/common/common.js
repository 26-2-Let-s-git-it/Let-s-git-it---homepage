async function loadPartial(selector, path) {
  const target = document.querySelector(selector);

  if (target === null) {
    return;
  }

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`공통 영역을 불러오지 못했습니다. (${path}, 상태 코드: ${response.status})`);
    }

    target.innerHTML = await response.text();
  } catch (err) {
    target.textContent = err.message;
  }
}

const DATA_PATH = "/src/assets/data/";

async function fetchJSON(fileName) {
  const response = await fetch(`${DATA_PATH}${fileName}`);

  if (!response.ok) {
    throw new Error(`데이터를 불러오지 못했습니다. (${fileName}, 상태 코드: ${response.status})`);
  }

  return await response.json();
}

let currentUser = null;

function updateAuthMenu() {
  const loginLink = document.querySelector(".site-header__login");
  const logoutButton = document.querySelector(".site-header__logout");

  if (loginLink === null || logoutButton === null) {
    return;
  }

  if (currentUser === null) {
    loginLink.style.display = "";
    logoutButton.style.display = "none";
  } else {
    loginLink.style.display = "none";
    logoutButton.style.display = "inline-block";
  }
}

function bindLogoutButton() {
  const logoutButton = document.querySelector(".site-header__logout");

  if (logoutButton === null) {
    return;
  }

  logoutButton.addEventListener("click", () => {
    currentUser = null;
    updateAuthMenu();
  });
}

async function initCommon() {
  await loadPartial("#site-header", "/src/common/header.html");
  updateAuthMenu();
  bindLogoutButton();

  await loadPartial("#site-footer", "/src/common/footer.html");
}

initCommon();
