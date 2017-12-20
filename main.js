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
  'site',
  'e.o.',
  / [0 - 9] /g,
  /[^a-z /][ - ]/g,
]

const urlList = [
  'startpagina.nl',
  '2link.be',
  'uwpagina.nl',
  'links.nl',
  'allepaginas.nl',
  'linkspot.nl',
  'beginthier.nl',
  'linkexplorer.nl',
  'startje.be',
  'startpagina.net',
  'sitelinkje.nl',
  'webwinkelstart.nl',
  'webwinkelstart.be',
  'linkjespagina.nl',
  'onzestart.nl',
  'beginzo.nl',
  'bouwstartpagina.nl',
  'sexlinktoevoegen.nl',
  'pornokenner.nl',
  'adultlinks.nl',
  'startkwartier.nl',
  'startplezier.nl',
  'linkgoed.nl',
  'linkkwartier.nl',
  'zoekvinden.nl',
  'uwbegin.nl',
  'linksite.com',
  'links.biz',
  'expertpagina.nl',
  'expertpagina.be',
  'tipjes.nl',
  'linkwijzer.nl',
  'gigago.nl',
  'startuwpagina.nl',
  'jouwlinkhier.nl',
  'vindjeviahier.nl',
  'startmee.nl',
  'site-nl.nl',
  'zoekidee.nl',
  'topbegin.nl',
  'bestevanhetnet.nl',
  'web-directory.nl',
  'linkmee.nl',
  'websitelink.nl',
  'linktotaal.nl',
  'slimmestart.nl',
  'rtlplaza.nl',
  'vakantie-links.nl',
  'startje.com',
  'sexsite-nl.nl',
  'beginspot.nl',
  'sitepark.nl',
  'opdirectory.com',
  'ellysdirectory.com',
  'startzoeken.nl',
  'newwebdirectory.com',
  'maxlinks.org',
  'spelcasino.com',
  'starttopper.nl',
  'vinddirect.nl',
  'linkplein.net',
  'webgidsje.nl',
  'linkhotel.nl',
  'medischestartpagina.nl',
  'de-beste-informatie.nl',
  'benelinx.nl',
  'linkpaginas.nl',
  'pagina-start.com',
  'starthoekje.nl',
  'start-links.nl',
  'jouwbegin.nl',
  'web-directory.be',
  'linkdirectory.be',
  'zoekned.nl',
  'toplinkjes.nl',
  'favos.nl',
  'startsleutel.nl',
  'startee.nl',
  'startjenu.nl',
  'zoeklink.nl',
  'eigenstart.nl',
]

const removeOneList = [website, 'home']
const removeAllList = ['wiki']

function uncheck(tag) {
  setTimeout(() => {
    tag.parentElement.parentElement.parentElement.querySelector(
      `input[type="checkbox"]`,
    ).checked = false
  }, 15000)
}

function removeOne(tag) {
  const cross = tag.querySelector('.crossone')
  if (cross) {
    cross.click()
    uncheck()
  }
}

function removeAll(tag) {
  const cross = tag.querySelector('.crossall')
  if (cross) {
    cross.click()
    uncheck()
  }
}

// maken
const tables = document.querySelectorAll('#urlform table')

tables.forEach(table => {
  const tags = table.querySelectorAll('tbody tr td ul li')
  tags.forEach(tag => {
    const text = tag.querySelector('span').innerHTML.toLowerCase()

    // removeOne
    if (removeOneList.some(x => text.search(x) != -1)) {
      removeOne(tag)
    }
    // removeAll
    if (removeAllList.some(x => text.search(x) != -1)) {
      if (tag.parentElement.children.length > 0) {
        removeAll(tag.parentElement.children[0])
      }
    }

    // add the color stuff
    if (!tag.classList.contains('redbg')) {
      if (text.length === 1 && text != '/') {
        tag.style.border = '5px solid red'
      }
      if (text.search(remCharacters) > -1) {
        tag.style.border = '5px solid orange'
      }
      if (text.search(endCharacters) > -1) {
        tag.style.border = '5px solid yellow'
      }
    }
  })
})

const checkboxes = Array.from(
  document.querySelectorAll(
    `#urlform table tbody tr td input[type="checkbox"]`,
  ),
)
// // doesn't Work
// checkboxes.forEach(x => {
//   x.addEventListener('change', e => console.log(e))
// })

// very bad way to do this but could't find a better one
let counterElem
if (tables.length > 0) {
  counterElem = document.createElement('div')
  counterElem.style =
    'position: fixed; top: 1.5em; right: 1.5em; font-size: 3rem; background: #fff; text-align: center; padding: 0.5rem 1rem;'
  document.body.appendChild(counterElem)
  counter()
}
function counter() {
  counterElem.innerHTML = checkboxes.filter(x => x.checked).length
  requestAnimationFrame(counter)
}

// klaar zetten
const urlForm = document.querySelector('textarea[name="urls"]')
if (urlForm) {
  urlForm.addEventListener('change', () => {
    urlForm.value = getRandomArrItems(urlList)
      .map(x => `${urlForm.value}.${x}`)
      .join('\r\n')
  })
}

const h3Selector = document.querySelector('input[value="h3"]')
if (h3Selector) {
  h3Selector.checked = false
}

const voor = document.querySelector('select#voor')
if (voor) {
  voor.selectedIndex = 1
  voor.dispatchEvent(new Event('change', { bubbles: true }))
}

const urlTrs = document.querySelectorAll('table tbody tr')
let items = 0
for (let row of urlTrs) {
  const textElem = row.querySelector('.nameselector')
  if (textElem) {
    const text = textElem.innerHTML.toLowerCase()
    if (removeList.some(x => text.search(x) != -1)) {
      row.querySelector('.btn-warning').click()
    } else {
      items++
    }
  }
}

while (items >= 26) {
  let row = urlTrs[Math.floor(Math.random() * items)]
  if (row) {
    setTimeout(() => {
      row.querySelector('.btn-warning').click()
    }, items * 2 + 100)
    items--
  }
}

function getRandomArrItems(arr, num = 6) {
  output = []
  for (let i = 0; i < num; i++) {
    output.push(arr[Math.floor(Math.random() * arr.length)])
  }
  return output
}
