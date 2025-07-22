
const caid = "#rlcid-content-testing-page-two"
const rlHelperPos = {
    x: 0,
    y: 0
}
const helperList = [
    {
        name: "show AB tagging",
        fn: "showAB",
    },
    {
        name: "hide AB tagging",
        fn: "hideAB",
    },
    {
        name: "show font family",
        fn: "showFont",
    },
    {
        name: "hide font family",
        fn: "hideFont",
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
                    list-style: none;
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
                    padding: 4px 12px;
                    color: white;
                    font-size: 16px;
                    background-color: rgba(0, 0, 0, .5);
                    cursor: pointer;
                    border-radius: 6px;
                    transition: background-color 0.3s ease;
                }

                .rlc-dev-item::marker {
                    content: "";
                }

                .rlc-dev-item:hover {
                    background-color: #041e3a;
                }
                .rlc-ab-container {
                    min-width: 240px;
                    height: max-content;
                    padding: 10px;  

                    position: absolute;
                    bottom: 0;
                    left: 0;

                    background-color: rgba(0,0,0,.3);
                    border-radius: 10px;
                    border: 1px solid #041e3a;

                    color: white;
                    text-align: left;
                    pointer-events: all;
                }

                .rlc-ab-container:hover{
                    background-color: black;
                    color: white;
                    z-index: 99;
                }

                .rlc-pillbutton .rlc-ab-container:hover .rlc-textgroup .rlc-ab-font{
                    color: white !important;
                }

                .rlc-ab-container * {
                    text-transform: unset;
                }

                .rlc-pillbutton .rlc-ab-container,
                .rlc-linecta .rlc-ab-container {
                    top: unset;
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

                :where(.rlc-copygroup, .rlc-textgroup) > .rlc-ab-container {
                    transform: translateY(calc(-100% - 12px))
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

    $(".rlc-hotspot").each((i, el) => {
        addPositionToEl(el)
        $(el).html(createABContainer(getAB(el)))
    })

    $(".rlc-bg_link").each((i, el) => {
        addPositionToEl(el)
        $(el).append(createABContainer(getAB(el)))
    })

    $(".rlc-pillbutton, .rlc-linecta").each((i, el) => {
        addPositionToEl(el)
        $(el).append(createABContainer(`
                font: <br>
                ${getFontFamily(el)}: <br>
                --------------------------<br>
                AB: <br>
                ${getAB(el)}
            `))
    })

    $(`${caid} *:has(>.rlc-copygroup), ${caid} *:has(>.rlc-textgroup)`).each((i, container) => {
        let html = ''
        $(container).find('.rlc-copygroup, .rlc-textgroup').each((i, group) => {
            $(group).find('.rlc-sub, .rlc-title, .rlc-dek').each((i, el) => {
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
            $(group).append(createABContainer(html))
        })

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
            console.log('run detectClickOutside')
            if (e.target.closest('.rlc-dev-helper')) return
            devToolContainer.attr("data-status", 'off')
        }

        isOn
            ? $(document).off("click", detectClickOutside)
            : $(document).on("click", detectClickOutside)
    })

    $(document).on("click", ".rlc-dev-item", function () {
        const index = $(this).attr("data-index")
        const item = helperList[index]
        const { fn } = item

        if (typeof fn === 'function') {
            return item.fn();
        }

        if (typeof window[fn] === 'function') {
            return window[fn]();
        }

        console.error(`Function ${fn} is not defined.`);
    })
}

function generateDevItems(list) {
    let html = ''
    list.forEach((item, i) => {
        html += `
                <li class="rlc-dev-item" data-index="${i}">
                    ${item.name}
                </li>
            `
    })
    return html
}

function createABContainer(ab) {
    return `
            <div class="rlc-ab-container">
                <p class="rlc-p rlc-ab">
                    ${ab}
                </p>
            </div>
        `
}

function getAB(el) {
    return !$(el).is("a")
        ? ""
        : el.href.split("?").slice(1)[0].replaceAll("ab=", "")
}

function addPositionToEl(el) {
    if ($(el).css('position') !== "static") return
    $(el).css('position', 'relative')
}

function getFontFamily(el) {
    return `
            ${window.getComputedStyle(el).getPropertyValue('font-family')}
        `
}

function hideAB() {
    $(':where(.rlc-linecta, .rlc-pillbutton, .rlc-hotspot, .rlc-bg_link) .rlc-ab-container').css("display", "none")
}

function showAB() {
    $(':where(.rlc-linecta, .rlc-pillbutton, .rlc-hotspot, .rlc-bg_link) .rlc-ab-container').css("display", "block")
}

function hideFont() {
    $(':where(.rlc-copygroup, .rlc-textgroup) > .rlc-ab-container').css("display", "none")
}

function showFont() {
    $(':where(.rlc-copygroup, .rlc-textgroup) > .rlc-ab-container').css("display", "block")
}