/**
 * File for setting up the environment. Please do not modify.
 */

import "./css/readonly.css"
import "./css/style.css"

if (module.hot) {
  module.hot.accept()
}

const navIcon = document.querySelector('.nav-icon')
const navItems = document.querySelector('.nav-items')

navIcon.addEventListener('click', (event) => {
  event.preventDefault()
  const isExpanded = navItems.classList.contains('expanded')

  if (isExpanded) {
    navItems.classList.remove('expanded')
    navItems.classList.add('collapsed')
  } else {
    navItems.classList.remove('collapsed')
    navItems.classList.add('expanded')
  }
})

console.log('DOM Loaded')
