// PERMISSIONS
const tablePermissions = document.querySelector("[table-permissions]");

if (tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]");

    buttonSubmit.addEventListener("click", () => {

        let permissions = [];

        const rows = tablePermissions.querySelectorAll("[data-name]");

        rows.forEach(row => {

            const permissionName = row.dataset.name;
            const inputs = row.querySelectorAll("input");

            inputs.forEach(input => {

                if (input.checked) {

                    const id = input.dataset.id;

                    let role = permissions.find(item => item.id === id);

                    if (!role) {
                        role = {
                            id: id,
                            permissions: []
                        };

                        permissions.push(role);
                    }

                    role.permissions.push(permissionName);
                }

            });

        });


        if (permissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
            inputPermissions.value = JSON.stringify(permissions)
            formChangePermissions.submit()
        }
    });
}

// END PERMISSIONS

// PERMISSIONS DATA DEFAULT
const dataRecords = document.querySelector("[data-records]");

if (dataRecords) {

    const records = JSON.parse(dataRecords.getAttribute("data-records"));

    records.forEach((record) => {

        const permissions = record.permissions

        permissions.forEach(permission => {

            // const row = tablePermissions.querySelector(`[data-permission='${permission}']`)
            // console.log(row);

            const input = document.querySelector(
                `[data-id="${record._id}"][data-permission="${permission}"]`
            );
            console.log(input);


            input.checked = true;

        })

    })
}

// END PERMISSIONS DATA DEFAULT