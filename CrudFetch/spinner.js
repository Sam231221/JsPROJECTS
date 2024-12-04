export class Spinner {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
  }

  show() {
    this.element.innerHTML = '<div class="spinner"></div>';
  }

  hide() {
    this.element.innerHTML = "";
  }
}
