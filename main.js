/*********
 Variables
*********/

const tables = document.querySelectorAll('#urlform table')

// specifies when a thing ends
const endCharacters = /([:.?!])/g
// specifies the stuff to take out
const remCharacters = /([|]{2})|([≥()])/g
// website check
const website = /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/g

const removeList = [
  'algeme',
  'link',
  'adver',
  'pagina',
  'forum',
  'over',
  'diver',
  'zoekmachine',
  'dochter',
  / [0 - 9] /g,
  /[^a-z /][ - ]/g,
]

<<<<<<< HEAD
// for (let table of tables) {
//   const tags = table.querySelectorAll('tbody tr td ul li')
//   for (let tag of tags) {
//     const state = {
//       site: false,
//     }
//
//     const text = tag.querySelector('span').innerHTML.toLowerCase()
//     if (text.length === 1 && text != '/') {
//       tag.style.border = '5px solid red'
//     }
//
//     if (
//       text.search(remCharacters) > -1 ||
//       text.search(website) > -1 ||
//       text.indexOf('home') > -1
//     ) {
//       tag.style.border = '5px solid orange'
//       state.site = true
//     }
//
//     if (text.search(endCharacters) > -1 && !state.site) {
//       tag.style.border = '5px solid yellow'
//     }
//   }
// }

//adds addEventListener onload
=======
/******************
 On load functions
******************/

// runs on load
// creates coloured tags
for (let table of tables) {
  const tags = table.querySelectorAll('tbody tr td ul li')
  for (let tag of tags) {
    const state = {
      site: false,
    }
    const text = tag.querySelector('span').innerHTML.toLowerCase()
    if (text.length === 1 && text != '/') {
      tag.style.border = '5px solid red'
    }
    if (
      text.search(remCharacters) > -1 ||
      text.search(website) > -1 ||
      text.indexOf('home') > -1
    ) {
      tag.style.border = '5px solid orange'
      state.site = true
    }
    if (text.search(endCharacters) > -1 && !state.site) {
      tag.style.border = '5px solid yellow'
    }
  }
}

// runs on load
// adds urls to the pages
>>>>>>> be1d16daa5195f4e57f66baac6a829888fbc4e32
const urlForm = document.querySelector('textarea[name="urls"]')
if (urlForm) {
  urlForm.addEventListener('change', () => {
    const old = urlForm.value
    urlForm.value = `${old}.uwpagina.nl\r\n${old}.links.nl\r\n${old}.allepaginas.nl\r\n${old}.beginzo.nl\r\n${old}.linkpaginas.nl\r\n${old}.startsleutel.nl\r\n${old}.zoeklink.nl\r\n${old}.eigenstart.nl\r\n`
  })
}

// runs onload
// unchecks h3 selector checkbox
const h3Selector = document.querySelector('input[value="h3"]')
if (h3Selector) {
  h3Selector.checked = false
}

// runs onLoad
// filters items list on unwanted items
const urlTrs = document.querySelectorAll('table tbody tr')
let items = 0
for (let row of urlTrs) {
  const textElem = row.querySelector('.nameselector')
  if (textElem) {
    const text = textElem.innerHTML.toLowerCase()
    if (removeList.some(x => text.search(x) != -1)) {
      console.log('remove: ', text)
      row.querySelector('.btn-warning').click()
    } else {
      items++
    }
  }
}

// runs on load
// reduces page categories to 25
while (items >= 26) {
  let row = urlTrs[Math.floor(Math.random() * items)]
  if (row) {
    setTimeout(() => {
      row.querySelector('.btn-warning').click()
    }, items * 2 + 100)
    console.log(items--)
  }
}
