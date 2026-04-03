(function() {
    emailjs.init("lMl0R9s12bRRT9fMV");
})();

document.addEventListener('DOMContentLoaded', function() {
    const sendBtn = document.getElementById('sendBtn');

    if (sendBtn) {
        sendBtn.addEventListener('click', function() {

            // Get the honeypot field value to check for bots
            const hpValue = document.getElementById('hp_id').value;

            // Drop the request if the hp_id field is filled out, indicating a bot submission
            if (hpValue.length > 0) {
                sendBtn.innerText = "SUCCESS: Message Logged";
                sendBtn.style.backgroundColor = "#28a745";
                sendBtn.disabled = true;
                return; 
            }

            // Get the reCAPTCHA response token
            const captchaResponse = grecaptcha.getResponse();

            // Get all the input values from the form
            const nameValue = document.getElementById('name').value.trim();
            const emailValue = document.getElementById('email').value.trim();
            const subjectValue = document.getElementById('subject').value.trim();
            const messageValue = document.getElementById('message').value.trim();

            // Strips < and > to prevent basic HTML/Script injection
            const sanitize = (str) => str.replace(/[<>]/g, "");

            const cleanName = sanitize(nameValue);
            const cleanEmail = sanitize(emailValue);
            const cleanSubject = sanitize(subjectValue);
            const cleanMessage = sanitize(messageValue);          

            // Validate that all fields are filled out
            if (!cleanName || !cleanEmail || !cleanSubject || !cleanMessage) {
                alert("SYSTEM ERROR: Missing required parameters in form.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(cleanEmail)) {
                alert("SYSTEM ERROR: malformed_email_string. Please verify input.");
                return;
            }

            if (cleanMessage.length < 10) {
                alert("SYSTEM ERROR: Message payload too short for processing.");
                return;
            }

            if (cleanMessage.length > 5000) {
                alert("SYSTEM ERROR: Message exceeds maximum buffer size.");
                return;
            }

            // Validate reCAPTCHA
            if (captchaResponse.length === 0) {
                alert("SYSTEM ERROR: captcha_verification_failed. Please complete the reCAPTCHA.");
                return;
            }

            // Provide user feedback that the message is being executed
            const originalText = sendBtn.innerText;
            sendBtn.innerText = "EXECUTING...";
            sendBtn.disabled = true;

            // get the variables into the format required by EmailJS
            const templateParams = {
                name: cleanName,
                email: cleanEmail,
                subject: cleanSubject,
                message: cleanMessage,
                'g-recaptcha-response': captchaResponse
            };

            // Execute the email sending function
            emailjs.send('service_7ve8xio', 'template_425gm71', templateParams)
                .then(function() {
                    sendBtn.innerText = "SUCCESS: Message Sent";
                    sendBtn.style.backgroundColor = "#28a745";
                    
                    // Reset the value of the form fields after successful submission
                    document.getElementById('name').value = "";
                    document.getElementById('email').value = "";
                    document.getElementById('subject').value = "";
                    document.getElementById('message').value = "";

                    // Reset reCAPTCHA widget so it can be used again
                    grecaptcha.reset();

                    setTimeout(() => {
                        sendBtn.innerText = originalText;
                        sendBtn.style.backgroundColor = "";
                        sendBtn.disabled = false;
                    }, 5000);
                }, function(error) {
                    console.error('FAILED...', error);
                    sendBtn.innerText = "ERROR: Connection Reset";
                    sendBtn.style.backgroundColor = "#dc3545";
                    sendBtn.disabled = false;
                    
                    // Reset captcha on error as well to allow a fresh attempt
                    grecaptcha.reset();
                });
        });
    }
});