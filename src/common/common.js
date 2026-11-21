async function loadHeader() {
  const target = document.querySelector("#site-header");

  if (target === null) {
    return;
  }

  try {
    const response = await fetch("/src/common/header.html");

    if (!response.ok) {
      throw new Error(`헤더를 불러오지 못했습니다. (상태 코드: ${response.status})`);
    }

    target.innerHTML = await response.text();
  } catch (err) {
    target.textContent = err.message;
  }
}

loadHeader();
