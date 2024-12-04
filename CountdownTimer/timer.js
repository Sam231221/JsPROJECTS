document.addEventListener("DOMContentLoaded", () => {
  const endTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const timerElements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  };

  //function that return timer object with remaining days, hours, minutes, seconds
  function getTimeLeft() {
    const total = endTime - Date.now();
    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / 1000 / 60) % 60),
      seconds: Math.floor((total / 1000) % 60),
    };
  }

  //function that update the timer
  function updateTimer() {
    const timeLeft = getTimeLeft();
    for (const [unit, element] of Object.entries(timerElements)) {
      element.textContent = timeLeft[unit].toString().padStart(2, "0");
    }
    if (Object.values(timeLeft).every((value) => value === 0)) {
      clearInterval(timerInterval);
      console.log("Timer ended");
    }
  }

  const timerInterval = setInterval(updateTimer, 1000);
  updateTimer(); // Initial call to avoid delay

  // Fade in animation
  const timerContainer = document.getElementById("limited-time-offer-timer");
  timerContainer.style.opacity = "0";
  timerContainer.style.transform = "translateY(-20px)";
  timerContainer.style.transition = "opacity 0.5s, transform 0.5s";

  setTimeout(() => {
    timerContainer.style.opacity = "1";
    timerContainer.style.transform = "translateY(0)";
  }, 100);
});
