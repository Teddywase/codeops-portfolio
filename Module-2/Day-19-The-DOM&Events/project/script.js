// Project — Interactive DOM Application

// Requirements
// • Add an item — a name and an ETB price — from a form, using preventDefault on submit and
// validating that both fields are filled.
// • Render each item as a row in the list using createElement and append (do not rebuild the whole
// list from a string).
// • Delete any item using a single delegated listener on the list container.
// • Toggle an item’s "bought" state by toggling a CSS class on its row (style the bought state in CSS).
// • Show a live running total of the ETB prices that updates whenever items are added or removed.

(function () {
    "use strict";

    var form = document.getElementById('add-form');
    var nameInput = document.getElementById('item-name');
    var priceInput = document.getElementById('item-price');
    var list = document.getElementById('market-list');
    var totalEl = document.getElementById('total-display');

    var style = document.createElement('style');
    style.textContent = '.bought { text-decoration: line-through; opacity: 0.6; }';
    document.head.appendChild(style);

    function updateTotal() {
        var sum = 0;
        var items = list.querySelectorAll('li');
        items.forEach(function (li) {
            var priceSpan = li.querySelector('.item-price');
            if (priceSpan) {
                var val = parseFloat(priceSpan.textContent.replace('ETB', '').trim());
                if (!isNaN(val)) {
                    sum += val;
                }
            }
        });
        totalEl.textContent = sum;
    }

    function addRow(name, price) {
        var li = document.createElement('li');
        var nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.textContent = name;

        var priceSpan = document.createElement('span');
        priceSpan.className = 'item-price';
        priceSpan.textContent = price + ' ETB';

        var delBtn = document.createElement('button');
        delBtn.className = 'del';
        delBtn.textContent = 'Delete';

        li.appendChild(nameSpan);
        li.appendChild(priceSpan);
        li.appendChild(delBtn);

        li.addEventListener('click', function (e) {
            if (e.target.matches('.del')) return;
            this.classList.toggle('bought');
        });

        list.appendChild(li);
        updateTotal();
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = nameInput.value.trim();
        var rawPrice = priceInput.value.trim();

        if (!name || !rawPrice) {
            return;
        }

        var price = Number(rawPrice);
        if (isNaN(price) || price <= 0) {
            return;
        }

        addRow(name, price);
        form.reset();
    });

    list.addEventListener('click', function (e) {
        if (e.target.matches('.del')) {
            var li = e.target.closest('li');
            if (li) {
                li.remove();
                updateTotal();
            }
        }
    });

    addRow('Coffee', 250);
    addRow('Injera', 120);
    addRow('Tea', 80);

})();