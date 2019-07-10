const insertCss = () => {
  const css = `.error_choose {
    display: none !important;
  }`
  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')

  head.appendChild(style)
  style.type = 'text/css'
  style.appendChild(document.createTextNode(css))
}

const trainingKey = 'training'
const checkedClass = 'checkbox_active'
const detectIsTraining = () => {
  return JSON.parse(localStorage.getItem(trainingKey))
}
const setTraining = isTraining => {
  localStorage.setItem(trainingKey, isTraining)
}

(() => {
  insertCss()
  
  const inputTraining = document.querySelector('.checkt_sub > label:first-of-type input')
  const isTraining = detectIsTraining()
  
  document.querySelector('.checkt_sub > label:first-of-type span').classList[isTraining ? 'add' : 'remove'](checkedClass)
  inputTraining.checked = isTraining
  
  document.querySelector('.use-option').addEventListener('click', () => {
    setTraining(inputTraining.checked)
  })
  
  const showTips = () => [].slice.call(document.querySelectorAll('.reply_ticket')).forEach(item => { 
    if (item.style['border-color'] !== '' && isTraining) {
      item.style.display = 'block'
    }
  })
  
  ;[].slice.call(document.querySelectorAll('.label_raio')).forEach(label => label.addEventListener('click', showTips))

  const element = document.querySelector('.subscriptions_not')
  if (element) {
    element.classList.add('subscriptions_not_active')
  }
})()
