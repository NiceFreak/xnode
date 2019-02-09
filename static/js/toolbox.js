const log = console.log.bind(console, ">>>")

const e = (selector) => {
    return document.querySelector(selector)
}

const es = (selector) => {
    return document.querySelectorAll(selector)
}

const appendHtml = (element, html) => {
    element.insertAdjacentHTML('beforeend', html)
}

const back = () => {
    window.location.href = '/'
}
