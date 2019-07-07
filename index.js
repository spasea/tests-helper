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

(() => {
  const isTraining = (() => {
    const trainingProp = location.search.split('&').find(item => item.includes('training'))
    return trainingProp ? trainingProp.split('=')[1] === 'on' : false
  })()
  
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
  
  insertCss()
})()
