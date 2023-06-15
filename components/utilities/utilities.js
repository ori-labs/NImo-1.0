let captcha = new Array();

const utilities = {
    stringLimit: (str, length) => {
        return str.length > length ? 
                str.substring(0, length - 3) + "..." : 
                str;
    },
    rayId: () => {
        const placeholder = [1e7]+-1e3+-4e3+-8e3+-1e11;
        const uid = () => {
          const id = crypto.getRandomValues(new Uint8Array(1));
          return (uid ^ id[0] & 15 >> uid / 4).toString(16)
        }
        return placeholder.replace(/[018]/g, uid)
    },
    linkify: (txt) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return txt.replace(urlRegex, (url) => {
            return `<a class="nimo-link" href="${url}">${url}</a>`;
        })
    },
    verifyImgLink: async (url)=> {
        try{
            let resp= $.ajax(url);
            await resp;
            let headers=resp.getAllResponseHeaders().split(/\n/g);
            for(let i=0;i<=headers.length;i++){
                let hd=headers[i].split(': ')
                if (hd[0]=='content-type' && hd[1].indexOf('image')==0)
                   return true;
            }
        }
        catch{}
        return false;
    },
    getmention: (txt) => {
        return txt.replace(/@([a-z\d_]+)/ig, '<b class="name-mention">@$1</b>');
    },
    hasMention: (txt) => {
        return txt.split(" ").filter(function(n) {
            if(/@/.test(n)) return n;
          });
    },
    trimFileName: (fname) => {
        let fileNames = fname;
        let leftRightStrings = fileNames.split('.');
        //file name
        let fName = leftRightStrings[0];
        //file extension
        let fExtention = leftRightStrings[1];
        let lengthFname = fName.length;
        //if file name without extension contains more than 15 characters   
        // if(lengthFname > 15){
        // }    
        return fName.substr(0,10) + "..." + fName.substr(-5) + "." +fExtention;
    },
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
    validateCaptcha: (capIn, errEl, _ac, el) => {
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
                onErr(errEl, 'Wrong captcha!');
                capIn.value = '';
                capIn.focus();
                setTimeout(() => {
                    utilities.createCaptcha(el);
                }, 300);
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
    },
    alert: (msg, type, ac) => {
        let alertview = `
            <div class="alert-cont" id="alert">
                <div class="wrapper scale-up-center" id="alert-wrapper">
                    <div class="content-cont">
                        <span class="icon">
                            <img src="${type == 'info' ? '../src/icons/info.svg' : type ==  'warning' ? '../src/icons/warning.svg' : '../src/icons/warning.svg'}" id="alert-icon">
                        </span>
                        <span class="alert-message">
                            ${msg}
                        </span>
                    </div>
                    <hr>
                    <div class="btn-cont" style="justify-content: ${type == 'alert' ? 'space-between' : 'center'}">
                        <button class="cancel  btn" id="alert-cancel" style="">${type == 'info'?'Okay':'Cancel'}</button>
                        <button class="btn-primary confirm" id="alert-confirm" style="display:${type == 'info' ? 'none' : 'block'}">Confirm</button>
                    </div>
                </div>
            </div>
        `
        document.getElementById('root').insertAdjacentHTML('beforeend', alertview);

        let confirmbtn = document.getElementById('alert-confirm'),
            cancelbtn = document.getElementById('alert-cancel'),
            alertElement = document.getElementById("alert"),
            alertWrapper = document.getElementById("alert-wrapper");

        if(confirmbtn != null){
            confirmbtn.addEventListener('click', () => {
                ac();
                confirmbtn.innerHTML = `<span class="preload">
                    <img src="src/assets/spinner-2.svg" alt="">
                </span>`
                cancelbtn.disabled = true;
                confirmbtn.disabled = true;
                setTimeout(() =>{
                    if(alertElement != null){
                        alertWrapper.classList.add('scale-out-center');
                        setTimeout(() => {
                            alertWrapper.classList.remove('scale-out-center');
                            alertElement.remove();
                            cancelbtn.disabled = false;
                            confirmbtn.disabled = false;
                        }, 100);
                    }
                }, 100)
            });
        }
        if(cancelbtn != null){
            cancelbtn.addEventListener('click', ()=> {
                setTimeout(() => {
                    if(alertElement != null){
                        alertWrapper.classList.add('scale-out-center');
                        setTimeout(() => {
                            alertWrapper.classList.remove('scale-out-center');
                            alertElement.remove();
                        }, 100);
                    }
                }, 200)
            });
        };

        (function() {
            document.onkeydown = function(evt) {
                evt = evt || window.event;
                let isEscape = false;
                if ("key" in evt) {
                    isEscape = (evt.key === "Escape" || evt.key === "Esc");
                } else {
                    isEscape = (evt.keyCode === 27);
                }
                if (isEscape) {
                    if(alertElement != null){
                        alertWrapper.classList.add('scale-out-center');
                        setTimeout(() => {
                            alertWrapper.classList.remove('scale-out-center');
                            alertElement.remove();
                        }, 100);
                    }
                }
            };
            document.addEventListener("mouseup", function(event) {
              if (alertWrapper != null && !alertWrapper.contains(event.target)) {
                if (alertElement != null) {
                    alertWrapper.classList.add('scale-out-center');
                    setTimeout(() => {
                        alertWrapper.classList.remove('scale-out-center');
                        alertElement.remove();
                    }, 100);
                }
              }
            });
        })();
    },
    genColor: ()=> {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    consoleColor: () => {
        return [
            "color: #c10019",
            "background-color: #b59b9f",
            "padding: 2px 4px",
            "border-radius: 2px",
            "font-size: 20px",
            "font-weight: bold"
            ].join(";");
    },
    genUserId: () => {
        return Math.floor(Math.random()*(999-100+1)+100);
    },
    genID: () => {
        return   Math.floor(Math.random() * 1000000000);
    },
    popup: (text, root) => {
        let id = utilities.genID();
        let popup_card = `
            <div class="popup scale-up-center" id="popup-container-${id}">
                <div class="wrapper">
                    <div class="contents">
                        <span class="popup-text">${text}</span>
                    </div>
                </div>
                <span class="timeout-proggress-cont">
                    <span class="progress" id="progress-${id}"></span>
                </span>
            </div>`
        root.insertAdjacentHTML('beforeend', popup_card);
        let popup_cont = document.getElementById(`popup-container-${id}`);
        let progress_el = document.getElementById(`progress-${id}`);

        // close_btn.addEventListener('click', () => {
        //     popup_cont.classList.remove('scale-up-center');
        //     popup_cont.classList.add('scale-down-center');

        //     setTimeout(() => {
        //         popup_cont.remove();
        //     }, 40)
        //     // if(popup_cont != null){
        //     // }
        // });
        // count()
        // 50 = 100; current = x; --> current * 100 = x*50 --> x = (current*100) / 50;
        (function count(cc) {
            let x = (cc * 100) / 200;
            progress_el.style.width = `${x}%`
            if(x <= 0){
                popup_cont.classList.remove('scale-up-center');
                popup_cont.classList.add('scale-down-center');
    
                setTimeout(() => {
                    popup_cont.remove();
                }, 40)
            }
            if (cc > 0)
                setTimeout(function() { count(--cc); }, 10);
        })(200);
    },
    formatDate: (date) => {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        const dayOfWeek = daysOfWeek[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? ' PM' : ' AM';
        
        hours %= 12;
        hours = hours || 12; // the hour '0' should be '12'
        
        if (date.toDateString() === now.toDateString()) {
            return `today @ ${hours}:${minutes < 10 ? '0' : ''}${minutes}${ampm}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `yesterday @ ${hours}:${minutes < 10 ? '0' : ''}${minutes}${ampm}`;
        } else {
            const formattedDate = `${dayOfWeek} ${dayOfMonth} ${month} @ ${hours}:${minutes < 10 ? '0' : ''}${minutes}${ampm}`;
            return formattedDate;
        }
    },
    createNotification: (title, body, icon) => {
        var audio = new Audio('../src/sfx/nimo-bubble.mp3');
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                var notification = new Notification(title, {
                    body: body,
                    icon: icon,
                    sound: audio,
                    silent: true
                });
                notification.addEventListener('show', function() {
                    audio.play();
                    audio.volume = 0.2;
                });
            }
        });
    },
    restrictSpaceCharacter: (input) => {
        const pattern = /[^\w]/;
        return !pattern.test(input);
    },
    isOnlyEmojis: (text)=>{
        const emojiRegex = /^[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]+$/u;
        return emojiRegex.test(text);
    },
    fileToBlob: async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const blob = new Blob([reader.result], { type: file.type });
              resolve(blob);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    },
    isImageMedia: (base64String) => {
        const mimeTypeRegex = /^data:image\/(jpeg|jpg|png|gif|bmp);base64,/i;
        return mimeTypeRegex.test(base64String);
    },
    getImageRes: (base64String)=>{
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
              resolve({ width: img.width, height: img.height });
            };
            img.onerror = function () {
              reject(new Error('Failed to load image'));
            };
            img.src = base64String;
        });
    },
    getFileSize: (base64String) => {
        const decodedData = atob(base64String);
        const fileSizeInBytes = decodedData.length;
        const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024); // 1 megabyte = 1024 bytes * 1024 bytes

        return fileSizeInMegabytes;
    },
    bytesToMb: (bytes) => {
        const toMb = bytes / (1024 * 1024);
        return toMb.toFixed(2);
    },
    downloadMedia: (file, name) => {
        const link = document.createElement('a');
        link.href = file;
        link.download = name;
        link.click();
    },
    getDay: (date) => {
        const today = new Date();
        const yesterday = new Date(today);
        
        yesterday.setDate(today.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = daysOfWeek[date.getDay()];
            return dayOfWeek;
        } else {
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            return formattedDate;
        }
    }
}

export default utilities;