const tables = document.querySelectorAll("#urlform table")

// specifies when a thing ends
const endCharacters = /([:.?!])/g
// specifies the stuff to take out
const remCharacters = /([|]{2})|([≥()])/g
// website check
const website = /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/g

for(let table of tables) {
    const tags = table.querySelectorAll("tbody tr td ul li")
    for(let tag of tags) {
        const state = {
            site: false,
        }
        const text = tag.querySelector("span").innerHTML.toLowerCase()
        if(text.length === 1 && text != "/") {
            tag.style.border = "5px solid red"
        }
        if(text.search(remCharacters) > -1 || text.search(website) > -1 || text.indexOf("home") > -1) {
            tag.style.border = "5px solid orange"
            state.site = true;
        }
        if(text.search(endCharacters) > -1 && !state.site) {
            tag.style.border = "5px solid yellow"
        }
    }
}