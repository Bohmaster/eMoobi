'use strict';

$(document).ready(function() {
    var API_URL = 'http://162.243.163.18:3003/api/'

    checkCurrentUser()
    
    //handle resize
    var footer = $('.bottomadvert')

    $('input')
        .on('focus', function(evt) {
            console.log(evt)
            footer.hide()
        })
    $('input').on('submit', function(evt) {
            console.log('ON SUBMIT', evt)
            footer.show()
        })

    // Hide advert after 'x' seconds
    var fullAdvert = $('#fullAdvert')
    setTimeout(function(){
        fullAdvert.css('display', 'none')
    }, 5000)

    // Handle tabs
    var currentTab = 'socialTab'

    var tab1 = $('#socialTab')
    var tab2 = $('#personalTab')

    var content1 = $('.socialform')
    var content2 = $('.personalform')

    var tabDescription = $('#headerDescription span')

    console.log(content1, content2)

    tab1.click(function(data) {
        console.log('Tab 1 clicked')
        console.log(currentTab)
        if (currentTab !== 'socialTab') {
            currentTab = 'socialTab'
            tab1.removeClass('unselected')
            tab1.addClass('selected')
            tab2.removeClass('selected')
            tab2.addClass('unselected')

            content2.css('display', 'none')
            // content1.css('display', 'block')
            content1.show(500)

            tabDescription.text('Elije una de estas 3 cuentas:')
            console.log(currentTab)            
        } 
    })

    tab2.click(function(data) { 
        console.log('Tab 2 clicked')
        console.log(currentTab)        
        if (currentTab !== 'personalTab') {
            currentTab = 'personalTab'
            tab2.removeClass('unselected')            
            tab2.addClass('selected')
            tab1.removeClass('selected')
            tab1.addClass('unselected')

            content1.css('display', 'none')
            // content2.css('display', 'block')
            content2.show(500)

            tabDescription.text('Ingresa tus datos personales para registrarte')
            console.log(currentTab)            
        } 
    })

    // Redirect
    function afterLogin () {
        console.log('Running');
        setTimeout(function() {
            window.location.href = 'callback.html'
        }, 2000)
    }

    // Handle user login
    var loginBut = $('#loginBut')
    var loginPost = $('#loginPost')
    var loginArea = $('.loginform')

    var isOnLoginArea = false
    var firsTimeClick = false

    loginBut.click(function() {
        console.log('clicked');
        loginArea.show(500)
        $('.loginarea').css('visibility', 'visible')
    })

    $('.loginarea').click(function() {
        console.log('Hiciste click area')
        if (!isOnLoginArea) {
            $('.loginarea').css('visibility', 'hidden')
            loginArea.hide(500, function(){
                console.log('Animation finished')
            })
        }        
    })

    loginArea.click(function() {
        console.log('Hiciste click form')
        isOnLoginArea = true        
        $('.loginarea').css('visibility', 'visible')
        
        setTimeout(function() {
            isOnLoginArea = false
        }, 500)
    })

    loginPost.click(function() {
        console.log('Clicked')
        loginUser()
    })

    function loginUser (credentials) {

        if (!credentials) {
            var credentials = {
                email: $('#emailData').val(),
                password: $('#passwordData').val()
            }
        } 

        function loginSuccess (response) {
            console.log('Logueado de forma correcta', response)

            localStorage.setItem('emmobi_access_token', response.id)
            localStorage.setItem('emmoib_user_id', response.userId)

            afterLogin()
        }

        function loginErr (err) {
            console.log('Ha surgido un error', err)
        }

        console.log(credentials)

        $.ajax({
            type: "POST",
            url: API_URL + 'users/login',
            data: credentials,
            success: loginSuccess,
            error: loginErr
            // dataType: dataType
        })
    }

    // Handle user creation
    $('#createBut').click(function() {
        createUser()
    })

    function createUser () {
        var credentials = {
            email: $('#email').val(),
            nombre: $('#nombre').val(),
            sexo: $('#sexo').val(),
            edad: $('#edad').val(),
            password: 'prueba'            
        }

        function creationSuccess (response) {
            console.log('Logueado de forma correcta', response)

            // localStorage.setItem('emmobi_access_token', response.id)
            // localStorage.setItem('emmoib_user_id', response.userId)

            $('#creationResponse').html('Gracias ' + response.nombre + '! Automáticamente serás logueado...')
            loginUser({
                email: response.email,
                password: 'prueba'
            })
        }

        function creationErr (err) {
            console.log('Ha surgido un error', err)
        }

        console.log(credentials)

        $.ajax({
            type: "POST",
            url: API_URL + 'users',
            data: credentials,
            success: creationSuccess,
            error: creationErr
            // dataType: dataType
        })
    }

    // Check if user is logged in
    function checkCurrentUser () {
        var userId = localStorage.getItem('emmoib_user_id')
        console.log(userId)

        if (userId) {
            $.ajax({
                type: "GET",
                url: API_URL + 'users/' + userId,            
                success: function(response) {
                    console.log(response)

                    $('#notLoggedIn').css('display', 'none')
                    $('#loggedIn').css('display', 'block')
                }
                // dataType: dataType
            })
        }
    }

    // logout
    function logout () {
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = 'index.html'
    }

    $('#logout').click(function() {
        logout()
    })

})