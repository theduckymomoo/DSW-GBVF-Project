
function translateText() {
    var lang = document.getElementById("languageSelect").value;
    var elements = ["title", "description"];

    elements.forEach(function (id) {
        var text = document.getElementById(id).innerText;

        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById(id).innerText = data[0][0][0];
            })
            .catch(error => console.error("Translation error:", error));
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("languageSelect").addEventListener("change", translateText());
});
