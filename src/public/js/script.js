$(document).ready(function () {
    let myURL
    let shareURL
    let checkUpdate = false
    const currentURL = window.location.href
    const domain = currentURL.split('/')[2] + '/'

    checkURL()
    $('#footer-info').html('Ghi chú trực tuyến - Note Text Online - ' + new Date().getFullYear())

    //========
    {
        let typingTimer
        const doneTypingInterval = 700

        $('textarea').on('keyup', function () {
            clearTimeout(typingTimer)
            typingTimer = setTimeout(updateContent, doneTypingInterval)
        })

        $('textarea').on('keydown', function () {
            clearTimeout(typingTimer)
        })
    }
    //========

    $(window).on('beforeunload', function (e) {
        var confirmationMessage = 'Bạn có chắc chắn muốn thoát không ?'
        e.returnValue = confirmationMessage
        return confirmationMessage
    })

    $('button[id="copy"]').click(function (e) {
        e.preventDefault()
        copyText($(this).val())
    })

    // show form pass
    $("#btn-show-edit-password").click(function () {
        $("#hide-Edit-Pass").css('display', 'block')
        $(this).prop('disabled', true)
    })

    //set pass
    $("#btn-edit-password").click(function () {
        updatePassword()
        $('#password-input').val('')
        $("#hide-Edit-Pass").css('display', 'none')
        $('#btn-show-edit-password').prop('disabled', false)
    })

    // show form link
    $("#btn-show-changeUrl").click(function () {
        $("#hide-changeUrl").css('display', 'block')
        $(this).prop('disabled', true)
    })

    //change URL
    $("#btn-changeUrl").click(function () {
        changeUrl()
        $('#changeUrl-input').val('')
        $("#hide-changeUrl").css('display', 'none')
        $('#btn-show-changeUrl').prop('disabled', false)
    })

    //cancer URL
    $("#btn-cancer-changeUrl").click(function () {
        $('#changeUrl-input').val('')
        $("#hide-changeUrl").css('display', 'none')
        $('#btn-show-changeUrl').prop('disabled', false)
    })

    //cancer pass
    $("#btn-cancer-password").click(function () {
        $('#password-input').val('')
        $("#hide-Edit-Pass").css('display', 'none')
        $('#btn-show-edit-password').prop('disabled', false)
    })

    //login
    $('#btn-login').click(function () {
        getURL(myURL)
    })

    $('#closeUsingNote').click(function () {
        outSlideUsingNoteBook()
    })

    function copyText(text) {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                showNotifi('Sao chép thành công')
            })
            .catch(() => {
                showNotifiError('Lỗi không thể copy')
            })
    }

    // notification
    async function showNotifi(text) {
        await $('#notifi-text').html(text || '')
        $("#notifi").slideDown(500, async function () {
            setTimeout(function () {
                $("#notifi").slideUp(700)
            }, 1000)
        })
    }

    async function showNotifiError(text) {
        await $('#notifi-text-error').html(text || '')
        $("#notifiError").slideDown(500, async function () {
            setTimeout(function () {
                $("#notifiError").slideUp(700)
            }, 1000)
        })
    }

    async function checkURL() {
        const pathURLArray = window.location.pathname.split('/')
        let lastSegment = pathURLArray.pop()
        const regex = /^[a-zA-Z0-9]+$/

        if (lastSegment.length == 0) {
            const infoContent = await createNewURL()
            history.pushState({}, null, infoContent.nameID)
            removeLoader()
            return
        }

        if (regex.test(lastSegment)) {
            myURL = lastSegment
            await getURL(lastSegment)
            removeLoader()
        } else {
            alert('Tên ghi chú của bạn chỉ được phép sử dụng chữ cái viết hoa hoặc thường và chữ số. Thân gửi !')
            history.pushState(null, null, '/')
            window.location.reload(true)
        }
    }

    async function createNewURL() {
        let infoContent

        try {
            const data = await $.ajax({
                type: "get",
                url: "/api/content/createNewURL",
            })

            setInfoURL(data.nameID, data.shareID)
            infoContent = data

        } catch (error) {
            console.log(error)
            if (error.status === 400 || error.status === 500) {
                console.log(error.responseJSON.status)
            }
        }
        return infoContent
    }

    async function getURL(nameID) {
        try {
            let password = $('#passwordLogin').val()
            let token = localStorage.getItem('auth')

            password = password.length < 1 ? null : $('#passwordLogin').val()
            token = !token ? null : localStorage.getItem('auth')

            const data = await $.ajax({
                type: "get",
                url: "/api/content/getContent",
                data: {
                    nameID: nameID,
                    password,
                    token,
                }
            })
            $('#content').val(data.content)
            if (data.token) {
                localStorage.setItem('auth', data.token)
                $('#inputPassword').modal('hide')
            }
            if (data.isPassword) $('#warningPassword').remove()
            if (data.checkUpdate) checkUpdate = data.checkUpdate
            setInfoURL(data.nameID, data.shareID)

        } catch (error) {
            if (error.status === 400 || error.status === 500) {
                if (error.responseJSON.providePassword) $('#inputPassword').modal('show')
                $('#passwordLogin').val('')
                console.log(error.responseJSON.status)
            }
        }
    }

    function updateContent() {
        try {
            const token = localStorage.getItem('auth')
            const content = $('#content').val()
            $.ajax({
                type: "post",
                url: "/api/content/update",
                data: {
                    nameID: myURL,
                    shareID: shareURL,
                    content: content,
                    checkUpdate: checkUpdate,
                    token
                }
            }).then(data => {
                console.log(data.status)
                showNotifi()
            }).catch(error => {
                if (error.responseJSON.valid === false) {
                    console.log(error.responseJSON.status)
                    $('#inputPassword').modal('show')
                }
            })

        } catch (error) {
            console.log(error)
            if (error.status === 400 || error.status === 500) {
                console.log(error.responseJSON.status)
            }

        }
    }

    async function changeUrl() {
        const token = localStorage.getItem('auth')
        const newNameID = $('#changeUrl-input').val()
        await $.ajax({
            type: "put",
            url: "/api/content/changeURL",
            data: {
                nameID: myURL,
                newNameID,
                token
            }
        })
            .then(data => {
                console.log(data.status)
                window.location.href = data.newNameID
            })
            .catch(error => {
                if (error.responseJSON.valid === false) {
                    $('#inputPassword').modal('show')
                }
                if (error.status === 400 || error.status === 500) {
                    showNotifiError(error.responseJSON.status)
                }
            })
    }

    async function updatePassword() {
        const newPassword = $('#password-input').val()
        const token = localStorage.getItem('auth')
        await $.ajax({
            type: "put",
            url: "/api/content/changePassword",
            data: {
                nameID: myURL,
                newPassword,
                token,
            }
        })
            .then(data => {
                showNotifi(data.status)
            })
            .catch(error => {
                if (error.responseJSON.valid === false) {
                    $('#inputPassword').modal('show')
                }
                if (error.status === 400 || error.status === 500) {
                    showNotifiError(error.responseJSON.status)
                }
            })
    }

    function setInfoURL(nameID, shareID) {
        myURL = nameID
        shareURL = shareID
        $('#nameID_url').html(domain + nameID)
        $('#shareID_url').html(domain + 'share/' + shareID)
        $('.nameID_url-value').val(domain + nameID)
        $('.shareID_url-value').val(domain + 'share/' + shareID)
    }

    function removeLoader() {
        $("#loader").remove()
        $("main").css('opacity', '1')
        setTimeout(inSlideUsingNoteBook, 3000)
    }

    async function inSlideUsingNoteBook() {
        await $.ajax({
            type: "get",
            url: "/api/usingContent",
        }).then(data=>{
            $('#usingNote span').html(`Có ${data.count} bảng ghi đang được sử dụng`)
        })
        $('#usingNote').addClass('in')
        setTimeout(outSlideUsingNoteBook, 5000)
    }

    function outSlideUsingNoteBook() {
        $('#usingNote').removeClass('in')
        $('#usingNote').addClass('out')
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
function darkModeTheme() {
    let isChecked = localStorage.getItem('darkModeTheme') === 'true'

    if (isChecked) {
        $('body').addClass('dark')
        $('#darkMode').prop('checked', true)
    }
}

