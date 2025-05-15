// Function to change the language
function changeLanguage(lang) {
    // Set the HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update the language badge
    const languageNames = {
        'en': 'English',
        'af': 'Afrikaans',
        'zu': 'isiZulu',
        'xh': 'isiXhosa',
        'st': 'Sesotho',
        'tn': 'Setswana',
        'nso': 'Sepedi',
        'ts': 'Xitsonga',
        'ss': 'siSwati',
        've': 'Tshivenda',
        'nr': 'isiNdebele'
    };
    
    document.querySelector('.current-language').textContent = languageNames[lang];
    
    // Save the language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize language from saved preference or default to English
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    document.getElementById('language-select').value = savedLanguage;
    changeLanguage(savedLanguage);
});