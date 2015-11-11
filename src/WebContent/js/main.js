
function showCarousel(){
    if (location.href == location.protocol+"//"+location.host+"/" || location.href == location.protocol+"//"+location.host+'/post-page2'){
        location.href = '/carousel';
    }else if (location.href == location.protocol+"//"+location.host+"/carousel"){
    }else{
        $('#second-fm').submit();
    }
    
}

$(document).ready(function() {
    
    var screensaverTimer = setInterval(function(){showCarousel()},60000);
    
    $('html').on('keypress', function(){
        clearInterval(screensaverTimer);
        screensaverTimer = setInterval(function(){showCarousel()},60000);
    });
    
    $('html').on('mousemove', function(){
        clearInterval(screensaverTimer);
        screensaverTimer = setInterval(function(){showCarousel()},60000);
    });
    
    $('#thanks-modal').on('shown.bs.modal', function(e) {
        setTimeout(function(){
            console.log("Waiting for auto modal close");
            $('#thanks-modal').modal('hide');
        }, 3000);
    });

    $('body').on('click', '#admin-password-submit-btn', function(){
            var pass = $('#admin-authenticate-password-input').val();
            $.ajax({
                dataType:"json",
                contentType: 'application/x-www-form-urlencoded',
                type:"post",
                url: "/authenticate",
                data: {password : pass}
            }).done(function(data){
                if (data.validated === true){
                    $('#admin-credentials-modal .modal-body .alert').remove();
                    $('#admin-credentials-modal .modal-body').prepend('<div class="alert alert-success" role="alert"> - password correct, Authenticating -</div>');
                    $('.alert').fadeOut(5000);
                    setTimeout(function() {$('#admin-credentials-modal').modal('hide')}, 1000);
                }else{
                    $('#admin-credentials-modal .modal-body .alert').remove();
                    $('#admin-authenticate-password-input').val('');
                    $('#admin-authenticate-password-input').addClass("fail-validation");
                    $('#admin-credentials-modal .modal-body').prepend('<div class="alert alert-danger" role="alert"> - password incorrect, Try Again -</div>');
                    $('.alert').fadeOut(5000);
                }
            }).fail(function(data){
                $('#admin-credentials-modal .modal-body .alert').remove();
                $('#admin-authenticate-password-input').val('');
                $('#admin-authenticate-password-input').addClass("fail-validation");
                $('#admin-credentials-modal .modal-body').prepend('<div class="alert alert-danger" role="alert"> - login failed, Try Again -</div>');
                $('.alert').fadeOut(5000);
            });
    });

    $('body').on('click', '#admin-password-cancel-btn', function(){
            location.href = '/';
    });
    
    $('body').on('click', '#admin-page-done-btn', function(){
            location.href = '/';
    });
    
    $('#first-fm').on('submit', function(e) {
        var data = {
            fname: $('#first-name-input'),
            lname: $('#last-name-input'),
            email: $('#email-input'),
            hasAgent: $("input[name*='guestHasAgent']")
        };
        var isValid = validateForm(data);
        if (isValid) {
            (($("#yes-agent-radio").is(':checked'))?($('#thanks-modal').modal('show')):'do nothing');
        }
        else {
            e.preventDefault();
            sendFailSubmit();
        }
    });
    
    $('#admin-page-access-btn').on('click', function() {
       location.href = '/admin'; 
    });
    
    $('#second-fm').on('submit', function(e) {
        $('#thanks-modal').modal('show');
    });
    
    $('input').on('change', function() {
        $(this).removeClass("fail-validation");
        $(this).parent().removeClass("fail-validation");
    });
    
    $('#header-title-save-btn').on('click',function() {
        var data = {selector: '#admin-header-title-label', name:'header-title',value:$('#header-title-input').val()};
        saveProperty(data);
    });
    
    $('#header-description-save-btn').on('click',function() {
        var data = {selector: '#admin-header-description-label',name:'header-description',value:$('#header-description-input').val()};
        saveProperty(data);
    });
    
    $('#admin-pass-save-btn').on('click',function() {
        var data = {selector: '#admin-pass-label', name:'password',value:$('#admin-pass-input').val()};
        saveProperty(data);
    });
   
    $('#admin-csv-util-clear-btn').on('click',function() {
    	var answer = confirm('Are you sure you want to delete the CSV file?');
    	if (answer === true){
            var data = {selector: '#admin-csv-util-label', name:'clearCSV'};
            clearCSV(data);
    	}

    });
    
    $('#admin-csv-util-export-btn').on('click',function() {  
    	serveAlert('#admin-csv-util-label','success');
    });
    
    $('.admin-reload-warning').on('mouseenter', function(){
         $(this).text("This will Cause Page to Refresh (you will need to enter your password)");
         $(this).addClass("btn-warning");
         $(this).removeClass("btn-primary");
    });
    
    $('.admin-reload-warning').on('mouseleave', function(){
         $(this).text("Save");
         $(this).addClass("btn-primary");
         $(this).removeClass("btn-warning");
    });
        
    
     $('#background-image-save-btn').on('click',function() {
         var backgroundRadioArray = $('input[name*=background-image]');
         var selectedBackground;
         for (var i =0; i < backgroundRadioArray.length; i++){
             if (backgroundRadioArray[i].checked === true){
                 selectedBackground = $(backgroundRadioArray[i]).val();
                 break;
             }
         }
        var data = {selector: '#admin-background-image-label', name:'background',value:selectedBackground};
        saveProperty(data);
    });
    
    $('#background-image-delete-save-btn').on('click',function(){
        var imageCheckboxArray = $('input[name*=background-image-delete]');
         var selectedBackgroundArray = [];
         for (var i =0; i < imageCheckboxArray.length; i++){
             if (imageCheckboxArray[i].checked === true){
                 selectedBackgroundArray.push($(imageCheckboxArray[i]).val());
             }
         }
        var data = {selector: '#admin-background-image-delete-label', name:'images',value:selectedBackgroundArray};
        removeImage(data);
    });
});

function clearCSV(topData){
	 $.ajax({
	        dataType:"json",
	        contentType: 'application/x-www-form-urlencoded',
	        type:"POST",
	        data: {property:topData},
	        url:"/clear-csv",
	    }).done(function(data){
	        if (data.status){
	             serveAlert(topData.selector, 'success');
	        }else{
	             serveAlert(topData.selector, 'fail');
	        }
	    }).fail(function(data){
	         serveAlert(topData.selector, 'error');
	    });
}

function saveProperty(topData){
    $.ajax({
        dataType:"json",
        contentType: 'application/x-www-form-urlencoded',
        type:"POST",
        data: {property:topData},
        url:"/save-property",
    }).done(function(data){
        if (data.status){
             serveAlert(topData.selector, 'success');
        }else{
             serveAlert(topData.selector, 'fail');
        }
    }).fail(function(data){
         serveAlert(topData.selector, 'error');
    });
}

function removeImage(topData){
    $.ajax({
        dataType:"json",
        contentType: 'application/x-www-form-urlencoded',
        type:"POST",
        data: {property:topData},
        url:"/remove-image",
    }).done(function(data){
        if (data.status){
            serveAlert(topData.selector, 'success');
            setTimeout(function(){
                location.href = '/admin';
            },1000);
        }else{
            serveAlert(topData.selector, 'fail');
            setTimeout(function(){
            	location.href = '/admin';
            },1000);
        }
    }).fail(function(data){
       serveAlert(topData.selector, 'error');
    });
}

function validateForm(data) {
    var results = true;
    console.log("validating form");
    for (var currentItem in data) {
        console.log("current item in validation queue: "+data[currentItem].selector);
        switch ((data[currentItem][0]).type) {
            case 'text':
                if (!textValidator(data[currentItem])) {
                    results = false;
                }
                break;

            case 'email':
                if (!emailValidator(data[currentItem])) {
                    results = false;
                }
                break;

            case 'phone':
                if (!phoneValidator(data[currentItem])) {
                    results = false;
                }
                break;

            case 'radio':
                if (!radioValidator(data[currentItem])) {
                    results = false;
                }
                break;

            default:
                // code
        }
    }
    return results;
}

function sendFailSubmit() {
    console.log("sending failed submit message");
    $('#fail-validation-alert').css("visibility", "visible");
}

function textValidator(data) {
    console.log(data.val().toString());
    if (data.val() === undefined || data.val().length < 1) {
        data.addClass("fail-validation");
    }
    else {
        return true;
    }
}

function emailValidator(data) {
    console.log(data.val().toString());
    if (((data.val()).length < 1) || (data.val()).indexOf("@") === -1) {
        data.addClass("fail-validation");
        return false;
    }
    else {
        return true;
    }
}

function radioValidator(data) {
    var results = false;
    for (var i = 0; i < data.length; i++) {
        console.log("Radio validator " + data[i].toString());
        if (data[i].checked === true) {
            results = true;
            break;
        }
        else {
            $(data[i]).parent().addClass("fail-validation");
        }
    }
    return results;
}

function phoneValidator(data) {
    console.log(data.val().toString());
    if (data.val() === undefined || data.val().length < 1) {
        data.addClass("fail-validation");
    }
    else {
        return true;
    }
}

function serveAlert(selector, type){
    switch (type) {
        case 'success':
            $(selector+" .alert").remove();
            $(selector).prepend('<div class="alert alert-success" role="alert"> - Updated Successfully -</div>');
            $('.alert').fadeOut(10000);
            break;
        case 'fail':
            $(selector+" .alert").remove();
            $(selector).prepend('<div class="alert alert-danger" role="alert"> - Updated Failed -</div>');
            $('.alert').fadeOut(10000);
            break;
        case 'error':
            $(selector+" .alert").remove();
            $(selector).prepend('<div class="alert alert-danger" role="alert"> - Error Occurred -</div>');
            $('.alert').fadeOut(10000);
            break;
        default:
            $('body').prepend('<div class="alert alert-warning" role="alert"> - Alert Selector Type Not Defined -</div>');
            $('.alert').fadeOut(10000);
    }
   
}