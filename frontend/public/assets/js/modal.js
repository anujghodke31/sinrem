const setupServiceModals = () => {
  const cards = document.querySelectorAll(".bento-card[data-modal]");
  const closeModal = (modal) => {
    modal.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  cards.forEach((card) => {
    const modalId = card.getAttribute("data-modal");
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const open = () => {
      modal.classList.add("open");
      document.body.classList.add("menu-open");
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal(modal));
  });
};

document.addEventListener("DOMContentLoaded", setupServiceModals);
