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
      const isConfirm = confirm('Ban co muon nhung san pham nay khong?');
      if (!isConfirm) {
        return;
      }
    }
    console.log(typeChange);

    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = document.querySelector("input[name='ids']");

      inputsChecked.forEach((input) => {
        let id = input.value;
        ids.push(id);
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
const path = formDeleteItem.getAttribute('data-path');
if (buttonDelete.length > 0) {
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
