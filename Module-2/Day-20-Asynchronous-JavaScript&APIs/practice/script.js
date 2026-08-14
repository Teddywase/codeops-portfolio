//Exercises

function setOutput(el, message) {
    el.textContent = message;
}

// Question 1. Write an async function that fetches the USD→ETB rate from a public exchange-rate API,
// checks res.ok, and returns the rate.

const ex1Output = document.getElementById('ex1-output');
const ex1Btn = document.getElementById('ex1-btn');

async function getEtbRate() {
    try {
        const res = await fetch('https://api.exchangerate.host/latest?base=USD');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const rate = data.rates.ETB;
        if (rate === undefined) throw new Error('ETB rate not found in response');
        return rate;
    } catch (err) {
        throw err;
    }
}

ex1Btn.addEventListener('click', async function() {
    setOutput(ex1Output, 'Fetching rate...');
    try {
        const rate = await getEtbRate();
        setOutput(ex1Output, '1 USD = ' + rate.toFixed(2) + ' ETB');
    } catch (err) {
        setOutput(ex1Output, 'Error: ' + err.message);
    }
});

// Question 2. Rewrite a three-step .then chain (fetch → json → render) as an async function using await and
// try/catch.

const ex2Output = document.getElementById('ex2-output');
const ex2Btn = document.getElementById('ex2-btn');

async function getPostTitle() {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        return 'Title: "' + data.title + '"';
    } catch (err) {
        return 'Error: ' + err.message;
    }
}

ex2Btn.addEventListener('click', async function() {
    setOutput(ex2Output, 'Running async function...');
    const result = await getPostTitle();
    setOutput(ex2Output, result);
});

// Question 3. Fetch a deliberately wrong URL and confirm your catch block runs; then fetch a real URL that
// returns 404 and show why you also need res.ok.

const ex3Output = document.getElementById('ex3-output');
const ex3Wrong = document.getElementById('ex3-wrong');
const ex3404 = document.getElementById('ex3-404');
const ex3Reset = document.getElementById('ex3-reset');

async function testFetch(url, label) {
    setOutput(ex3Output, 'Fetching ' + label + '...');
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('HTTP ' + res.status + ' — ' + (res.statusText || 'Not Found'));
        }
        const data = await res.json();
        setOutput(ex3Output, 'Success! Got ' + Object.keys(data).length + ' keys from ' + label);
    } catch (err) {
        setOutput(ex3Output, 'Error: ' + err.message);
    }
}

ex3Wrong.addEventListener('click', function() {
    testFetch('https://api.example.com/this-does-not-exist', 'wrong URL');
});

ex3404.addEventListener('click', function() {
    testFetch('https://jsonplaceholder.typicode.com/posts/999999999', 'real 404');
});

ex3Reset.addEventListener('click', function() {
    setOutput(ex3Output, 'Ready. Click a button to test error handling.');
});

// Question 4. Fetch a list from a public API and use Promise.all to fetch details for the first two items in
// parallel.

const ex4Output = document.getElementById('ex4-output');
const ex4Btn = document.getElementById('ex4-btn');

async function fetchUserDetails(userId) {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/' + userId);
    if (!res.ok) throw new Error('User ' + userId + ': HTTP ' + res.status);
    return res.json();
}

async function runPromiseAll() {
    const listRes = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!listRes.ok) throw new Error('List: HTTP ' + listRes.status);
    const users = await listRes.json();

    if (users.length < 2) throw new Error('Not enough users');

    const firstTwo = users.slice(0, 2);

    const [user1, user2] = await Promise.all([
        fetchUserDetails(firstTwo[0].id),
        fetchUserDetails(firstTwo[1].id),
    ]);

    return {
        user1: { name: user1.name, email: user1.email, city: user1.address.city },
        user2: { name: user2.name, email: user2.email, city: user2.address.city },
    };
}

ex4Btn.addEventListener('click', async function() {
    setOutput(ex4Output, 'Fetching users & details in parallel...');
    try {
        const result = await runPromiseAll();
        var msg = 'Parallel fetch complete!\n';
        msg += 'User 1: ' + result.user1.name + ' (' + result.user1.email + ') from ' + result.user1.city + '\n';
        msg += 'User 2: ' + result.user2.name + ' (' + result.user2.email + ') from ' + result.user2.city;
        setOutput(ex4Output, msg);
    } catch (err) {
        setOutput(ex4Output, 'Error: ' + err.message);
    }
});

// Question 5. Build a tiny page that shows "Loading…", then either the fetched data or an error message —
// all three states visible by toggling the network.

const ex5Output = document.getElementById('ex5-output');
const ex5List = document.getElementById('ex5-list');
const ex5Load = document.getElementById('ex5-load');
const ex5Error = document.getElementById('ex5-error');
const ex5Reset = document.getElementById('ex5-reset');

async function loadPosts() {
    setOutput(ex5Output, 'Loading posts...');
    ex5List.innerHTML = '';

    try {
        await new Promise(function(r) { setTimeout(r, 600); });

        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
        if (!res.ok) throw new Error('HTTP ' + res.status);

        const posts = await res.json();

        setOutput(ex5Output, 'Loaded ' + posts.length + ' posts');

        var html = '';
        for (var i = 0; i < posts.length; i++) {
            html += '<li>' + posts[i].title + '</li>';
        }
        ex5List.innerHTML = html;

    } catch (err) {
        setOutput(ex5Output, 'Error: ' + err.message);
        ex5List.innerHTML = '';
    }
}

ex5Load.addEventListener('click', loadPosts);

ex5Error.addEventListener('click', function() {
    setOutput(ex5Output, 'Simulated network error. Please try again.');
    ex5List.innerHTML = '';
});

ex5Reset.addEventListener('click', function() {
    setOutput(ex5Output, 'Ready. Click "Load Posts" to fetch data.');
    ex5List.innerHTML = '';
});

window.addEventListener('load', function() {
    setTimeout(loadPosts, 300);
});

console.log('All exercises ready!');