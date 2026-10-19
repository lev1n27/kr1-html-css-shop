// Получаем модальное окно по id.
const orderDialog = document.getElementById('order-dialog');

// Получаем все кнопки заказа: у каждой есть data-product с названием товара.
const orderButtons = document.querySelectorAll('[data-product]');

// Получаем все кнопки закрытия окна: крестик, «Отмена» и «Готово».
const closeDialogButtons = orderDialog.querySelectorAll('[data-dialog-close]');

// Получаем скрытое поле, в которое будет записан выбранный товар.
const selectedProductInput = document.getElementById('selected-product');

// Получаем блок с выбранным товаром в окне.
const orderProductImage = document.getElementById('order-product-img');
const orderProductName = document.getElementById('order-product-name');
const orderProductPrice = document.getElementById('order-product-price');

// Получаем форму заявки и сообщение об успешной отправке.
const orderForm = document.getElementById('order-form');
const orderSuccess = document.getElementById('order-success');
const orderSuccessText = document.getElementById('order-success-text');
const orderTopicSelect = document.getElementById('order-topic');

// Перебираем все кнопки «Заказать».
orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Получаем данные о товаре из data-атрибутов кнопки.
    const { product, price, image } = button.dataset;

    // Записываем название товара в скрытое поле формы.
    selectedProductInput.value = product;

    // Показываем в окне, какой товар заказывается.
    orderProductName.textContent = product;
    orderProductPrice.textContent = price;
    orderProductImage.src = image;
    orderProductImage.alt = product;

    // Заявка из карточки товара — сразу выбираем тему «Заказ товара».
    orderTopicSelect.value = 'product';

    // Показываем форму, а не сообщение от прошлой заявки.
    orderForm.hidden = false;
    orderSuccess.hidden = true;

    // Открываем модальное окно.
    orderDialog.showModal();
  });
});

// Закрываем модальное окно по любой кнопке закрытия.
closeDialogButtons.forEach((button) => {
  button.addEventListener('click', () => {
    orderDialog.close();
  });
});

// Закрываем окно по клику на затемнённый фон.
// Клик по фону приходит на сам <dialog>, а клик по содержимому — на его дочерние блоки.
orderDialog.addEventListener('click', (event) => {
  if (event.target === orderDialog) {
    orderDialog.close();
  }
});

// При любом закрытии окна (крестик, фон, Esc) очищаем форму и ошибки.
orderDialog.addEventListener('close', () => {
  orderForm.reset();

  Array.from(orderForm.elements).forEach((element) => {
    element.removeAttribute('aria-invalid');
  });
});

// Обрабатываем отправку формы.
orderForm.addEventListener('submit', (event) => {
  // Отменяем стандартную отправку формы,
  // потому что backend пока не подключён.
  event.preventDefault();

  // Сбрасываем предыдущие признаки ошибок.
  const formElements = Array.from(orderForm.elements);

  formElements.forEach((element) => {
    if (element.willValidate) {
      element.removeAttribute('aria-invalid');
    }
  });

  // Проверяем встроенные HTML-ограничения формы.
  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute('aria-invalid', 'true');
      }
    });

    // Показываем стандартные сообщения браузера.
    orderForm.reportValidity();
    return;
  }

  // Вместо формы показываем сообщение об успешной отправке прямо в окне.
  orderSuccessText.textContent =
    `Заявка на товар «${selectedProductInput.value}» принята. ` +
    'Менеджер свяжется с вами в течение рабочего дня.';

  orderForm.hidden = true;
  orderSuccess.hidden = false;

  // Переводим фокус на кнопку «Готово», чтобы её было удобно нажать с клавиатуры.
  orderSuccess.querySelector('button').focus();
});
