const translations = {};
let originalTextsLoaded = false;

/**
 * Loads the original text content of elements marked for translation
 * into the 'translations' object. This is done only once.
 */
function loadOriginalTexts() {
    if (originalTextsLoaded) return; // Prevent re-loading if already done
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        // Prioritize innerText, then placeholder, then title attribute
        if (element.innerText !== undefined && element.innerText.trim() !== '') {
            translations[key] = element.innerText;
        } else if (element.hasAttribute('placeholder')) {
            translations[key] = element.getAttribute('placeholder');
        } else if (element.hasAttribute('title')) {
            translations[key] = element.getAttribute('title');
        }
    });
    originalTextsLoaded = true;
    console.log("Original texts loaded for translation.");
}

/**
 * Translates the page content based on the selected language.
 * It uses the Google Translate API (unofficially) for translation.
 */
async function translatePage() {
    const languageSelect = document.getElementById("languageSelect");

    if (!languageSelect) {
        console.warn("Element with ID 'languageSelect' not found. Translation functionality may not work as expected.");
        return;
    }

    const targetLang = languageSelect.value;
    console.log(`Attempting to translate to: ${targetLang}`);

    // If target language is English, restore original texts
    if (targetLang === 'en') {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                if (element.innerText !== undefined) {
                    element.innerText = translations[key];
                } else if (element.hasAttribute('placeholder')) {
                    element.setAttribute('placeholder', translations[key]);
                } else if (element.hasAttribute('title')) {
                    element.setAttribute('title', translations[key]);
                }
            }
        });
        console.log("Page restored to English.");
        return;
    }

    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    const translatePromises = [];

    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-translate');
        // Use the stored original text or current innerText if not stored
        const originalText = translations[key] || element.innerText;

        if (originalText.trim() === "") {
            console.log(`Element with data-translate='${key}' is empty, skipping translation.`);
            return;
        }

        // Construct the Google Translate API URL
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(originalText)}`;
        
        translatePromises.push(
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Check if translation data is valid
                    if (data && data[0] && data[0][0] && data[0][0][0]) {
                        const translatedText = data[0][0][0];
                        // Apply translated text to the appropriate attribute/content
                        if (element.innerText !== undefined) {
                            element.innerText = translatedText;
                        } else if (element.hasAttribute('placeholder')) {
                            element.setAttribute('placeholder', translatedText);
                        } else if (element.hasAttribute('title')) {
                            element.setAttribute('title', translatedText);
                        }
                    } else {
                        console.warn(`No valid translation found for key '${key}'.`);
                    }
                })
                .catch(error => console.error(`Translation error for key '${key}':`, error))
        );
    });

    // Wait for all translation promises to settle
    await Promise.allSettled(translatePromises);
    console.log(`All elements processed for translation to ${targetLang}.`);
}

// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const languageSelect = document.getElementById("languageSelect");

    loadOriginalTexts(); // Load original texts when the page loads

    if (languageSelect) {
        // Add event listener to the language selector for changes
        languageSelect.addEventListener("change", translatePage);
    } else {
        console.warn("languageSelect element not found. Translation functionality will not be active.");
    }
});
