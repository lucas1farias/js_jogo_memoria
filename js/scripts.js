

function shuffleArrayIndexes({targetEl}) {
  targetEl.sort(function() {return Math.random() - 0.5})
}

function tagMaker({tagName, className}) {
  const newTag = document.createElement(tagName)
  newTag.className = className
  return newTag
}

function createMultipleTags({motherTag, targetEl}) {
  for(let i = 0; i < targetEl.length; i++) {
    let firstDiv = tagMaker({tagName: 'div', className: 'box'})
    let secondDiv = tagMaker({tagName: 'div', className: 'card'})
    let thirdDiv = tagMaker({tagName: 'div', className: 'front'})
    let fourthDiv = tagMaker({tagName: 'div', className: 'back'})

    firstDiv.appendChild(secondDiv)
    secondDiv.appendChild(thirdDiv)
    secondDiv.appendChild(fourthDiv)
    motherTag.appendChild(firstDiv)
    document.body.appendChild(motherTag)
  }
}

function setCardsBackground({motherTag, names}) {
  // Equivalente em python: for i, element in enumerate(motherTag)
  motherTag.forEach(function(element, i) {
    element.setAttribute('data-character', `${names[i]}`)
    element.lastElementChild.style.backgroundImage = `url(../images/${names[i]}.png)`
    element.lastElementChild.style.backgroudSize = 'cover'
    element.lastElementChild.style.position = 'center'
  })
}

function flipCards({targetEl, counter, cssClass}) {
  // Monitoramento dos cartões contínuo
  
  
  // Cada cartão recebe evento de clique
  targetEl.forEach(element => {
    element.addEventListener('click', () => {
      /* #ab_3: Na ausência, apenas um cartão vira */
      if(element.className.includes(cssClass)) {
        return
      }
      
      /* #ab_3: Cartão 1 não clicado, ou seja: cartão pode ser virada + registro da carta em "card1" */
      if(card1 === '') {
        element.classList.add(cssClass)
        card1 = element
        card1Label = card1.getAttribute('data-character')
      } 
      
      /* #ab_3: 
      Cartão 1 clicado (cartão virado) + registro da carta em "card1" 
      Cartão 2 não clicado, ou seja: cartão pode ser virado + registro de carta em "card2"
      */
      else if (card2 === '') {
        element.classList.add(cssClass)
        card2 = element
        card2Label = card2.getAttribute('data-character')
      }
      
      /* #ab_4: Erro */
      if (card1 != '' & card2 != '' & card1Label != card2Label) {
        setTimeout(() => {
          card1.classList.remove(cssClass)
          card2.classList.remove(cssClass)
          /* Após todas as etapas de verificação, os dados das cartas devem ser apagados */
          dataWipe()
        }, 700)
      } 
      
      /* #ab_4: Acerto (carta formatada somente na frente "lastElementChild") */
      else if (card1 != '' & card2 != '' & card1Label === card2Label) {
        setTimeout(() => {
          card1.lastElementChild.classList.add('disabled-card')
          card2.lastElementChild.classList.add('disabled-card')
          /* Após todas as etapas de verificação, os dados das cartas devem ser apagados */
          dataWipe()
        }, 700)
      }
    })
  })

    // Cada cartão vira e desvira após .7 segundos
    // targetEl[i].classList.add(cssClass)
    // setTimeout(() => {
    //   targetEl[i].classList.remove(cssClass)
    // }, 700)
}

/* #ab_5: A pontuação é determina pela quantidade de tags que recebem a classe css passada em "cssClass" */
function displayCurrentScore({cssClass, elementForScore}) {
  /* Atualização em tempo real */
  setInterval(() => {
    let score = document.querySelectorAll(cssClass).length
    /* Exibir pontuação no html, acima do jogo */ 
    elementForScore.textContent = score
  }, 50)
}

/* #ab_6 */
function checkVictory({reference, cardsAmount}) {
  // Se há 20 cartas com a classe "disabled-card"
  if (reference == cardsAmount) {
    setTimeout(() => {
      alert('Desafio completado!')
    }, 1000)
    return true
  } 
  // Ainda não há 20
  else {
    return false
  }
}

/* #ab_2: Vars essenciais que recebem dados das cartas clicadas/viradas */
let card1 = ''
let card2 = ''
let card1Label = ''
let card2Label = ''

function dataWipe() {
  card1 = ''
  card2 = ''
  card1Label = ''
  card2Label = ''
}

let box = document.querySelector('.container')

/* #aa_1 */
const chars = [
  'beth', 'jerry', 'jessica', 'meeseeks', 'morty',
  'pessoa-passaro', 'pickle-rick', 'rick', 'scroopy', 'summer'
]

/* #aa_2 */
let charsClone = [...chars, ...chars]

/* #aa_3 */
shuffleArrayIndexes({targetEl: charsClone})

/* #aa_4: Criação de todos os cartões na tag <body> */
createMultipleTags({motherTag: box, targetEl: charsClone})

/* #aa_5 */
let card = document.querySelectorAll('.card')

// let numbers = [...Array(charsClone.length).keys()]
// for(let i = 0; i < numbers.length; i++) {
//   card[i].className = `${card[i].className} c${numbers[i]}`
//   console.log(card[i].className)
// }

/* #aa_6 */
setCardsBackground({motherTag: card, names: charsClone})

/* #aa_7 */
flipCards({targetEl: card, counter: charsClone, cssClass: 'flip'})

/* #ab_5: Var instanciada é mandatória para o último passo */
let pointsTag = document.querySelector('.score')
displayCurrentScore({cssClass: '.disabled-card', elementForScore: pointsTag})

/* #ab_6: Para o funcionamento da função, "points" precisa de constante atualização */
let endGameWatcher = setInterval(() => {
  let points = document.querySelectorAll('.disabled-card').length
  /* #ab_7 */
  let victoryConfirmed = checkVictory({reference: points, cardsAmount: charsClone.length})
  /* Fim do jogo: sem isso, o alerta ficaria infinitamente sendo chamado */
  if (victoryConfirmed) {
    clearInterval(endGameWatcher)
  }
}, 1000)
