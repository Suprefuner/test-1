
  const caid = "#rlcid-content-testing-page-two"
  const rlHelperPos = {
    x: 0,
    y: 0
  }
  let isShowingAB = false
  let isShowingFont = false

  const helperList = [
    {
      name: "AB tagging",
      fn: "toggleAB",
    },
    {
      name: "font family",
      fn: "toggleFont",
    },
  ]

  // using 'load' event instead of 'document ready' to make sure the font family is the final render one
  window.addEventListener('load', function () {
    helperInit()
    helperButtonInit()
    bindEvent()
  })

  function helperInit() {
    $('<style>')
      .prop('type', 'text/css')
      .html(`
                .rlc-dev-helper {
                    --_offset: 20px;
                    --_btn-size: 80px;

                    position: fixed;
                    left: var(--_offset);
                    bottom: var(--_offset);
                    z-index: 99;
                }

                button.rlc-btn--dev {
                    width: var(--_btn-size);
                    height: var(--_btn-size);
                    margin-top: 0;
                    padding: 6px;

                    background-color: white;
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(0, 0, 0, .2);
                    transition: all .3s;
                }

                .rlc-dev-helper[data-status='on'] button.rlc-btn--dev,
                button.rlc-btn--dev:hover{
                    box-shadow: 0 0 0 5px #041e3a
                }

                button.rlc-btn--dev .rlc-image {
                    height: 100%;
                    object-fit: contain;
                }

                ul.rlc-dev-menu {
                    width: 200px;
                    list-style: none !important;
                    margin: 0;
                    padding: 6px;

                    position: absolute;
                    bottom: 0;
                    left: 0;
                    transform: translateY(calc(var(--_btn-size) * -1 - 16px));

                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, .5);
                }

                .rlc-dev-helper[data-status='off'] .rlc-dev-menu {
                    display: none;
                }

                .rlc-dev-item+.rlc-dev-item {
                    margin-top: 6px;
                }

                .rlc-dev-item {
                    position: relative;
                    padding: 4px 12px;

                    color: white;
                    font-size: 16px;
                    line-height: 2;

                    background-color: rgba(0, 0, 0, .5);
                    cursor: pointer;
                    border-radius: 6px;
                    transition: background-color 0.3s ease;
                }

                li.rlc-dev-item{
                    list-style-type: none !important;
                }

                .rlc-dev-item::before{
                    content: attr(data-status);
                }

                .rlc-dev-item::marker {
                    content: "";
                    display: none !important;
                }

                .rlc-dev-item[data-state='on'],
                .rlc-dev-item:hover {
                    background-color: #041e3a;
                }
                .rlc-ab-container {
                    max-width: 500px;
                    min-width: 240px;
                    height: max-content;
                    padding: 10px;  

                    position: absolute;
                    bottom: 100%;
                    left: 50%;

                    background-color: rgba(0,0,0,.3);
                    border-radius: 10px;
                    border: 1px solid #041e3a;
                    backdrop-filter: blur(3px);

                    font-family: "Founders Grotesk text Regular", Helvetica, Arial, sans-serif !important;
                    font-size: 14px;
                    color: white;
                    text-align: left;
                    text-transform: none;
                    overflow-wrap: break-word; 

                    pointer-events: all;
                    transition: background-color 0.3s;
                }

                .rlc-ab-container:hover{
                    background-color: black;
                    color: white;
                    z-index: 99;
                }

                .rlc-pillbutton .rlc-ab-container:hover .rlc-textgroup .rlc-ab-font{
                    color: white !important;
                }

                .rlc-slide .rlc-ab-container{
                    max-width: 200px;
                }

                .rlc-ab-container * {
                    text-transform: unset;
                }

                a .rlc-ab-container,
                .rlc-pillbutton .rlc-ab-container,
                .rlc-linecta .rlc-ab-container {
                    top: unset;
                    left: 0;
                    bottom: 100%;
                    transform: translateY(-16px);
                }

                .rlc-hotspot .rlc-ab-container{
                    top: 20px;
                    left: 100px;
                    transform: unset;
                }

                .rlc-bg_link .rlc-ab-container{
                    top: 20px;
                    left: 20px;
                    transform: unset;
                }

                .rlc-cards .rlc-ab-container{
                  left: unset;
                  right: 20px;
                }

                :where(.rlc-copygroup, .rlc-textgroup, .rlc-intro) > .rlc-ab-container {
                    transform: translate(-50%, -12px);
                }

                :where(.rlc-copygroup, .rlc-textgroup, .rlc-intro).rlc-all-text-left > .rlc-ab-container{
                  transform: translate(0, -12px);
                  left: 0;
                }

                .rlc-ab{
                    color: black;
                }

                .rlc-ab-font{
                    color: rgba(255,255,255,.5)
                    font-size: 12px;
                }
            `)
      .appendTo('head');


    generateHotspotABContainer()
    generateBGLinkABContainer()
    generateCTAABContainer()

    $(`
            ${caid} *:has(>.rlc-copygroup), 
            ${caid} *:has(>.rlc-textgroup), 
            ${caid} *:has(>.rlc-intro),
            ${caid} *:has(>.rlc-catslider-hd)
        `).each((i, container) => {
      let html = ''
      $(container).find('.rlc-copygroup, .rlc-textgroup, .rlc-textgroup-in, .rlc-intro, .rlc-catslider-hd').each((i, group) => {
        $(group).children('.rlc-sub, .rlc-title, .rlc-dek, .rlc-brand').each((i, el) => {
          if (
            $(el).is("a") ||
            $(el).html().includes("rlc-ab-container")
          ) return
          html += `
                        ${$(el).text()}:<br>
                        ${getFontFamily(el)}<br>
                        ---------------------------<br>
                    `
        })

        if (!html.trim()) return
        addPositionToEl(group)

        let additionalCSS = 'style="'
        if($(group).height() >= $(window).height() * 0.5){
          additionalCSS += 'top: 50%;'
        }

        if($(container).closest('.rlc-padding').length){
          additionalCSS += `margin-bottom: -${$(group).css('padding-top')};`
        }

        additionalCSS += '"'

        $(group).append(createABContainer(html, additionalCSS))
      })
    })

    $(`
      ${caid} .rlc-title:not(:where(.rlc-copygroup, .rlc-textgroup, .rlc-textgroup-in, .rlc-intro, .rlc-catslider-hd) .rlc-title),
      ${caid} .rlc-dek:not(:where(.rlc-copygroup, .rlc-textgroup, .rlc-textgroup-in, .rlc-intro, .rlc-catslider-hd) .rlc-dek)
    `).each((i, el) => {
      let html = ''
      const parent = $(el).parent()
      parent.children('.rlc-sub, .rlc-title, .rlc-dek, .rlc-brand').each((i, el) => {
        if (
          $(el).is("a") ||
          $(parent).html().includes("rlc-ab-container")
        ) return

        html += `
            ${$(el).text()}:<br>
            ${getFontFamily(el)}<br>
            ---------------------------<br>
        `
      })

      if (!html.trim()) return
      addPositionToEl(parent)
      $(parent).append(createABContainer(html, 'style="top: 0; left: 0;"'))
    })

    hideAB()
    hideFont()
  }

  function helperButtonInit() {
    $("#main #rl-content .secondary-content .open-html-content .content-asset .rlc-creative_v3").append(`
            <div class="rlc-dev-helper" data-status="off">
                <button class="rlc-btn--dev">
                    <img class="rlc-image" alt="Polo Ralph Lauren" loading="lazy"
                        src="https://staging-au.sfcc-ralphlauren-as.com/on/demandware.static/-/Library-Sites-RalphLauren_EU_Library/default/dwd5345650/img/Brand_Logo_Library/POLO/2021_polo_pony_navy.svg" />
                </button>

                <ul class="rlc-dev-menu">
                    ${generateDevItems(helperList)}
                </ul>
            </div>
        `)
  }

  function bindEvent() {
    $(document).on("click", ".rlc-btn--dev", function (e) {
      const devToolContainer = $(this).closest(".rlc-dev-helper")
      const isOn = devToolContainer.attr("data-status") === 'on'
      devToolContainer.attr("data-status", isOn ? 'off' : 'on')

      function detectClickOutside(e) {
        if (e.target.closest('.rlc-dev-helper')) return
        devToolContainer.attr("data-status", 'off')
      }

      isOn
        ? $(document).off("click", detectClickOutside)
        : $(document).on("click", detectClickOutside)
    })

    $(document).on("click", ".rlc-dev-item", function (e) {
      updateDevItemStatus(e.currentTarget)
      const index = $(this).attr("data-index")
      const item = helperList[index]
      const { fn } = item

      if (
        typeof fn !== 'function' &&
        typeof window[fn] !== 'function'
      ) {
        return console.error(`Function ${fn} is not defined.`);
      }

      if (typeof fn === 'function') {
        item.fn();
      }

      if (typeof window[fn] === 'function') {
        window[fn]();
      }

      const isOn = $(this).attr('data-state') === 'on'
      $(this).attr('data-state', isOn ? 'off' : 'on')
    })
  }

  function generateDevItems(list) {
    let html = ''
    list.forEach((item, i) => {
      html += `
                <li class="rlc-dev-item" data-index="${i}" data-status="show">
                    ${' ' + item.name}
                </li>
            `
    })
    return html
  }

  function generateHotspotABContainer() {
    $(".rlc-hotspot").each((i, el) => {
      addPositionToEl(el)
      $(el).html(createABContainer(getAB(el)))
    })
  }

  function generateBGLinkABContainer() {
    $(".rlc-bg_link").each((i, el) => {
      addPositionToEl(el)
      $(el).append(createABContainer(getAB(el)))
    })
  }

  function generateCTAABContainer() {
      $(".rlc-links, .rlc-copygroup, .rlc-textgroup").each((i, linksContainer) => {
        const isTooManyLinks = checkTooManyLinks(linksContainer)

        // if .rlc-links contains >= 3 CTA 
        if (isTooManyLinks) {
          let html = ""
          let CTAFont = ""
          $(linksContainer).find(".rlc-pillbutton, .rlc-linecta, .rlc-target, a").each((i, el) => {
            const fontFamily = getFontFamily(el)
            const isSameFont = CTAFont === fontFamily
            if (!isSameFont) {
              CTAFont = fontFamily
            }

            html += `
                        ${$(el).text()}: <br>
                        ${!isSameFont ? getFontFamily(el) + ": <br>" : ""}
                        --------------------------<br>
                        AB: <br>
                        ${getAB(el)} <br>
                        --------------------------<br>
                    `
          })

          addPositionToEl(linksContainer)
          addZIndexToCarousel(linksContainer)
          $(linksContainer).append(createABContainer(html))
          return
        }

        // .rlc-links contains < 3 CTA
        $(linksContainer).find(".rlc-pillbutton, .rlc-linecta, .rlc-target, a").each((i, el) => {
          addPositionToEl(el)
          addZIndexToCarousel(el)
          $(el).append(createABContainer(`
                    font: <br>
                    ${getFontFamily(el)}: <br>
                    --------------------------<br>
                    AB: <br>
                    ${getAB(el)}
                `))
        })
      })
    }

  function createABContainer(ab, attr = "") {
    return `
            <div class="rlc-ab-container" ${attr}>
                <p class="rlc-p rlc-ab">
                    ${ab}
                </p>
            </div>
        `
  }

  function updateDevItemStatus(el) {
    const isShow = $(el).attr("data-status") === "show"
    $(el).attr("data-status", isShow ? "hide" : "show")
  }

  function getAB(el) {
    return !$(el).is("a") || !el.href.includes('?')
      ? ""
      // : el.href.split("?").slice(1)[0].replaceAll("ab=", "")
      : el.href.split("com")[1]
  }

  function addPositionToEl(el) {
    if (
      $(el).css('position') !== "static" ||
      $(el).hasClass('rlc-textgroup-in')
    ) return

    $(el).css('position', 'relative')
  }

  function addZIndexToCarousel(el) {
    const carouselEl = $(el).closest('.rlc-carousel')

    if (
      !carouselEl ||
      carouselEl && !!carouselEl.find('.rlc-carousel-dev-z-index').length
    ) return

    carouselEl.find('.rlc-slide').each((i, slide) => {
      $(slide).addClass('rlc-carousel-dev-z-index')
      $(slide).css('z-index', `-${i + 1}`)
    })
  }

  function removeZIndexFromCarousel() {
    $('.rlc-carousel-dev-z-index')
      .removeAttr('style')
      .removeClass('rlc-carousel-dev-z-index')
  }

  function checkTooManyLinks(container) {
    return $(container).find('.rlc-pillbutton, .rlc-linecta, .rlc-target, a').length > 3
  }

  function getFontFamily(el) {
    return ` ${window.getComputedStyle(el).getPropertyValue('font-family')}`
  }

  function toggleAB() {
    isShowingAB ? hideAB() : showAB()
  }

  function hideAB() {
    $(':where(.rlc-links, .rlc-hotspot, .rlc-bg_link, :where(.rlc-copygroup, .rlc-textgroup) :where(.rlc-pillbutton, .rlc-linecta, .rlc-target, a)) .rlc-ab-container').hide()
    removeZIndexFromCarousel()
    isShowingAB = false
  }

  function showAB() {
    $(':where(.rlc-links, .rlc-hotspot, .rlc-bg_link, :where(.rlc-copygroup, .rlc-textgroup) :where(.rlc-pillbutton, .rlc-linecta, .rlc-target, a)) .rlc-ab-container')
      .each((i, el) => {
        addZIndexToCarousel(el)
        $(el).show()
      })
    isShowingAB = true
  }

  function toggleFont() {
    isShowingFont ? hideFont() : showFont()
  }

  function hideFont() {
    $(':where(.rlc-copygroup, .rlc-textgroup, .rlc-textgroup-in, .rlc-intro, .rlc-catslider-hd) > .rlc-ab-container').hide()
    $('*:has(>.rlc-title:not(:where(.rlc-copygroup, .rlc-textgroup, .rlc-textgroup-in, .rlc-intro, .rlc-catslider-hd) .rlc-title)) > .rlc-ab-container').hide()
    $('*:has(>.rlc-dek:not(:where(.rlc-copygroup, .rlc-textgroup, .rlc-textgroup-in, .rlc-intro, .rlc-catslider-hd) .rlc-dek)) > .rlc-ab-container').hide()
    isShowingFont = false
  }

  function showFont() {
    $(':where(.rlc-copygroup, .rlc-textgroup, .rlc-textgroup-in, .rlc-intro, .rlc-catslider-hd) > .rlc-ab-container').show()
    $('*:has(>.rlc-title:not(:where(.rlc-copygroup, .rlc-textgroup, .rlc-textgroup-in, .rlc-intro, .rlc-catslider-hd) .rlc-title)) > .rlc-ab-container').show()
    $('*:has(>.rlc-dek:not(:where(.rlc-copygroup, .rlc-textgroup, .rlc-textgroup-in, .rlc-intro, .rlc-catslider-hd) .rlc-dek)) > .rlc-ab-container').show()
    isShowingFont = true
  }
