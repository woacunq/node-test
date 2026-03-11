// BUTTON_STATUS
const buttonStatus = document.querySelectorAll('[button-status]');
console.log(buttonStatus);

if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);
  console.log(url);

  buttonStatus.forEach((button) => {
    button.addEventListener('click', () => {
      const status = button.getAttribute('button-status');
      if (status) {
        url.searchParams.set('status', status);
      } else {
        url.searchParams.delete('status');
      }
      window.location.href = url.href;
    });
  });
}
