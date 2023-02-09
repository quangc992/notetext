$(document).ready(function () {

    $('#footer-info').html('Ghi chú trực tuyến - Note Text Online - ' + new Date().getFullYear())

    checkURL()

    async function checkURL() {
        const pathURLArray = window.location.pathname.split('/')
        let lastSegment = pathURLArray.pop()

        if (lastSegment.length == 0) {
            showError403()
            return
        } else {
            await $.ajax({
                type: "get",
                url: "/share/api/getContent",
                data: {
                    shareID: lastSegment
                },
            })
                .then(data => {
                    if (data.valid === false) {
                        showError403(data.status)
                        removeLoader()
                        return
                    }
                    $('#content').val(data.content)
                    $('#urlShare').html(window.location.href)
                    hideError403()
                    removeLoader()
                })
                .catch(error => {
                    if (error.status !== 200) return console.log('Lỗi')
                    showError403()
                    removeLoader()
                })
        }
    }

    function showError403(text) {
        $('#error403').css('display', 'block')
        $('#error403 span').html(text)
        $('#content').remove()
    }

    function hideError403() {
        $('#error403').remove()
    }

    function removeLoader() {
        $("#loader").remove()
        $("main").css('opacity', '1')
    }

    // dark mode
    $('#darkMode').click(function () {
        let isChecked = localStorage.getItem('darkModeTheme') === 'true'
        if (isChecked) {
            $('body').removeClass('dark')
            localStorage.setItem('darkModeTheme', false)
        } else {
            $('body').addClass('dark')
            localStorage.setItem('darkModeTheme', true)
        }
        $(this).prop('checked', !isChecked)
    })
})

darkModeTheme()
darkModeTheme()
function darkModeTheme() {
    let isChecked = localStorage.getItem('darkModeTheme') === 'true'

    if (isChecked) {
        $('body').addClass('dark')
        $('#darkMode').prop('checked', true)
    }
}