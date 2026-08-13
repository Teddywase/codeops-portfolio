// Exercises

(function () {
    "use strict";

// Question 1. Select an <h1> and change its text with textContent, then add a CSS class to it with
// classList.toggle.

    var heading = document.getElementById('ex1-heading');
    var toggleBtn = document.getElementById('toggle-heading-btn');

    heading.textContent = 'Selam, Addis!';

    var style1 = document.createElement('style');
    style1.textContent = '.highlight { background: yellow; padding: 0 10px; }';
    document.head.appendChild(style1);

    toggleBtn.addEventListener('click', function () {
        heading.classList.toggle('highlight');
    });

// Question 2. Given an array of three Ethiopian city names, create an <li> for each with createElement and
// append them to a <ul>.

    var cities = ['Addis Ababa', 'Bahir Dar', 'Hawassa'];
    var cityContainer = document.getElementById('city-list-container');

    cities.forEach(function (city) {
        var li = document.createElement('li');
        li.textContent = city;
        cityContainer.appendChild(li);
    });

// Question 3. Add a click listener to a button that logs event.target, then wrap the button in a div with its own
// listener and observe bubbling.

    var wrapper = document.getElementById('bubble-wrapper');
    var bubbleBtn = document.getElementById('bubble-btn');

    wrapper.addEventListener('click', function (e) {
        console.log('Wrapper clicked - target:', e.target.tagName, 'currentTarget:', e.currentTarget.tagName);
    });

    bubbleBtn.addEventListener('click', function (e) {
        console.log('Button clicked - target:', e.target.tagName, 'currentTarget:', e.currentTarget.tagName);
    });

// Question 4. Build a list of items each with a delete button, and remove any item using a single delegated
// listener on the parent.

    var demoList = document.getElementById('delegation-demo');
    var addDemoBtn = document.getElementById('add-demo-item');

    demoList.addEventListener('click', function (e) {
        if (e.target.matches('.del')) {
            var li = e.target.closest('li');
            if (li) {
                li.remove();
            }
        }
    });

    addDemoBtn.addEventListener('click', function () {
        var li = document.createElement('li');
        var span = document.createElement('span');
        var count = demoList.children.length + 1;
        span.textContent = 'Item ' + count;
        var delBtn = document.createElement('button');
        delBtn.className = 'del';
        delBtn.textContent = 'Delete';
        li.appendChild(span);
        li.appendChild(delBtn);
        demoList.appendChild(li);
    });

// Question 5. Add a form with one text input; on submit, preventDefault, read input.value, append it to a list,
// and clear the field.

    var exerciseForm = document.getElementById('exercise-form');
    var exerciseInput = document.getElementById('exercise-input');
    var exerciseList = document.getElementById('exercise-list');

    exerciseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var text = exerciseInput.value.trim();
        if (text) {
            var li = document.createElement('li');
            li.textContent = text;
            exerciseList.appendChild(li);
            exerciseInput.value = '';
        }
    });

})();