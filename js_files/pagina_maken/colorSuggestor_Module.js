const colorSuggestor_Module = (function (settings) {
    const tags = document.querySelectorAll('#urlform table tbody tr td ul li')

    if (settings.methodEnabled == true) {
        for (let tag of tags) {
            const state = {
                site: false,
            }
            const text = tag.querySelector("span").innerHTML.toLowerCase();

            if (settings.red == true) {
                if (text.length === 1 && text != '/') {
                    tag.style.border = '5px solid #272'
                }
            }

            if (settings.orange == true) {
                if (
                    text.search(remCharacters) > -1 ||
                    text.search(website) > -1 ||
                    text.indexOf('home') > -1
                ) {
                    tag.style.border = '5px solid orange'
                    state.site = true
                }
            }

            if (settings.yellow == true) {
                if (text.search(endCharacters) > -1 && !state.site) {
                    tag.style.border = '5px solid yellow'
                }
            }
        }
    }
})(programSettings.linkColourer);
