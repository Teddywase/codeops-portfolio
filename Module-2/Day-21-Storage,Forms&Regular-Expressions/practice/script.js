// Exercises
// Work these in order and commit as you go. Each is small and testable on its own.
// 1. Add a language or theme toggle to an earlier project and make it remember the choice with
// localStorage (save on change, restore on load).

        (function exercise1() {
            const body = document.body;
            const themeToggle = document.getElementById('themeToggle');
            const themeToggleBtn = document.getElementById('themeToggleBtn');

            // 1. On page load, read 'theme' from localStorage
            const savedTheme = localStorage.getItem('theme') || 'light';
            
            // 2. Apply the saved theme (or default to 'light')
            body.className = savedTheme;
            themeToggle.textContent = savedTheme === 'dark' ? 'Light Mode' : 'Dark Mode';

            // 3. On button click, toggle theme and save to localStorage
            function toggleTheme() {
                const current = body.className;
                const next = current === 'dark' ? 'light' : 'dark';
                body.className = next;
                localStorage.setItem('theme', next);
                themeToggle.textContent = next === 'dark' ? 'Light Mode' : 'Dark Mode';
                themeToggleBtn.textContent = next === 'dark' ? 'Switch to Light' : 'Switch to Dark';
            }

            themeToggle.addEventListener('click', toggleTheme);
            themeToggleBtn.addEventListener('click', toggleTheme);
        })();


// 2. Write save() and load() helpers that stringify an array to localStorage and parse it back,
// guarding null and corrupt data with try / catch.


        (function exercise2() {
            const STORAGE_KEY = 'signups';

            // loadData: Get array from localStorage, handle null and corrupt data
            function loadData() {
                try {
                    const raw = localStorage.getItem(STORAGE_KEY);
                    if (raw === null) return [];

                    const parsed = JSON.parse(raw);
                    if (!Array.isArray(parsed)) return [];

                    // Optional: filter valid entries
                    return parsed.filter(
                        entry =>
                        typeof entry === 'object' &&
                        entry !== null &&
                        typeof entry.name === 'string' &&
                        typeof entry.phone === 'string'
                    );
                } catch (_err) {
                    // Corrupt data -> start fresh
                    return [];
                }
            }

            // saveData: Convert array to JSON and save to localStorage
            function saveData(data) {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    return true;
                } catch (_err) {
                    // Quota exceeded or unavailable
                    console.warn('Could not save to localStorage.');
                    return false;
                }
            }
            // Expose for console testing
            window.__exercise2 = { loadData, saveData, STORAGE_KEY };
        })();


// 3. Build a signup form with labelled name and phone inputs, a submit button, and an error area.
// 4. On submit, preventDefault, read the trimmed values, and validate: name at least two
// characters, phone against the Ethiopian regex.
// 5. Show a clear, specific message for the first problem found, using textContent.
// 6. On success, save the entry to localStorage as JSON, clear the form, and on load show how
// many people have signed up.

        (function exercise3to6() {
            // EXERCISE 4: Regular Expression for Ethiopian phone
            const PHONE = /^(?:\+251|0)9\d{8}$/;

            // DOM references (EXERCISE 3)
            const form = document.getElementById('signupForm');
            const nameInput = document.getElementById('nameInput');
            const phoneInput = document.getElementById('phoneInput');
            const errorArea = document.getElementById('errorArea');
            const successArea = document.getElementById('successArea');
            const countNumber = document.getElementById('countNumber');
            const clearAllBtn = document.getElementById('clearAllBtn');
            const entriesList = document.getElementById('entriesList');

            // Storage helpers (using EXERCISE 2)
            const STORAGE_KEY = 'signups';

            function loadSignups() {
                try {
                    const raw = localStorage.getItem(STORAGE_KEY);
                    if (raw === null) return [];

                    const parsed = JSON.parse(raw);
                    if (!Array.isArray(parsed)) return [];

                    return parsed.filter(
                        entry =>
                        typeof entry === 'object' &&
                        entry !== null &&
                        typeof entry.name === 'string' &&
                        typeof entry.phone === 'string'
                    );
                } catch (_err) {
                    return [];
                }
            }

            function saveSignups(data) {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    return true;
                } catch (_err) {
                    console.warn('Could not save to localStorage.');
                    return false;
                }
            }

            // EXERCISE 4: Validation function with regex
            function validate(name, phone) {
                if (name.length < 2) {
                    return 'Please enter your full name (at least 2 characters).';
                }
                if (!PHONE.test(phone)) {
                    return 'Enter a valid Ethiopian phone number (e.g. 0912345678 or +251912345678).';
                }
                return ''; // Valid
            }

            // UI update functions (EXERCISE 6)
            function updateUI() {
                const signups = loadSignups();
                countNumber.textContent = signups.length;
                displayEntries(signups);
            }

            function displayEntries(signups) {
                if (signups.length === 0) {
                    entriesList.innerHTML = '';
                    return;
                }
                let html = '<ul style="padding-left: 1.2rem; margin-top: 0.5rem;">';
                signups.forEach((entry, index) => {
                    html += `<li>${index + 1}. ${entry.name} — ${entry.phone}</li>`;
                });
                html += '</ul>';
                entriesList.innerHTML = html;
            }

            function setError(message) {
                errorArea.textContent = message;
                nameInput.classList.toggle('error-input', Boolean(message));
                phoneInput.classList.toggle('error-input', Boolean(message));
                successArea.textContent = '';
            }

            function setSuccess(message) {
                successArea.textContent = message;
                errorArea.textContent = '';
                nameInput.classList.remove('error-input');
                phoneInput.classList.remove('error-input');
            }

            function clearForm() {
                nameInput.value = '';
                phoneInput.value = '';
                nameInput.focus();
            }

            // EXERCISE 3 & 4: Form submit handler with validation
            form.addEventListener('submit', (e) => {
                e.preventDefault(); // EXERCISE 3: Stop page reload

                // EXERCISE 3: Read and trim values
                const name = nameInput.value.trim();
                const phone = phoneInput.value.trim();

                // EXERCISE 4: Validate
                const error = validate(name, phone);
                if (error) {
                    setError(error);
                    return;
                }

                // EXERCISE 6: On success, save to localStorage
                const signups = loadSignups();
                const newEntry = {
                    name: name,
                    phone: phone,
                    timestamp: Date.now()
                };
                signups.push(newEntry);
                saveSignups(signups);

                // Update UI
                updateUI();
                setSuccess('Signed up successfully!');
                clearForm();
            });

            // EXERCISE 6: Clear all entries
            clearAllBtn.addEventListener('click', () => {
                if (confirm('Delete all signups?')) {
                    localStorage.removeItem(STORAGE_KEY);
                    updateUI();
                    setError('');
                    setSuccess('');
                    clearForm();
                }
            });

            // Clear error when user starts typing
            [nameInput, phoneInput].forEach((input) => {
                input.addEventListener('input', () => {
                    if (errorArea.textContent) {
                        setError('');
                    }
                    input.classList.remove('error-input');
                });
            });

            // EXERCISE 6: Initialize - restore count on page load
            updateUI();

            // Expose for console testing
            window.__exercise3to6 = { loadSignups, saveSignups, validate, PHONE };
        })();



        // CONSOLE TESTING

        console.log('=== Day 21 Exercises ===');
        console.log('Exercise 1: Theme toggle active. Click the toggle buttons.');
        console.log('Exercise 2: Use window.__exercise2.loadData() and .saveData()');
        console.log('Exercise 3-6: Signup form ready. Submit valid entries.');
        console.log('Test phone numbers: 0912345678, +251912345678');
        console.log('Test invalid: 12345, +251812345678');
        console.log('Current signups:', window.__exercise3to6?.loadSignups() || []);

        // Test Exercise 2 helpers
        if (window.__exercise2) {
            console.log('Exercise 2 test: loadData()', window.__exercise2.loadData());
        }