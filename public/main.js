const colorUrlLookUp = {
  blackShirt : 'img/tshirts-colors/tshirt-black.png',
  peachShirt : 'img/tshirts-colors/tshirt-peach.png',
  pearShirt : 'img/tshirts-colors/tshirt-pear.png'
}

const artUrlLookUp = {
  artworkOne : 'img/backgrounds/background-1.png',
  artworkTwo : 'img/backgrounds/background-2.png',
  artworkThree : 'img/backgrounds/background-3.png'
}

const accentUrlLookUp = {
  accentOne : 'img/foreground/foreground-1.png',
  accentTwo : 'img/foreground/foreground-2.png',
  accentThree : 'img/foreground/foreground-3.png'
}

const customUrlLookUp = {
  customOne :  document.querySelector(".customArtBox") ?document.querySelector(".customArtBox").style.backgroundImage : ""
}

// for art option swap
if (document.querySelector('.customArtBox')) {
  document.querySelector('.customArtBox').addEventListener("click", customOption)
}

function customOption () {
  console.log('hello')
  console.log('customUrlLookUp.customOne:', customUrlLookUp.customOne.split('"')[1])
  const customImgUrl = customUrlLookUp.customOne.split('"')[1]
  document.querySelector(".displayArt").src = customImgUrl
}


// for tshirt color option swap
document.querySelectorAll('#colorSection .tshirtOptions').forEach(element => {
  element.addEventListener("click", colorOptions)
})

function colorOptions () {
  const labelElement = this.parentNode
  const radioInput = labelElement.querySelector('input')
  const colorName = radioInput.value
  const tshirtUrl = colorUrlLookUp[colorName]
  document.querySelector(".displayShirt").src=tshirtUrl
}

// for art option swap
document.querySelectorAll('#artSection .tshirtOptions').forEach(element => {
  element.addEventListener("click", artOptions)
})

function artOptions () {
  const labelElement = this.parentNode
  const radioInput = labelElement.querySelector('input')
  const artName = radioInput.value
  const artUrl = artUrlLookUp[artName]
  document.querySelector(".displayArt").src=artUrl
}

// for art option swap
document.querySelectorAll('#accentSection .tshirtOptions').forEach(element => {
  element.addEventListener("click", accentOptions)
})

function accentOptions () {
  const labelElement = this.parentNode
  const radioInput = labelElement.querySelector('input')
  const artName = radioInput.value
  const artUrl = artUrlLookUp[artName]
  document.querySelector(".displayArt").src=artUrl
}

// for art option swap
document.querySelectorAll('#accentSection .tshirtOptions').forEach(element => {
  element.addEventListener("click", accentOptions)
})

function accentOptions () {
  const labelElement = this.parentNode
  const radioInput = labelElement.querySelector('input')
  const artName = radioInput.value
  const artUrl = artUrlLookUp[artName]
  document.querySelector(".displayArt").src=artUrl
}

// for accent option swap
document.querySelectorAll('#accentSection .tshirtOptions').forEach(element => {
  element.addEventListener("click", accentOptions)
})

function accentOptions () {
  const labelElement = this.parentNode
  const radioInput = labelElement.querySelector('input')
  const accentName = radioInput.value
  const accentUrl = accentUrlLookUp[accentName]
  document.querySelector(".displayAccents").src=accentUrl
}

let deleteBtn = document.getElementsByClassName("deleteBtn");

Array.from(deleteBtn).forEach(function(element) {
  element.addEventListener('click', function(){
    console.log('element.dataset.id:', element.dataset.id)
    const designId = element.dataset.id 

    fetch('/deleteDesign', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        designId : designId  
      })
    }).then(function (response) {
      console.log(response)
      window.location.reload()
    })
  })
})
