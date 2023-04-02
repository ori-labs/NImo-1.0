let captcha = new Array();
const sanCaptcha = {
   createCaptcha: (el) => {
    for(let a = 0; a < 6; ++a){
        if(a % 2 == 0){
            captcha[a] = String.fromCharCode(Math.floor(Math.random() * 26 + 65));
        }else{
            captcha[a] = Math.floor(Math.random() * 10 + 0)
        }
    }
    let __captcha__ = captcha.join('');
    el.innerText = `${__captcha__}`;
   },
   validateCaptcha: (capIn, errEl, _ac) => {
        let __recaptcha__ = capIn.value;
        let validateCaptcha = 0;

        for(let a = 0; a < 6; ++a){
            if(__recaptcha__.charAt(a) != captcha[a]){
                validateCaptcha++;
            }
        }
        if(__recaptcha__ == ''){
            onErr(errEl, 'Re-Captcha must be filled');
            capIn.value = '';
            capIn.focus();
        }else if(validateCaptcha > 0 || __recaptcha__.lenght > 6){
            onErr(errEl, 'Wrong captcha!')
            capIn.value = '';
            capIn.focus();
        }else{
            _ac();
        }

        function onErr(el, msg){
            el.classList.add('show');
            el.classList.remove('hide');
            el.querySelector('.msg').innerText = msg;
            
            setTimeout(() => {
                el.classList.add('hide');
                el.classList.remove('show');
            }, 2000)
        }
   }
}

export default sanCaptcha;