// Select the element1
const element1 = document.querySelector("body > div.js-rootresizer__contents.layout-with-border-radius > div.layout__area--center.no-border-bottom-right-radius.no-border-top-right-radius");

// Apply the styles
if (element1) {
  element1.style.position = 'absolute';
  element1.style.top = '0px';
  element1.style.left = '0';
  element1.style.width = '100vw';
  element1.style.height = '100vh';
}
document.querySelector("#overlap-manager-root").style.zIndex  = -1
const element2 =  document.querySelector("body > div.js-rootresizer__contents.layout-with-border-radius > div.layout__area--center.no-border-bottom-right-radius.no-border-top-right-radius > div.chart-container.single-visible.top-full-width-chart.active")
// Apply the styles
if (element2) {
    element1.style.width = '100%'
    element1.style.height = '100%';
  }
