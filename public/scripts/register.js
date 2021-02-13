//THIS IS VULNERABLE. CAN REGISTER WITH WEAK PASSWORD BY DELETING THE DISABLED ATTRIBUTE FROM THE REGISTER BUTTON
const pw = document.getElementById('password');
const pwConfirm = document.getElementById('confirm_password');

//TEST RETURNS THE VALUE OF 1 IF IT'S TRUE. IF ALL ARE TRUE IT RETURNS 4 https://jsbin.com/malopev/edit?html,js,output https://www.kurmis.com/2019/11/01/password-strength-javascript.html
function passwordStrength(pwInput) {
    return /.{8,}/.test(pwInput) * (  /* at least 8 characters */
        // /.{12,}/.test(pw)          /* bonus if longer */
        + /[a-z]/.test(pwInput)         /* a lower letter */
        + /[A-Z]/.test(pwInput)         /* a upper letter */
        + /\d/.test(pwInput)            /* a digit */
        + /[^A-Za-z0-9]/.test(pwInput)  /* a special character */
    )
};

// CONFIRMING THAT PASSWORDS MATCH WITH JQUERY https://stackoverflow.com/questions/21727317/how-to-check-confirm-password-field-in-form-without-reloading-page
function updateMatchMessage() {
    if ($('#password').val() == $('#confirm_password').val()) {
        $('#message').html('Passwords Match!').css('color', 'green'); // WE CAN TOGGLE AN ID OR CLASS INSTEAD IF WE WISH TO HAVE ALL CSS IN ONE SPOT.
      } else 
        $('#message').html(`Passwords Don't Match!`).css('color', 'tomato');
};

// CHECK TO SEE IF PASSWORDS ARE MATCHING
function passwordsMatch() {
    return document.getElementById('message').innerText === 'Passwords Match!' ? true : false; // CONDITIONAL(TERNARY OPERATOR) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
};

// ACCEPTS THE CLASS NAME OF YOUR TARGET AND THE CRITERIA IT MUST MEET. IF CRITERIA IS MET, IT REMOVES THE UNMET CLASS.
function checkPassReq(targClass, modClass, criteria) {
    let target = document.querySelector(targClass);
    if(criteria) {
        target.classList.remove(modClass);
    } else if (!target.classList.contains(modClass)) { // IF IT DOESN'T MEET THE CRITERIA AND DOESN'T CONTAIN UNMET, THEN ADD UNMET AGAIN.
        target.classList.add(modClass);
    }
};

// ADD OR REMOVE THE DISABLED ATTRIBUTE FROM THE REGISTER BUTTON
function updateButtonStatus() {
    if ((passwordStrength(pw.value) >= 4 && passwordStrength(pwConfirm.value) >= 4) && passwordsMatch()) { // PASSWORDS MEET STRENGTH CRITERIA AND THEY MATCH?
        document.querySelector(".register").removeAttribute("disabled"); // ENABLE THE REGISTER BUTTON
    } else {
        document.querySelector(".register").setAttribute("disabled", true); // ENSURE THE DISABLED ATTRIBUTE IS ADDED BACK ON
    }
};

// EVENT LISTENER FOR ANYTIME THE A KEY IS LET GO
$('#password, #confirm_password').on('keyup', function () {
    updateMatchMessage(); // HELPS THE USER KNOW IF THEIR PASSWORD INPUT IS MATCHING
     
    // CALL THE checkPassReq FUNCTION WITH DIFFERENT INPUTS. THERE'S PROBABLY A WAY TO SHORTEN THIS
    // CHECK THE FIRST PASSWORD INPUT
    checkPassReq(".length", "pw-unmet", /.{8,}/.test(pw.value));
    checkPassReq(".lower", "pw-unmet", /[a-z]/.test(pw.value));
    checkPassReq(".upper", "pw-unmet", /[A-Z]/.test(pw.value));
    checkPassReq(".number", "pw-unmet", /\d/.test(pw.value));
    checkPassReq(".special", "pw-unmet", /[^A-Za-z0-9]/.test(pw.value));
    checkPassReq(".bonus", "pw-unmet", /.{12,}/.test(pw.value));

    // CHECK THE SECOND (CONFIRM) PASSWORD INPUT
    checkPassReq(".length", "pw-confirm-unmet", /.{8,}/.test(pwConfirm.value));
    checkPassReq(".lower", "pw-confirm-unmet", /[a-z]/.test(pwConfirm.value));
    checkPassReq(".upper", "pw-confirm-unmet", /[A-Z]/.test(pwConfirm.value));
    checkPassReq(".number", "pw-confirm-unmet", /\d/.test(pwConfirm.value));
    checkPassReq(".special", "pw-confirm-unmet", /[^A-Za-z0-9]/.test(pwConfirm.value));
    checkPassReq(".bonus", "pw-confirm-unmet", /.{12,}/.test(pwConfirm.value));
    
    updateButtonStatus(); // CALL ON EVERY KEYUP SO THE REGISTER BUTTON STATUS REFLECTS CORRECTLY
});