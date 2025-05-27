const translations = {};
let originalTextsLoaded = false;

function loadOriginalTexts() {
    if (originalTextsLoaded) return;
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (element.innerText !== undefined && element.innerText.trim() !== '') {
            translations[key] = element.innerText;
        } else if (element.hasAttribute('placeholder')) {
            translations[key] = element.getAttribute('placeholder');
        } else if (element.hasAttribute('title')) {
            translations[key] = element.getAttribute('title');
        }
    });
    originalTextsLoaded = true;
}

async function translatePage() {
    const languageSelect = document.getElementById("languageSelect");

    if (!languageSelect) {
        console.warn("Element with ID 'languageSelect' not found. Translation functionality may not work as expected.");
        return;
    }

    const targetLang = languageSelect.value;
    
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
        const originalText = translations[key] || element.innerText;

        if (originalText.trim() === "") {
            console.log(`Element with data-translate='${key}' is empty, skipping translation.`);
            return;
        }

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
                    if (data && data[0] && data[0][0] && data[0][0][0]) {
                        const translatedText = data[0][0][0];
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

    await Promise.allSettled(translatePromises);
    console.log(`All elements processed for translation to ${targetLang}.`);
}

document.addEventListener("DOMContentLoaded", function () {
    const languageSelect = document.getElementById("languageSelect");

    loadOriginalTexts();

    if (languageSelect) {
        languageSelect.addEventListener("change", translatePage);
    } else {
        console.warn("languageSelect element not found. Translation functionality will not be active.");
    }

    const emergencyBtn = document.getElementById("emergencyBtn");
    if (emergencyBtn) {
        emergencyBtn.addEventListener("click", function() {
            window.location.replace("https://www.google.com/search?q=weather"); 
        });
    }

    const storyButton = document.getElementById("Story");
    if (storyButton) {
        storyButton.addEventListener("click", function() {
            window.location.href = "legal.html"; 
        });
    }

    const learnButton = document.getElementById("Learn");
    if (learnButton) {
        learnButton.addEventListener("click", function() {
            window.location.href = "finalChat.html"; 
        });
    }
});