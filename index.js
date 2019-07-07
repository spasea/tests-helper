const showTips = () => [].slice.call(document.querySelectorAll('.reply_ticket')).forEach(item => { 
  if (item.style['border-color'] !== '') {
    item.style.display = 'block'
  }
})

document.addEventListener('DOMContentLoaded', () => {
  ;[].slice.call(document.querySelectorAll('.label_raio')).forEach(label => label.addEventListener('click', showTips))
})
