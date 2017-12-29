try {
// similarity percentage
const SIMILARITY = 0.85

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
  'ov',
  'openbaar vervoer',
  'wiki',
  'regio ',
  'netnr ',
  'gerelat',
  /\s[0-9]$/g,
  /\s[a-z]$/g,
  /\s[A-Z]$/g,
  /\s[0-9]-[0-9]/g,
  /\s[a-z]-[a-z]/g,
  /\s[A-Z]-[A-Z]/g,
  /[^a-z /][ - ]/g,
  "gratis advies",
]

const exactRemoveList = [
  'amsterdam',
  'rotterdam',
  'den haag',
  'utrecht',
  'eindhoven',
  'tilburg',
  'groningen',
  'almere',
  'breda',
  'nijmegen',
  'enschede',
  'apeldoorn',
  'haarlem',
  'amersfoort',
  'zaanstad',
  'arnhem',
  'haarlemmermeer',
  "'s hertogenbosch",
  'zoetermeer',
  'zwolle',
  'maastricht',
  'leiden',
  'dordrecht',
  'ede',
  'emmen',
  'westland',
  'venlo',
  'delft',
  'deventer',
  'leeuwarden',
  'alkmaar',
  'sittard-geleen',
  'helmond',
  'heerlen',
  'hilversum',
  'oss',
  'amstelveen',
  'súdwest-fryslân',
  'hengelo',
  'purmerend',
  'roosendaal',
  'schiedam',
  'lelystad',
  'alphen aan den rijn',
  'leidschendam-voorburg',
  'almelo',
  'spijkenisse',
  'hoorn',
  'gouda',
  'vlaardingen',
  'assen',
  'bergen op zoom',
  'capelle aan den ijssel',
  'veenendaal',
  'katwijk',
  'zeist',
  'nieuwegein',
  'roermond',
  'den helder',
  'doetinchem',
  'hoogeveen',
  'terneuzen',
  'middelburg',
  'drente',
  'den bosch',
  'friesland',
  'limburg',
  'media',
  'muziek',
  'reizen',
  'boot',
  'landen',
  'boten',
  'boeken',
  'antiek',
  'gerelateerd',
  'sport',
  'webcams',
  'werken',
  'sport',
  'discussie',
  'forum',
  'veiligheid',
  'vacatures',
  'doe het zelf',
  'diy',
  'aanbod',
  'financieel',
  'internet',
  'internet winkels',
  'online winkels',
  'online shop',
  'internet online',
  'ontslag',
  'het weer',
  'buitenland',
  'info en nieuws',
  'info',
  'nieuws',
  'zoeken',
  'kleding',
  'feest',
  'party',
  'feest en party',
  'zeilen',
  'zaken doen',
  'lastminutes',
  'autorijden',
  'aanraders',
  'magazines (online)',
  'magazines',
  'magazine',
  'online kopen',
  'online',
  'er op uit!',
  'er op uit',
  'geschiedenis',
  'jargon',
  'review',
  'reviews',
  'begrippen',
  'achtergrond informatie',
  'informatie',
  'info',
  'reclame',
  'accesoires',
  'merken',
  'onderhoud',
  'tijdschriften',
  'training',
  'speciaalzaken',
  'boeken en tijdschriften',
  'partners',
  'partner',
  'documentatie',
  'glasbedrijven',
  'glas bedrijven',
  'organisaties',
  'regeling en wetten',
  'regeling',
  'wetten',
  'recensies',
  'branche informatie',
  'sporten',
  'onderzoeken',
  'achtergronden',
  'animaties',
  'glitter',
  'autobedrijven',
  'financien',
  'banken',
  'banken / financien',
  'cursus',
  'electronica / hardware',
  'electronica',
  'hardware',
  'fietswinkel',
  'homepages',
  'juridisch',
  'rijscholen',
  'tips',
  'transport / vervoer',
  'transport',
  'vervoer',
  'werk en opleiding',
  'werk',
  'opleiding',
  'wonen / huis en tuin',
  'wonen',
  'huis en tuin',
  'huis',
  'tuin',
  'platinum',
  'herinneren',
  'internationaal',
  'hulpmiddelen',
  'kinderen',
  'netwerken',
  'organisaties',
  'appartementen',
  'auto verhuur',
  'auto',
  'verhuur',
  'kitesurfen',
  'recreatie en sport',
  'recreatie',
  'sport',
  'surfen',
  'weer en klimaat',
  'weer',
  'klimaat',
  'zorg en welzijn',
  'zorg',
  'welzijn',
  "actueel",
  "opleidingen",
  "opleiding",
  "in de media",
  "media",
  "meer",
  "meer startkabel.nl",
  "contact",
  "tip",
  "accessoires",
  "club",
  "clubs",
  "software",
  "twitter",
  "facebook",
  "drenthe",
  "holten",
  "holterberg",
  "hongarije",
  "noord brabant",
  "noord holland",
  "spanje",
  "texel",
  "vlieland",
  "winkel",
  "winkels",
  "zeeland",
  "terschelling",
  "fietsen",
  "belgie",
  "arrangementen",
  "denemarken",
  "oostenrijk",
  "winkels buitenland",
  "chatten !!",
  "columns",
  "-tips!!-"
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
const removeAllList = [
  'wiki',
  /([A-Z]){4,}/g,
  'youtube',
  'facebook',
  'twitter',
  'encyclo',
  'definitie',
  'betekenis',
  'vertaling',
  'nu.nl',
  'ad.nl',
  'pen.nl',
  'telegraaf.nl',
  'rtv',
  '9292',
]

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
  tags.forEach((tag, i) => {
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
// remove ending or beginning remCharacters
// for (let i = 0; i < 3; i++) {
//   // do three passes
//   tables.forEach(table => {
//     const rows = table.querySelectorAll('tbody tr td ul')
//     rows.forEach((row, i) => {
//       const items = row.querySelectorAll('li:not(.redbg) span')

//       if (items[0].innerHTML.search(remCharacters) > -1) {
//         removeOne(items[0].parentElement)
//       }

//       if (items[items.length - 1].innerHTML.search(remCharacters) > -1) {
//         removeOne(items[items.length - 1].parentElement)
//       }
//     })
//   })
// }

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
  validator()
}

function validator() {
  counterElem.innerHTML = checkboxes.filter(x => x.checked).length // update counter

  // doubles check
  tables.forEach(table => {
    const rows = table.querySelectorAll('tbody tr td ul')
    const links = []
    rows.forEach((row, i) => {
      if (
        row.parentElement.parentElement.querySelector(`input[type="checkbox"]`)
          .checked
      ) {
        const text = Array.from(row.querySelectorAll('li:not(.redbg) span'))
          .map(x => x.innerHTML)
          .reduce((p, n) => ` ${p} ${n}`, '')
          .trim()
          .toLowerCase()

        // if is not needed, but if someone fackes up it doesn't stop
        if (text != '') {
          links.push({
            text,
            i,
            matched: false,
          })
        }
      } else {
        row.parentElement.style.border = ''
      }
    })
    links.forEach(x => {
      links.filter(f => f.i != x.i).forEach(y => {
        if (similarity(y.text, x.text) > SIMILARITY) {
          x.matched = y.matched = true
          rows[y.i].parentElement.style.border = rows[
            x.i
          ].parentElement.style.border =
            '5px solid red'
        }

        if (!x.matched) {
          rows[x.i].parentElement.style.border = ''
        }
        if (!y.matched) {
          rows[y.i].parentElement.style.border = ''
        }
      })
    })
  })

  requestAnimationFrame(validator)
}

/*
 *
 *
 *
 *
 *
 * klaar zetten
*/
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
  voor.dispatchEvent(new Event('change', { bubbles: true })) // or it won't fire event
}

const urlTrs = Array.from(document.querySelectorAll('table.bdtable tbody tr'))
for (let i = 0; i < 5; i++) {
  urlTrs.forEach((row, index) => {
    const textElem = row.querySelector('.nameselector')
    if (textElem) {
      const text = textElem.innerHTML.toLowerCase()
      console.log(index);
      console.log(removeList.some(x => console.log(text.search(x), x, text)))
      if (removeList.some(x => text.search(x) > -1)) {
        row.querySelector('.btn-warning').click()
        urlTrs.splice(index, 1)
        console.log(urlTrs.length, 'remove')
      } else if (exactRemoveList.some(x => text == x.toLowerCase())) {
        row.querySelector('.btn-warning').click()
        console.log(urlTrs.length, 'exact')
        urlTrs.splice(index, 1)
      }
    }
  })
}
console.log(urlTrs.length)
while (urlTrs.length >= 26) {
  console.log(urlTrs.length)
  const index = Math.floor(Math.random() * urlTrs.length)
  let row = urlTrs[index]
  urlTrs.splice(index, 1)
  if (row) {
    console.log(row)
    row.querySelector('.btn-warning').click()
  }
}

function getRandomArrItems(arr, num = 24) {
  output = []
  const used = []
  for (let i = 0; i < num; i++) {
    let num
    // remove doubles
    while (used.some(x => x === num)) {
      num = Math.floor(Math.random() * arr.length)
    }
    output.push(arr[num])
    used.push(num)
  }
  return output
}

function similarity(s1, s2) {
  var longer = s1
  var shorter = s2
  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }
  var longerLength = longer.length
  if (longerLength == 0) {
    return 1.0
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  )
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase()
  s2 = s2.toLowerCase()

  var costs = new Array()
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j
      else {
        if (j > 0) {
          var newValue = costs[j - 1]
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}
} catch(error) {
  console.log(error)
}