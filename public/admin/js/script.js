// BUTTON_STATUS
const buttonStatus = document.querySelectorAll('[button-status]');
// console.log(buttonStatus);

if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);
  // console.log(url);

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
// End buttonStatus

// Form Search

const formSearch = document.querySelector('#form-search');
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set('keyword', keyword);
    } else {
      url.searchParams.delete('keyword');
    }
    window.location.href = url.href;
  });
}

// End Form Search

// Pagination
const buttonPagination = document.querySelectorAll('[button-pagination]');
if (buttonPagination) {
  // truyen len url
  let url = new URL(window.location.href);

  buttonPagination.forEach((button) => {
    button.addEventListener('click', () => {
      const page = button.getAttribute('button-pagination');

      url.searchParams.set('page', page);

      window.location.href = url.href;
    });
  });
}

// EndPagination

// Checkbox Multi
const checkboxMulti = document.querySelector('[checkbox-multi]');
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = document.querySelectorAll("input[name='id']");
  inputCheckAll.addEventListener('click', () => {
    console.log(inputCheckAll.checked);
    if (inputCheckAll.checked) {
      console.log(`check all`);
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
  });

  inputsId.forEach((input) => {
    input.addEventListener('click', () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked",
      ).length;

      if (countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
// End Checkbox Multi

// form change multi
const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti) {
  formChangeMulti.addEventListener('submit', (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector('[checkbox-multi]');
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked",
    );

    const typeChange = e.target.elements.type.value;

    if (typeChange == 'delete-all') {
      const isConfirm = confirm('Ban co muon xoa nhung san pham nay khong?');
      if (!isConfirm) {
        return;
      }
    }
    // console.log(typeChange);

    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = document.querySelector("input[name='ids']");

      inputsChecked.forEach((input) => {
        let id = input.value;
        if (typeChange == 'change-position') {
          const position = input
            .closest('tr')
            .querySelector('input[name="position"]').value;

          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(',');
      formChangeMulti.submit();
    } else {
      alert('Vui long chon it nhat mot bang ghi');
    }
  });
}

// end form change multi

// Delete item
const buttonDelete = document.querySelectorAll('[button-delete]');
const formDeleteItem = document.querySelector('#form-delete-item');

if (buttonDelete.length > 0) {
  const path = formDeleteItem.getAttribute('data-path');
  buttonDelete.forEach((button) => {
    button.addEventListener('click', () => {
      const isConfirm = confirm('Ban co chac chan muon xoa san pham nay khong');
      if (isConfirm) {
        const id = button.getAttribute('data-id');
        const action = `${path}/${id}?_method=DELETE`;

        console.log(action);
        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    });
  });
}

// End Delete item

// SHOW ALERT

const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
  const time = parseInt(showAlert.getAttribute('data-time'));
  const closeAlert = showAlert.querySelector('[close-alert]');
  setTimeout(() => {
    showAlert.classList.add('alert-hidden');
  }, time);

  closeAlert.addEventListener('click', () => {
    showAlert.classList.add('alert-hidden');
  });
}
// END SHOW ALERT

// Upload Image
const uploadImage = document.querySelector('[upload-image]');
if (uploadImage) {
  const uploadImageInput = document.querySelector('[upload-image-input]');
  const uploadImagePreview = document.querySelector('[upload-image-preview]');

  uploadImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
  const removeImagePreview = document.querySelector('.remove-image');
  // console.log(uploadImagePreview.getAttribute('src'));
  removeImagePreview.addEventListener('click', () => {
    uploadImagePreview.setAttribute('src', '');
    uploadImageInput.value = '';
  });
}
// End Upload Image

// SORT
const sort = document.querySelector('[sort]');
if (sort) {
  let url = new URL(window.location.href);
  const sortSelect = document.querySelector('[sort-select]');
  const sortClear = document.querySelector('[sort-clear]');

  // Sap xep
  sortSelect.addEventListener('change', (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split('-');
    url.searchParams.set('sortKey', sortKey);
    url.searchParams.set('sortValue', sortValue);

    window.location.href = url.href;
  });

  // Xoa sap xep
  sortClear.addEventListener('click', () => {
    url.searchParams.delete('sortKey');
    url.searchParams.delete('sortValue');

    window.location.href = url.href;
  });
  // Them  select cho option
  const sortKey = url.searchParams.get('sortKey');
  const sortValue = url.searchParams.get('sortValue');
  if (sortKey && sortValue) {
    const optionValue = `${sortKey}-${sortValue}`;
    const optionSelected = sort.querySelector(`option[value="${optionValue}"]`);
    optionSelected.selected = true;

    // const options = sort.querySelectorAll('option');

    // options.forEach((o) => {
    //   if (o.value == optionValue) {
    //     o.setAttribute('selected', true);
    //   }
    // });
  }
}

// END SORT
