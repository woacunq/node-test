// Cập nhật số lượng trong giỏ hàng
const inputsQuantity = document.querySelectorAll("input[name='quantity']");

if (inputsQuantity.length > 0) {
    inputsQuantity.forEach(input => {
        input.addEventListener("change", () => {
            const quantity = input.value
            const productId = input.dataset.productId

            console.log(quantity);
            console.log(productId);

            window.location.href = `/cart/update/${productId}/${quantity}`
        })
    })
}





// End Cập nhật số lượng trong giỏ hàng