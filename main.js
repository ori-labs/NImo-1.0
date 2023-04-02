import Router from "./components/services/router/router.js";
import config from "./components/lib/sanMoji/js/config.js";
import sanCaptcha from "./components/lib/sanMoji/js/san-captcha.js";
import fromNow from "./components/lib/sanMoji/js/timeSince.js";
import chat from "./components/views/pages/chat.js";
import home from "./components/views/pages/home.js";
import nimo_sec from "./components/views/pages/nimosec.js";
import utilities from "./components/utilities/utilities.js";

(function(){
    const _nconfig = {
        apiKey: config._napi,
        authDomain: config._ndomain,
        projectId: config._pid,
        appId: config._aid,
        storageBucket: config._stBck
    };
    firebase.initializeApp(_nconfig);
    let auth = firebase.auth(),
        _fsDb = firebase.firestore(),
        _fstrg = firebase.storage(),
        _rtDb = firebase.database();
    const root = document.getElementById('root'),
        // _opSec = document.getElementById('_opSec'),
        lsDB = localStorage,
        _hC = document.getElementById('content-container');

    const _day = 24 * 60 * 60 * 1000;
    const router = new Router({
        mode: 'href',
        root: '/'
    });


    try {
        
        // router
        // .add('/nimo-sec#setup/', async () => {
        //     // root.innerHTML = await home.render();
        //     // await home.after_render();
        //     console.log('hello')
        // })
        // .add(/nimo-sec#setup/, async () => {
        //     console.info('SESSION: Nimo Sec setup');
        //     root.innerHTML = await nimo_sec.render();
        //     let opsectCont = document.getElementById('_opSec');
        //     opsectCont.innerHTML = await nimo_sec.setup();
        //     await nimo_sec.setup_after_render();
        // })
        // .add(/nimo-sec#login/, async () => {
        //     worker._onAuth();
        //     console.info('SESSION: Nimo Sec login');
        //     root.innerHTML = await nimo_sec.render();
        //     let opsectCont = document.getElementById('_opSec');
        //     opsectCont.innerHTML = await nimo_sec.login();
        //     await nimo_sec.login_after_render();
        // })
        // .add(/nimo#app/, async () => {
        //     // worker._onAuth();
        //     console.info('SESSION: APP');
        //     root.innerHTML = await home.render();
        //     await home.after_render();
        // })
        // .add(/nimo-sec#setup/, async () => {
        //     worker._onAuth();
        //     console.info('SESSION: SETUP REWIND');
        //     root.innerHTML = await nimo_sec.render();
        //     let opsectCont = document.getElementById('_opSec');
        //     opsectCont.innerHTML = await nimo_sec.setup();
        //     await nimo_sec.setup_after_render();
        // })
        // .add(/nimo-sec#pass_reset/, async () => {
        //     console.info('SESSION: PASS RESET');
        //     root.innerHTML = await nimo_sec.render();
        //     let opsectCont = document.getElementById('_opSec');
        //     opsectCont.innerHTML = await nimo_sec.pass_reset();
        //     await nimo_sec.pass_reset_after_render();
        // })
        // .add(/nimo-app#chats/, async () => {
        //     console.info('SESSION: CHATS');
        //     let hcont = document.getElementById('content-container');
        //     if(hcont != null){
        //         hcont.innerHTML = await chat.render();
        //         await chat.after_render();
        //     }else{
        //        window.location.hash = '/'
        //     }
        // })
        // .add(/nimo#app-chat/, async (id) => {
        //     console.info('SESSION: Home/chats');
        //     console.log(id)
        //     // let hcont = document.getElementById('content-container');
        //     // if(hcont != null){
        //     //     hcont.innerHTML = await chat.render();
        //     //     await chat.after_render();
        //     // }else{
        //     //    window.location.hash = '/'
        //     // }
        // })
        // .add(/room/, async () => {
        //     console.info('SESSION: Home/rooms');
        // })
        // .add('', async () => {
        //     worker._onAuth();
        //     // root.innerHTML = await home.render();
        //     // await home.after_render();
        //     console.log('Verifying user:> ');
        // })
    } catch (error) {console.log('%c MC6', utilities.consoleColor)}

    // const util = {
    //     cordion: ()=> {
    //         let chbtn = document.querySelector('.chbtn').addEventListener('click', ()=> {
    //             let chts = document.querySelector('.chats'),
    //                 fcicon = document.querySelector('.fcicon');

    //             if(chts.style.display != 'none'){
    //                 chts.style.display = 'none';
    //                 fcicon.style.transform = 'rotate(180deg)'
    //                 console.log('folded');

    //             }else{
    //                 chts.style.display = 'flex';
    //                 fcicon.style.transform = 'rotate(0deg)'
    //                 console.log('unfolded');
    //             }
    //         })
    //         let cnbtn = document.querySelector('.cnbtn').addEventListener('click', ()=> {
    //             let chts = document.querySelector('.channels'),
    //                 ficon = document.querySelector('.fcnicon');

    //             if(chts.style.display != 'none'){
    //                 chts.style.display = 'none';
    //                 ficon.style.transform = 'rotate(180deg)'
    //                 console.log('folded');
    //             }else{
    //                 chts.style.display = 'flex';
    //                 ficon.style.transform = 'rotate(0deg)'
    //                 console.log('unfolded');
    //             }
    //         })
    //     },
    //     toggleProfile: ()=> {
    //         let proBtn = document.getElementById('245')
    //         .addEventListener('click', (e)=> {
    //             const usrid = 'hara#245',
    //                     cardsn = document.querySelector('.snippet-wrapper');

    //             let mouseX = e.pageX,
    //                 mouseY = e.pageY,
    //                 _width = document.documentElement.clientWidth,
    //                 _height = document.documentElement.clientHeight;
                
    //             // console.log(_width, _height);

    //             service.evenListener.esc(cardsn);
    //             service.evenListener.outClick(cardsn, 'right-prof-snipper');
    //             openCard(usrid);

    //             function openCard(){
    //                 cardsn.style.left = `${_width - 475}px`;
    //                 cardsn.style.top = `${mouseY}px`;

    //                 cardsn.style.display = 'none'
    //                 cardsn.style.display = 'block'
    //                 let pos = cardsn.getBoundingClientRect();
    //                 if(pos.y + pos.width >= _height){
    //                     // console.log('greater than height with', pos.y+pos.width)
    //                     cardsn.style.top = `${_height - pos.width}px`
    //                 }
    //                 // console.log(pos.y)
    //             }
    //         })
    //     },
    //     toggleInfo: () => {
    //         let infoBtn = document.querySelector('.info');
    //         let infoCont = document.querySelector('.info-cont');

    //         infoBtn.addEventListener('mouseover', (evt) => {
    //             infoCont.style.display = 'flex';
    //             let pos = infoCont.getBoundingClientRect();

    //             infoCont.style.top = `${evt.pageY-pos.height-5}px`;
    //             infoCont.style.left = `${evt.pageX}px`;
                
    //             // info.style.top = 
    //         })
    //         infoBtn.addEventListener('mouseout', ()=>{
    //             infoCont.style.display = 'none'
    //         })
    //     },
    //     toggleActions: () => {
    //         let lgBtn = document.querySelector('.signup-switch'),
    //             snBtn = document.querySelector('.login-switch'),
    //             _lgView = document.querySelector('._lg-view'),
    //             _snView = document.querySelector('._sn-view'),
    //             _wholder = document.querySelector('.welcome');


    //         lgBtn.addEventListener('click', ()=> {
    //             _snView.style.display = 'flex'
    //             _lgView.style.display = 'none'
    //             _wholder.style.display = 'block'
    //             console.log('login in');
    //             document.title = 'Create Account - Nimo'
    //         })
    //         snBtn.addEventListener('click', ()=> {
    //             _snView.style.display = 'none'
    //             _lgView.style.display = 'flex'
    //             _wholder.style.display = 'none'
    //             document.title = 'Login - Nimo'
    //             console.log('signing in')
    //         })
    //     }
    // }

    const service = {
        runContext: () => {
            window.oncontextmenu = function() {
                return false;
            }
        },
        // evenListener: {
        //     esc: (el) => {
        //         document.onkeydown = function(evt) {
        //             evt = evt || window.event;
        //             let isEscape = false;
        //             if ("key" in evt) {
        //                 isEscape = (evt.key === "Escape" || evt.key === "Esc");
        //             } else {
        //                 isEscape = (evt.keyCode === 27);
        //             }
        //             if (isEscape) {
        //                 el.style.display = 'none'
        //             }
        //         };
        //     },
        //     outClick: (el, id) => {
        //         document.addEventListener("mouseup", function(event) {
        //             let obj = document.getElementById(id);
        //             if (!obj.contains(event.target)) {
        //                 el.style.display = 'none'
        //             }
        //         });
        //     }
        // },
        // Utilities: {
        //     parseUrl: () => {
        //         let url = location.hash.slice(1).toLowerCase() || '/';
        //         let r = url.split("/")
        //         let request = {
        //             resource    : null,
        //             id          : null,
        //             verb        : null
        //         }
        //         request.resource    = r[1]
        //         request.id          = r[2]
        //         request.verb        = r[3]
        
        //         return request
        //     },
        //     setLocale: (a, b) => {
        //         return locale == 'en' ? a : b
        //     },
        //     cid: () => {
        //         let d = new Date().getTime(),
        //             d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;
        //         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        //             let r = Math.random() * 16;
        //             if(d > 0){
        //                 r = (d + r)%16 | 0;
        //                 d = Math.floor(d/16);
        //             } else {
        //                 r = (d2 + r)%16 | 0;
        //                 d2 = Math.floor(d2/16);
        //             }
        //             return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        //         });
        //     }
        // }
    }
    const dom = {
    //     initUi: {           
    //         renderHome: (_usr_) => {
    //             const parseUrl = service.Utilities.parseUrl(),
    //             parsedUrl = window.location.hash
    //                 // parsedUrl = (parseUrl.resource ? '/' + parseUrl.resource : '/') + (parseUrl.id ? '/:id' : '') + (parseUrl.verb ? '/' + parseUrl.verb : '');
    //             console.log(parsedUrl, 1)
    //             const _client_ = _fsDb.collection('/client').doc(_usr_).collection(_usr_);

    //             let mTabGraphic = document.getElementById('mtab-graphic-cont'),
    //                 mTabContentWrapper = document.getElementById('mtab-content-wrapper'),
    //                 rTabGraphic = document.getElementById('rtab-graphic'),
    //                 rTabPartCont = document.getElementById('participant-cont')
                
    //             setTimeout(() => {
    //                 document.querySelector('._preloader_2').style.display = 'none';
    //             }, 3000)
    //             _rt.style.display = 'flex';
    //             // _opSec.style.display = 'none';

    //             // actions
    //             getUserData();
    //             // getChatList();

    //             // funtions
    //             function getUserData(){
    //                 _client_.doc('udata').get()
    //                 .then((sn) => {
    //                     const data = sn.data();
    //                     document.querySelector('.h-usr-name').innerHTML = `${data.user}<b class="id h-uid">#${data.id}</b>`;
    //                     document.querySelector('.h-prof-img').style.backgroundImage = `url(${data.userProfileAvatar || '/src/imgs/avatar.svg'})`;
    //                     lsDB.setItem('cache', [data.user, data.userProfileAvatar])
    //                 })
    //             }
    //             function get\\\\\\ChatList(){
    //                 let msgWrapper = document.querySelector('.msg-wrapper'),
    //                         cHeader = document.querySelector('.c-header');

    //                 _client_.doc('chats').collection('node')
    //                 .get().then((sn) => {
    //                     if(sn.docs.length > 0) {
    //                         let _dId = 0;
    //                         sn.forEach((s) => {
    //                             const dataVal = s.data();
    //                             let _CID = dataVal.cId,
    //                                 _FID = dataVal.fId;
    //                             renderChats(_FID, _CID);
    //                             lsDB.setItem('_udeamon'+_dId++, [dataVal.cId, dataVal.fId]);
    //                         })
    //                         document.querySelector('.chat-count').innerText = sn.size;
    //                     }else{
    //                         console.log('Bruh you\'re lonely af!!')
    //                     }
    //                 })
    //                 function  renderChats(_fID, _cID){ 
    //                     let cWrap = document.getElementById('chat-wrapper'),
    //                         spmc = 0;  
    //                     _fsDb.collection('/client').doc(_fID).collection(_fID)
    //                     .doc('udata').get().then((sn) => {
    //                         const _dval = sn.data();
    //                         let cCard = `
    //                             <div class="chat-prof-wrapper" id="cpw-${_cID}">
    //                                 <div class="chat-prof-cont" id="${_cID}">
    //                                     <span class="chat-pfp" style="background-image: url(${_dval.userProfileAvatar || '/src/imgs/avatar.svg'});">
    //                                     </span>
    //                                     <span class="user-name">${_dval.user}</span>
    //                                     <!-- <span class="count-bagde hide"></span> -->
    //                                 </div>
    //                             </div>
    //                             `;
    //                         cWrap.insertAdjacentHTML('beforeend', cCard);
    //                         const _cbtn = document.getElementById(`${_cID}`);
    //                         lsDB.setItem('vRay', 'default');

    //                         _cbtn.addEventListener('click', (e)=> {
    //                             let vRay = lsDB.getItem('vRay');
    //                             e.preventDefault();
    //                             if(cWrap.querySelector('.active') != null){
    //                                 cWrap.querySelector('.active').disabled = false;
    //                                 cWrap.querySelector('.active').classList.remove('active');
    //                             }
    //                             _cbtn.classList.add('active')
    //                             cWrap.querySelector('.active').disabled = true;
    //                             //GOD RAYS :>
    //                             if(vRay == 'default'){
    //                                 lsDB.setItem('vRay', _cID);
    //                                 renderParticipants(_fID, _usr_);
    //                                 location.hash = `chat-${_cID}`;
    //                             }else if(vRay == _cID){
    //                                 let baseStyles = [
    //                                     "color: #c10019",
    //                                     "background-color: #b59b9f",
    //                                     "padding: 2px 4px",
    //                                     "border-radius: 2px",
    //                                     "font-size: 20px",
    //                                     "font-weight: bold"
    //                                     ].join(";");
    //                                 console.log("%c•  ANTI-SPAM CLICK •", baseStyles);
    //                                 if(spmc >= 5){
    //                                     spmc = 0;
    //                                     console.log("%c•  WHOAHH SLOW DOWN MAN!  •", baseStyles);
    //                                 }
    //                             }else{
    //                                 lsDB.setItem('vRay', _cID);
    //                                 renderParticipants(_fID, _usr_);
    //                                 location.hash = `chat-${_cID}`;
    //                             }
    //                             // if(mTabGraphic != null){
    //                             //     mTabGraphic.remove();
    //                             //     mTabContentWrapper.style.display = 'flex'
    //                             // }
    //                             cHeader.innerHTML = `<span class="status offline"></span>
    //                                                 <span class="chat-name">${_dval.user}<b class="id">#${_dval.id}</b></span>`;
    //                             lsDB.setItem('godRay', _cID);
    //                             msgWrapper.innerHTML = '';
    //                         })
                            
    //                     })
    //                 }
    //                 function renderParticipants(a, b){
    //                     let ids = [a, b];

    //                     document.getElementById('participant-cont').innerHTML = '';

    //                     for(let a in ids){
    //                         // console.info('-----',ids[a])
    //                         _fsDb.collection('/client').doc(ids[a]).collection(ids[a])
    //                         .doc('udata').get().then((sn) => {
    //                             // console.log(sn.data());
    //                             const dval = sn.data();

    //                             let partCard = `
    //                                 <div class="participants-prof-cont"  id="${dval.user+dval.id}" style="opacity: 1 !important;">
    //                                     <span class="participants-pfp" style="background-image: url(${dval.userProfileAvatar || '/src/imgs/avatar.svg'});">
    //                                     </span>
    //                                     <span class="participants-name">${dval.user}</span>
    //                                 </div>
    //                                 `
    //                             document.getElementById('participant-cont').insertAdjacentHTML('beforeend', partCard);
    //                             document.getElementById(`${dval.user+dval.id}`).addEventListener('click', (e) => {
    //                                 console.log(dval.id);
    //                                 toggleAvatar(dval, e);
    //                             })
    //                         })
    //                         document.querySelector('.partici-counter').innerText = `- ${ids.length}`;
    //                     }
    //                     function toggleAvatar(_dval_, evt){
    //                         const cardsn = document.querySelector('.snippet-wrapper');

    //                         let mouseX = evt.pageX,
    //                             mouseY = evt.pageY,
    //                             _width = document.documentElement.clientWidth,
    //                             _height = document.documentElement.clientHeight;
                            
    //                         service.evenListener.esc(cardsn);
    //                         service.evenListener.outClick(cardsn, 'right-prof-snipper');
    //                         openCard();
                
    //                         function openCard(){
    //                             cardsn.style.left = `${_width - 475}px`;
    //                             cardsn.style.top = `${mouseY}px`;
                
    //                             cardsn.style.display = 'none'
    //                             cardsn.style.display = 'block'

    //                             let _snBanner = document.querySelector('.sn-banner'),
    //                                 _snPfp = document.querySelector('.sn-pfp'),
    //                                 _snUname = document.querySelector('.sn-uname'),
    //                                 _snbout = document.querySelector('.sn-bout'),
    //                                 _snBtn = document.querySelector('.sn-btn'),
    //                                 _snId = document.querySelector('.sn-id');

    //                             _snBanner.style.backgroundColor = _dval_.bannerColor;
    //                             _snPfp.style.backgroundImage = `url(${_dval_.userProfileAvatar || '/src/imgs/avatar.svg'})`;
    //                             _snUname.innerHTML = `${_dval_.user}<b class="id sn-id">#${_dval_.id}</b>`;
    //                             _snbout.innerText = _dval_.about == 'empty' ? 'About' : _dval_.about;
    //                             _snBtn.style.display = 'none';


    //                             let pos = cardsn.getBoundingClientRect();
    //                             if(pos.y + pos.width >= _height){
    //                                 cardsn.style.top = `${_height - pos.width}px`
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //             // let gRay = lsDB.getItem('godRay');
    //             // console.log('Grays', gRay);

    //             // $(window).on('hashchange', function() {
    //             //     let _cid_ = lsDB.getItem('godRay');
    //             //     const cacheRay = lsDB.getItem('cacheRay');
    //             //     //.. work ..
    //             //     console.log('ahhhhhh changeee!', _cid_)
    //             //     renderMesseges.onMessege(_cid_);
    //             //     // renderMesseges.sendMesseage(_cid_);

    //             //     if(mTabGraphic != null){
    //             //         mTabGraphic.remove();
    //             //         mTabContentWrapper.style.display = 'flex'
    //             //     }
    //             // });

    //             // const renderMesseges = {
    //             //     onMessege: (id) => {
    //             //         _fsDb.collection('client').doc('node').collection(id).onSnapshot(function(sn){
    //             //             sn.docChanges().forEach(function(ch){
    //             //                 let data = ch.doc.data();
    //             //                 if(ch.type == 'added'){
    //             //                     let msgCard = `
    //             //                         <div class="msg-card">
    //             //                             <div class="msg-pf">
    //             //                                 <span class="pfp" style="background-image: url(${data.clientAvatar || '/src/imgs/avatar.svg'});">
    //             //                                 </span>
    //             //                                 <span class="name">${data.userName}</span>
    //             //                                 <span class="time-stamp time">|&nbsp;&nbsp;${fromNow(data.timeStamp)}</span>
    //             //                             </div>
    //             //                             <div class="msg">${data.content}</div>
    //             //                         </div>
    //             //                         `
    //             //                     $('.msg-wrapper').append(msgCard);
    //             //                     // document.querySelector('.msg-wrapper').insertAdjacentHTML('beforeend', msgCard);
    //             //                     console.log('message displaying engaged')
    //             //                 }
    //             //                 if(ch.type == 'modified'){
                                    
    //             //                 }
    //             //                 if(ch.type == 'removed'){
                                    
    //             //                 }
    //             //             })
    //             //         })
    //             //     }
    //             // }
    //         }
    //     },
    //     sanMoji: () => {
    //         const spinner = document.querySelector('.moji-spinner'),
    //             mojiCont  = document.querySelector('.moji-cont'),
    //             chtInput = document.querySelector('#msg-input');

    //         let mojiBtn = document.querySelector('.emoji-btn')
    //         .addEventListener('click', ()=> {
    //             let _width = document.documentElement.clientWidth,
    //                 _height = document.documentElement.clientHeight;
                
    //             mojiCont.style.display = 'flex';
                
    //             let mojiPicker = document.querySelector('.emoji-picker');
    //             let pos = mojiPicker.getBoundingClientRect();
    //             // mojiCont.style.top = `${(_height - 400)}px`
    //             mojiCont.style.top = `${_height - pos.height - 68}px`;
    //             mojiCont.style.left = `${_width - pos.width - 38}px`;

    //             service.evenListener.esc(mojiCont);
    //             service.evenListener.outClick(mojiCont, 'san-moji-snippet');

    //             if(pos.height + pos.y >= _height){
    //                 mojiCont.style.top = `${_height - pos.height - 68}px`;
    //                 console.log('greater than height with', _height+pos.height);
    //             }
    //             console.log(pos.height, pos.y, _height)

    //         })
    //         $("#san-moji-snippet").disMojiPicker();
    //         twemoji.parse(document.body);
    //         $('#san-moji-snippet').picker(
    //             emoji =>   $('#msg-input').val($('#msg-input').val() + emoji)
    //         )
    //     },
        preloader: () => {
            setTimeout(() => {
                setTimeout(()=> {
                    $('#progress').addClass('reveal');
                }, 500)
                setTimeout(()=> {
                    $('#progress').addClass('load');
                }, 1500)
                // let __preldT = document.querySelector('._preload-t'),
                //     __preldB = document.querySelector('._preload-b');

                // __preldT.innerText = __prldMsg[0][Math.floor(Math.random() * __prldMsg[0].length)]
                // __preldB.insertAdjacentHTML('beforeend', __prldMsg[1][Math.floor(Math.random() * __prldMsg[1].length)])
                // if($('#_preloader').length > 0){
                //     $('#progress').removeClass('load');
                //     $('#progress').addClass('lude');
                //     // $('#_preloader').removeClass('show');
                // }
            })
        },
        // preloader2: () => {
        //     setTimeout(() => {
        //         const __prldMsg = [
        //             [
        //             '',
        //             'Loading Nimo interface',
        //             'Fetching data',
        //             'Loading',
        //             ' ',
        //             'Initializing Nimo base'
        //             ],
        //             [
        //             `<span class="_preload-msg">Do you know that you can navigate easily with the help of  <b class="key">ESC</b> key! </span>`
        //             ]
        //         ]
        //         // let __preldT = document.querySelector('._preload-t-2'),
        //             // __preldB = document.querySelector('._preload-2');

        //         // __preldT.innerText = __prldMsg[0][Math.floor(Math.random() * __prldMsg[0].length)]
        //         // __preldB.insertAdjacentHTML('beforeend', __prldMsg[1][Math.floor(Math.random() * __prldMsg[1].length)])
        //     })
        // }
    }
    const worker = {
        // _lg: {
        //     _login: () => {
        //         document.querySelector('._login').style.display = 'flex';
        //         document.querySelector('._create_account').style.display = 'none';
        //         document.querySelector('._setup').style.display = 'none'
        //     },
        //     _nlg: () => {

        //     },
        //     _alg: () => {

        //     }
        // },
        // _sn:{
        //     // _phs0: () => {
        //     //     const _prld = `
        //     //         <span class="preload">
        //     //             <img src="src/assets/spinner-2.svg" alt="">
        //     //         </span>
        //     //     `
        //     //     let _createAcBtn = document.querySelector('._create-account'),
        //     //         _lgM = document.querySelector('#_lg-email'),
        //     //         _lgPwd = document.querySelector('#_lg-pwd'),
        //     //         _lgBtn = document.querySelector('#_lg-btn'),
        //     //         _lgErr = document.querySelector('#_lg-err');

        //     //     document.title = 'Login - Nimo'
        //     //     document.querySelector('._login').style.display = 'flex';
        //     //     document.querySelector('._create_account').style.display = 'none';
        //     //     document.querySelector('._setup').style.display = 'none'
        //     //     document.querySelector('.welcome').style.display = 'flex';
        //     //     document.querySelector('.welcome').innerText = 'Login';
        //     //     document.querySelector('#_preloader_2').style.display = 'none';

        //     //     _opSec.style.display = 'flex';
        //     //     _rt.style.display = 'none';

        //     //     _createAcBtn.addEventListener('click', (e)=> {
        //     //         e.preventDefault();
        //     //         worker._sn._phs1();
        //     //     })
        //     //     _lgBtn.addEventListener('click', () => {
        //     //         onlogin();
        //     //     })
        //     //     _lgM.addEventListener('keyup', (evt) => {
        //     //         if (evt.key === 'Enter' || evt.keyCode === 13) {
        //     //             _lgPwd.focus();
        //     //         }
        //     //     });
        //     //     _lgPwd.addEventListener('keyup', (evt) => {
        //     //         if (evt.key === 'Enter' || evt.keyCode === 13) {
        //     //             onlogin();
        //     //         }
        //     //     });
        //     //     function onlogin(){
        //     //         validate();
        //     //     }

        //     //     function validate(){
        //     //         if(_lgM.value == ''){
        //     //             worker._sn._Err('Email field is required!', _lgErr);
        //     //             _lgM.classList.add('invalid');
        //     //             _lgM.classList.add('invalid');
        //     //             _lgM.focus();
        //     //             setTimeout(() => {
        //     //                 _lgM.classList.remove('invalid');
        //     //                 _lgM.classList.remove('invalid');
        //     //             }, 1000);
        //     //         }else if(_lgPwd.value == ''){
        //     //             worker._sn._Err('Password field is required!', _lgErr);
        //     //             _lgPwd.classList.add('invalid');
        //     //             _lgPwd.classList.add('invalid');
        //     //             _lgPwd.focus();
        //     //             setTimeout(() => {
        //     //                 _lgPwd.classList.remove('invalid');
        //     //                 _lgPwd.classList.remove('invalid');
        //     //             }, 1000);
        //     //         }else{
        //     //             _lgBtn.innerHTML = _prld;
        //     //             login(_lgM.value, _lgPwd.value);
        //     //         }
        //     //     }

        //     //     function login(__email__, __pwd__){
        //     //         auth.signInWithEmailAndPassword(__email__,__pwd__)
        //     //         .then((_cred_) => {
        //     //             console.log('Logged in!',_cred_);
        //     //             location.reload();
        //     //         }).catch(err => {
        //     //             _lgBtn.innerHTML = 'Login'
        //     //             worker._sn._Err(err.message, _lgErr);
        //     //             console.log(err)
        //     //         })
        //     //     }
        //     // },
        //     // _phs1: () => {
        //     //     document.querySelector('._create_account').style.display = 'flex';
        //     //     document.querySelector('._login').style.display = 'none';
        //     //     document.querySelector('._setup').style.display = 'none';
        //     //     document.querySelector('.welcome').style.display = 'flex';
        //     //     document.querySelector('.welcome').innerText = 'Create an account';
        //     //     document.querySelector('#_preloader_2').style.display = 'none';
        //     //     document.title = 'Create account - Nimo';
                
        //     //     _opSec.style.display = 'flex';
        //     //     _rt.style.display = 'none';

        //     //     const _prld = `
        //     //     <span class="preload">
        //     //         <img src="src/assets/spinner-2.svg" alt="">
        //     //     </span>
        //     //     `, 
        //     //     _prevEl = `
        //     //     <span>next</span>
        //     //     <img src="src/icons/arrow-right.svg" alt="">
        //     //     `;

        //     //     let _loginBtn = document.querySelector('._login-btn'),
        //     //         __snM = document.getElementById('sn-email'),
        //     //         __snPwd = document.getElementById('sn-pwd'), 
        //     //         __snCPwd = document.getElementById('sn-c-pwd'), 
        //     //         __snPhs1Btn = document.getElementById('phs-1-btn'), 
        //     //         __snPlcH = document.querySelector('._phs1-err'),
        //     //         __capSec = document.querySelector('.cap-sec');

        //     //     const _regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

                

        //     //     __snPhs1Btn.addEventListener('click', () => {
        //     //         validateInput();
        //     //     });
        //     //     function validateInput() {
        //     //         if (__snM.value === '') {
        //     //             __snM.classList.add('invalid');
        //     //             __snM.focus();
        //     //             worker._sn._Err('Email field is required!', __snPlcH);
        //     //             setTimeout(() => {
        //     //                 __snM.classList.remove('invalid');
        //     //             }, 1000);
        //     //         }
        //     //         else if (__snPwd.value != '' && __snCPwd.value != '') {
        //     //             if (__snPwd.value != __snCPwd.value) {
        //     //                 worker._sn._Err('Passwords do not match!', __snPlcH);
        //     //                 __snPwd.classList.add('invalid');
        //     //                 __snCPwd.classList.add('invalid');
        //     //                 __snPwd.focus();
        //     //                 setTimeout(() => {
        //     //                     __snPwd.classList.remove('invalid');
        //     //                     __snCPwd.classList.remove('invalid');
        //     //                 }, 1000);
        //     //             } else {
        //     //                 if (__snM.value.match(_regx)) {
        //     //                     __snPhs1Btn.innerHTML = _prld;
        //     //                     __snM.disabled = true;
        //     //                     __snPwd.disabled = true;
        //     //                     __snCPwd.disabled = true;
        //     //                     __snPhs1Btn.disabled = true;
        //     //                     __snM.style.cursor = 'not-allowed';
        //     //                     __snPwd.style.cursor = 'not-allowed';
        //     //                     __snCPwd.style.cursor = 'not-allowed';
        //     //                     __snPhs1Btn.style.cursor = 'not-allowed';
        //     //                     setTimeout(() => {
        //     //                         __snPhs1Btn.innerHTML = _prevEl;
        //     //                         __snM.disabled = false;
        //     //                         __snPwd.disabled = false;
        //     //                         __snCPwd.disabled = false;
        //     //                         __snPhs1Btn.disabled = false;
        //     //                         __snM.style.cursor = 'text';
        //     //                         __snPwd.style.cursor = 'text';
        //     //                         __snCPwd.style.cursor = 'text';
        //     //                         __snPhs1Btn.style.cursor = 'pointer';
        //     //                         _savePhs1(
        //     //                             __snM.value,
        //     //                             __snPwd.value,
        //     //                             __snCPwd.value
        //     //                         ).then(() => {
        //     //                             _verify();
        //     //                         });
        //     //                     }, 3000);
        //     //                     return true;
        //     //                 } else {
        //     //                     __snM.classList.add('invalid');
        //     //                     __snM.focus();
        //     //                     worker._sn._Err('Email not valid!', __snPlcH);
        //     //                     setTimeout(() => {
        //     //                         __snM.classList.remove('invalid');
        //     //                     }, 1000);
        //     //                     return false;
        //     //                 }
        //     //             }
        //     //         } else {
        //     //             __snPwd.classList.add('invalid');
        //     //             __snCPwd.classList.add('invalid');
        //     //             __snPwd.focus();
        //     //             worker._sn._Err('You need to set a password!', __snPlcH);
        //     //             setTimeout(() => {
        //     //                 __snPwd.classList.remove('invalid');
        //     //                 __snCPwd.classList.remove('invalid');
        //     //             }, 1000);
        //     //         }
        //     //         async function _savePhs1(_e, _p1, _p2) {
        //     //             lsDB.setItem('_phs1_e', _e);
        //     //             lsDB.setItem('_phs1_p1', _p1);
        //     //             lsDB.setItem('_phs1_p2', _p2);
        //     //         }
        //     //     }
        //     //     function onkeyEnter() {
        //     //         __snM.addEventListener('keyup', (evt) => {
        //     //             if (evt.key === 'Enter' || evt.keyCode === 13) {
        //     //                 __snPwd.focus();
        //     //             }
        //     //         });
        //     //         __snPwd.addEventListener('keyup', (evt) => {
        //     //             if (evt.key === 'Enter' || evt.keyCode === 13) {
        //     //                 __snCPwd.focus();
        //     //             }
        //     //         });
        //     //         __snCPwd.addEventListener('keyup', (evt) => {
        //     //             if (evt.key === 'Enter' || evt.keyCode === 13) {
        //     //                 validateInput();
        //     //             }
        //     //         });
        //     //     }
        //     //     function _verify() {
        //     //         __capSec.style.display = 'flex';

        //     //         let _capH = document.querySelector('.cap-h'), 
        //     //             _capRf = document.querySelector('.cap-rf'), 
        //     //             _capin = document.querySelector('.cap-in'),
        //     //             _capWrapper = document.querySelector('.middle-ware'), 
        //     //             _capErrMsg = document.querySelector('.cap-err-msg'), 
        //     //             _capVBtn = document.querySelector('.cap-v-btn'),
        //     //             _capPrldSec = document.querySelector('._preload_sec');

        //     //         _capin.focus();
        //     //         _capin.value = '';
        //     //         sanCaptcha.createCaptcha(_capH);
        //     //         service.evenListener.esc(__capSec);
        //     //         service.evenListener.outClick(__capSec, 'middle-ware');
        //     //         _rfCap();
        //     //         _vlCap();

        //     //         function _rfCap() {
        //     //             _capRf
        //     //                 .addEventListener('click', () => {
        //     //                     setTimeout(() => {
        //     //                         sanCaptcha.createCaptcha(_capH);
        //     //                     }, 300);
        //     //                 });
        //     //         }
        //     //         function _vlCap() {
        //     //             _capVBtn.addEventListener('click', () => {
        //     //                 sanCaptcha.validateCaptcha(_capin, _capErrMsg, _ac);
        //     //             });
        //     //             _capin.addEventListener('keyup', (evt) => {
        //     //                 if (evt.key === 'Enter' || evt.keyCode === 13) {
        //     //                     sanCaptcha.validateCaptcha(_capin, _capErrMsg, _ac);
        //     //                 }
        //     //             });
        //     //             function _ac() {
        //     //                 _capVBtn.innerText = 'VERIFICATION SUCCESS!';
        //     //                 setTimeout(() => {
        //     //                     document.querySelector('._preloader_2').style.display = 'flex';
        //     //                     _opSec.style.display = 'none';
        //     //                     _cusr();
        //     //                     _unload();
        //     //                     console.log('redirecting a signing session**')
        //     //                 }, 1000)
        //     //             }
        //     //         }
        //     //         function _cusr() {
        //     //             __capSec.style.display = 'none';
        //     //             _capPrldSec.style.display = 'flex';
        //     //             _preload();
        //     //             const _m = lsDB.getItem('_phs1_e'), 
        //     //                 _psw = lsDB.getItem('_phs1_p2');
        //     //                 console.log(_m);
        //     //             auth.createUserWithEmailAndPassword(_m, _psw)
        //     //                 .then((_cred_) => {
        //     //                     let _uid = _cred_.user.uid,
        //     //                         status = _cred_.user.isAnonymous;
        //     //                         let _type = status === false ? 'user' : 'anonymous'
        //     //                     console.log(_uid, _type);
        //     //                     _svUsr(_uid, _type);
        //     //                 }).catch((err) => {
        //     //                     _unload();
        //     //                     const __errcode__ = err.code;
        //     //                     console.log(err.message);
        //     //                     _capPrldSec.style.display = 'none';
        //     //                     worker._sn._Err(err.message, __snPlcH);
        //     //                     document.querySelector('._preloader_2').style.display = 'none';
        //     //                     _opSec.style.display = 'flex';
        //     //                 });
        //     //         }
        //     //         function _svUsr(__uid__, type){
        //     //             _fsDb.collection('client')
        //     //             .doc(__uid__)
        //     //             .collection(__uid__)
        //     //             .doc('meta')
        //     //             .set(
        //     //                 {
        //     //                     uid: __uid__,
        //     //                     state: 'setup'+type
        //     //                 }
        //     //             ).then(() => {
        //     //                 console.log('data initialized successful...', 'refreshing page');
        //     //                 // document.querySelector('._preload-2').style.display = 'flex';
        //     //                 location.reload();
        //     //             }).catch((err) => {
        //     //                 console.log(err)
        //     //             })
        //     //         }
        //     //         function _preload(){
        //     //             _capVBtn.innerHTML = _prld;
        //     //             _capRf.disabled = true;
        //     //             _capin.disabled = true;
        //     //             _capVBtn.disabled = true;
        //     //             _capVBtn.style.cursor = 'not-allowed';
        //     //             _capRf.style.cursor = 'not-allowed';
        //     //             _capin.style.cursor = 'not-allowed';
        //     //         }
        //     //         function _unload(){
        //     //             _capVBtn.innerHTML = 'Verify';
        //     //             _capRf.disabled = false;
        //     //             _capin.disabled = false;
        //     //             _capVBtn.disabled = false;
        //     //             _capVBtn.style.cursor = 'pointer';
        //     //             _capRf.style.cursor = 'pointer';
        //     //             _capin.style.cursor = 'text';
        //     //             _capin.value = '';
        //     //             sanCaptcha.createCaptcha(_capH);
        //     //         }
        //     //     }
        //     //     onkeyEnter();
        //     //     setTimeout(() => {
        //     //         _loginBtn.addEventListener('click', (e)=> {
        //     //             e.preventDefault();
        //     //             worker._sn._phs0();
        //     //         })
        //     //     }, 1)
        //     // },
        //     // _setup: (uid) => {
        //     //     const _prld = `
        //     //         <span class="preload">
        //     //             <img src="src/assets/spinner-2.svg" alt="">
        //     //         </span>
        //     //         ` 

        //     //     document.querySelector('._setup').style.display = 'flex'
        //     //     document.querySelector('._login').style.display = 'none';
        //     //     document.querySelector('._create_account').style.display = 'none';
        //     //     document.querySelector('.logo-wrapper').style.display = 'none';
        //     //     document.querySelector('#_preloader_2').style.display = 'none';
        //     //     document.title = 'Profile setup - Nimo'
        //     //     _opSec.style.display = 'flex';
        //     //     _rt.style.display = 'none';
        //     //     lsDB.setItem('_pfp', '/src/imgs/avatar.svg')

        //     //     let _colrPicker_ = document.querySelector('._color-picker_'),
        //     //         _banner_ = document.querySelector('._banner_'),
        //     //         _pfp_ = document.querySelector('._pfp_'),
        //     //         _pfpPicker = document.querySelector('._pfp_picker_'),
        //     //         _pfpFile = document.querySelector('#_pfp-file_'),
        //     //         _setFnBtn = document.querySelector('#setup-fin-btn'),
        //     //         _setBcBtn = document.querySelector('.setup-bc-btn'),
        //     //         _usrName = document.querySelector('#set-user-name'),
        //     //         _idCard = document.querySelector('#_id_'),
        //     //         _about = document.querySelector('#_set-about'),
        //     //         _errH = document.querySelector('._set-Err'),
        //     //         _tl = document.querySelector('.tl');

        //     //     _about.addEventListener('keyup', () => {
        //     //         console.log(_about.value.length)
        //     //         let maxLen = 120;
        //     //         let val = _about.value;
        //     //         let chars = val.length;
        //     //         if(chars > maxLen){
        //     //             _about.value = val.substring(0,maxLen);
        //     //         }
        //     //         _tl.innerText = `${_about.value.length}/120`
        //     //     })
        //     //     _setBcBtn.addEventListener('click', () => {
        //     //         // let usr = lsDB.getItem('')
        //     //         _fsDb.collection('client').doc(uid).collection(uid).doc('meta')
        //     //         .set({
        //     //             state: 'cancel'
        //     //         }).then(() => {
        //     //             console.log('setup cancelled!')
        //     //             //promt() TODO
        //     //             setTimeout(() => {
        //     //                 location.reload();
        //     //             }, 100)
        //     //         }).catch(err => {
        //     //             worker._sn._Err('Opps! We\'ve encountered some issues while processing your request, please try again later!');
        //     //             console.log(err);
        //     //         })
        //     //     })
        //     //     function _cp(){
        //     //         const __picker__ = new Picker(_colrPicker_);
        //     //         __picker__.onChange = (_color_) => {
        //     //             _banner_.style.backgroundColor = _color_.rgbaString;
        //     //         }
        //     //     }
        //     //     function _pi(){
        //     //         let _stds_ = lsDB.getItem('_stds');
        //     //         _pfpFile.addEventListener('change', () => {
        //     //             _gImgData();
        //     //         })

        //     //         function _gImgData(){
        //     //             const files = _pfpFile.files[0];
        //     //             let _prog = document.getElementById('_prog');

        //     //             console.log("FileName", files)
        //     //             const uploadTask = _fstrg.ref(`client/${_stds_}`).child(files.name).put(files);

        //     //             uploadTask.on('state_changed', (snapshot) => {
        //     //                     // _prog.style = 'flex';
        //     //                     _prog.classList.remove('hide');
        //     //                     _prog.classList.add('show');
        //     //                     let pfpfp = document.getElementById('pfp-picker'),
        //     //                     bnp = document.getElementById('banner-picker'),
        //     //                     sfnbtn = document.getElementById('setup-fin-btn'),
        //     //                     sbcbtn = document.getElementById('setup-bc-btn');

        //     //                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     //                     console.log('Upload is ' + progress + '% done');
        //     //                     let _height_ = (Math.floor(progress) * 70) / 100;
        //     //                     let _cheight = Math.floor(70 - (Math.floor(progress) * 70) / 100)
        //     //                     console.log(70 - (Math.floor(progress) * 70) / 100);
        //     //                     // document.querySelector('.progress').style.height = `${Math.floor((progress * 70)/100)}px`;
        //     //                     _prog.style.height = `${_cheight}px`;
        //     //                     // if(progress == 100){
        //     //                     //     _prog.style.display = 'none';
        //     //                     //     console.log('***DONE***');
        //     //                     // }
        //     //                 },
        //     //                 (error) => {
        //     //                     // Handle unsuccessful uploads
        //     //                     worker._sn._Err('Couldn\'t upload the image, please try again later!', _errH);
        //     //                     console.log("error:-", error)
        //     //                 },
        //     //                 () => {
        //     //                     uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        //     //                         console.log('File available at', downloadURL);
        //     //                         _fsDb.collection("client").doc(_stds_)
        //     //                         .collection(_stds_)
        //     //                         .doc('udata').set({
        //     //                             userProfileAvatar: downloadURL.toString(),
        //     //                         })
        //     //                         .then(() => {
        //     //                             // console.log("Document successfully written!");
        //     //                             lsDB.setItem('_pfp', downloadURL.toString())
        //     //                         })
        //     //                         .catch((error) => {
        //     //                             worker._sn._Err('Something went wrong, please try again later!', _errH)
        //     //                             console.error("Error writing document: ", error);
        //     //                         });
        //     //                     });
        //     //                 }
        //     //             )
        //     //             if(files){
        //     //                 const _fReader = new FileReader();
        //     //                 _fReader.readAsDataURL(files);
        //     //                 _fReader.addEventListener('load', function(){
        //     //                     _pfp_.style.backgroundImage = `url('${this.result}')`;
        //     //                     _pfp_.style.backgroundSize = 'cover'
        //     //                     _pfp_.style.backgroundPosition = 'center'
        //     //                 })
        //     //             }
        //     //         }
        //     //     } 
        //     //     function _finishSetup(){
        //     //         const __id__  = Math.floor(Math.random()*(999-100+1)+100);
        //     //         _idCard.innerText = `#${__id__}`;
        //     //         _usrName.addEventListener('keyup', (evt) => {
        //     //             if (evt.key === 'Enter' || evt.keyCode === 13) {
        //     //                 _validData();
        //     //             }
        //     //         });
        //     //         _setFnBtn.addEventListener('click', ()=> {
        //     //             _validData();
        //     //         })
        //     //         function _validData(){
        //     //             if(_usrName.value == ''){
        //     //                 worker._sn._Err('Username is required!', _errH);
        //     //                 _usrName.classList.add('invalid');
        //     //                 _usrName.focus();
        //     //                 setTimeout(() => {
        //     //                     _usrName.classList.remove('invalid');
        //     //                 }, 1000);
        //     //             }else{
        //     //                 _setFnBtn.innerHTML = _prld;
        //     //                 _setFnBtn.disabled = true;
        //     //                 _setBcBtn.disabled = true;
        //     //                 _setBcBtn.style.cursor = 'not-allowed'
        //     //                 _setFnBtn.style.cursor = 'not-allowed'
        //     //                 document.querySelector('.layer').classList.add('show');
        //     //                 document.querySelector('.layer').classList.remove('hide');
                            

        //     //                 let _stds_ = lsDB.getItem('_stds');
        //     //                 const _pfImage = lsDB.getItem('_pfp'),
        //     //                     _bannerCVal = _banner_.style.backgroundColor || 'default',
        //     //                     _usrName_ = _usrName.value,
        //     //                     _about_ = _about.value || 'empty',
        //     //                     _id_ = _idCard.innerText;

        //     //                 console.log(
        //     //                     _pfImage,
        //     //                     _bannerCVal,
        //     //                     _usrName_,
        //     //                     _about_,
        //     //                     _stds_,
        //     //                     _id_
        //     //                 );
        //     //                 _fsDb.collection('client').doc(_stds_).collection(_stds_)
        //     //                 .doc('udata').set({
        //     //                     user: _usrName_,
        //     //                     about: _about_,
        //     //                     id: __id__,
        //     //                     bannerColor: _bannerCVal,
        //     //                     userProfileAvatar: _pfImage,
        //     //                 }).then(() => {
        //     //                     _fsDb.collection('client').doc(_stds_).collection(_stds_).doc('meta')
        //     //                     .update({
        //     //                         state: 'user'
        //     //                     }).then(() => {
        //     //                         location.reload();
        //     //                     }).catch((err) => {
        //     //                         worker._sn._Err('Opps something went wrong, mind trying again later!');
                                
        //     //                         _setFnBtn.innerHTML = `<span>Finish</span>`;
        //     //                         _setFnBtn.disabled = false;
        //     //                         _setBcBtn.disabled = false;
        //     //                         _setBcBtn.style.cursor = 'pointer'
        //     //                         _setFnBtn.style.cursor = 'pointer'
        //     //                         document.querySelector('.layer').classList.add('hide');
        //     //                         document.querySelector('.layer').classList.remove('show');
        //     //                     })
        //     //                 }).catch((err) => {
        //     //                     worker._sn._Err('Opps something went wrong, mind trying again later!');
                                
        //     //                     _setFnBtn.innerHTML = `<span>Finish</span>`;
        //     //                     _setFnBtn.disabled = false;
        //     //                     _setBcBtn.disabled = false;
        //     //                     _setBcBtn.style.cursor = 'pointer'
        //     //                     _setFnBtn.style.cursor = 'pointer'
        //     //                     document.querySelector('.layer').classList.add('hide');
        //     //                     document.querySelector('.layer').classList.remove('show');
        //     //                 })
        //     //             }
        //     //         }
        //     //     }
        //     //     _cp();
        //     //     _pi();
        //     //     _finishSetup()
        //     // },
        //     // _Err: (errMsg, el1) => {
        //     //     el1.classList.remove('hide');
        //     //     el1.classList.add('show');
        //     //     el1.querySelector('.msg').innerText = errMsg;

        //     //     setTimeout(() => {
        //     //         el1.classList.remove('show');
        //     //         el1.classList.add('hide');
        //     //     }, 5000);
        //     // }
        // },
        // get sn() {
        //     return this._sn;
        // },
        // set sn(value) {
        //     this._sn = value;
        // },
        _onAuth: () => {
            auth.onAuthStateChanged( async __usr__ => {
                if(__usr__){
                    // lsDB.setItem('_stds', __usr__.uid);
                    console.log('Logged in as', __usr__.uid);
                    lsDB.setItem('deamon', __usr__.uid)
                    const state = await getState(__usr__.uid)
                    // await getState(__usr__.uid)
                    // console.log('user state',await getState(__usr__.uid))
                    if(state != 'null'){
                        console.log('user registered with ', state)
                        if(state === 'setup'){
                            console.log('rewinding setup ..')
                            location.href = '/pages/setup.html';
                        }else if(state === 'cancel'){
                            // _rt.style.display = 'none';
                            // _opSec.style.display = 'flex';
                            location.href = '/pages/login.html';
                        }else if(state === 'user'){
                            setTimeout(() => {
                                $('#progress').removeClass('load');
                                $('#progress').addClass('loaded');
                                setTimeout(() => {
                                    window.location.hash = '/nimo#app';
                                }, 2000)
                            }, 4000)
                           
                            console.log('logged in');
                        }
                    }else{
                        console.log('user not registered yet')
                        _rt.style.display = 'none';
                        _opSec.style.display = 'flex';
                        window.location.hash = '/pages/login.html';
                    }
                }else{
                    console.log('not logged in')
                    //display login/sign in page
                    setTimeout(() => {
                        $('#progress').removeClass('load');
                        $('#progress').addClass('loaded');

                        setTimeout(() => {
                            window.location.hash = '/pages/login.html';
                        }, 3000)
                    }, 5000)
                }
            })
            function _switchMode(){
                if(_rt != null && _opSec != null){
                    document.title = 'Login - Nimo'
                    _rt.style.display = 'none';
                    _opSec.style.display = 'flex';
                    worker._sn._phs0();
                }
            }
            async function getState(_usr_){
                console.log(_usr_)
                let _state_;
                await _fsDb.collection('client').doc(_usr_).collection(_usr_).doc('meta')
                .get()
                .then((_doc_) => {
                    if(_doc_.exists){
                        _state_ = _doc_.data().state;
                    }else{
                        _state_ = 'null'
                        console.log('doc doesnt exist')
                    }
                    return _state_;
                }).catch(err => {
                    console.log('%c something went wrong!, retrying in 5 sec', utilities.consoleColor)
                    $('#spinnerx').addClass('show');
                    setTimeout(() => {
                        location.reload();
                    }, 2000)
                })

                return _state_;
            }
        }
    }
    const run = () => {
        dom.preloader();
        // dom.preloader2();
        // dom.initUi.renderHome(lsDB.getItem('_stds'));
        // util.cordion();
        // util.toggleProfile();
        // util.toggleInfo();
        // util.toggleActions();
        service.runContext();
        // dom.sanMoji();
        // worker._sn._phs1();
        // worker._onAuth();
        
        (function(){
            auth.onAuthStateChanged( async __usr__ => {
                if(__usr__){
                    console.log('Logged in as', __usr__.uid);
                    const meta_data = await getMeta(__usr__.uid);
    
                    lsDB.setItem('deamon', __usr__.uid);
                    lsDB.setItem('user_id', meta_data[1]);
                    lsDB.setItem('default_color', meta_data[2]);
    
                    const state = meta_data[0];
                    console.log(meta_data)
    
                    if(state != null){
                        console.log('%cUSER STATE : '+state, 'color: #23e34d');
                        if(state === 'setup'){
                            location.href = `/pages/setup.html?uid=${__usr__.uid}`;
                            console.log('rewinding setup ..')
                        }else if(state === 'cancel'){
                            location.href = '/pages/login.html';
                        }else if(state === 'user'){
                            hide_preloader();
                            console.log('%cUSER STATE : USER', 'color: #23e34d');     
                        }
                    }else{
                        console.log('state : '+state);
                        console.log('user not registered yet');
                    }
                }else{
                    console.log('not registered yet as a user');
                    location.href = '/pages/login.html';
                }
            })
            async function getMeta(_usr_){
                console.log(_usr_)
                let _state_ = [];
    
                await _fsDb.collection('client').doc(_usr_).collection(_usr_).doc('meta')
                .get()
                .then((_doc_) => {
                    if(_doc_.exists){
                        _state_.push(_doc_.data().state);
                        _state_.push(_doc_.data().user_id);
                        _state_.push(_doc_.data().default_color);
                    }else{
                        _state_ = 'null'
                        console.log('doc doesnt exist, sending you to login page');
                    }
                    return _state_;
                }).catch(err => {
                    console.log('%cSomething went wrong!, retrying in 5 sec', utilities.consoleColor)
                    $('#spinnerx').addClass('show');
                    setTimeout(() => {
                        location.reload();
                    }, 2000)
                })
                return _state_;
            }
        }());
        function hide_preloader(){
            $('#spinnerx').removeClass('load');
            if($('#spinnerx').length > 0){
                $('#spinnerx').removeClass('show');
            }
        }
    }
    // function sendMessage(){
    //     let msgIn = document.querySelector('#msg-input'),
    //         deamon = lsDB.getItem('deamon'),
    //         cache = lsDB.getItem('vRay');

    //     if(msgIn != null){
    //         console.log('input not null');
    //         msgIn.addEventListener('keyup', (evt) => {
    //             evt.preventDefault();
    //             if(evt.key == 'Enter' || evt.keyCode === 13){
    //                 if(msgIn.value != '' || msgIn.value.length < 0){
    //                     let msg = msgIn.value,
    //                         date = new Date(),
    //                         _CACHE_ = lsDB.getItem('cache'),
    //                         _cacheData = _CACHE_.split(',');
    //                     console.log(deamon, cache, _cacheData[0], _cacheData[1], date, msg)
    //                     console.log('sending message to '+ cache)
    //                     _fsDb.collection('/client').doc('node').collection(cache)
    //                     .add(
    //                         {
    //                             userName: _cacheData[0],
    //                             clientAvatar: _cacheData[1],
    //                             timeStamp: `${date}`,
    //                             content: msg
    //                         }
    //                     )
    //                     .then(()=> {
    //                         console.log('done 💌')
    //                         msgIn.value = '';
    //                     }).catch(err =>{
    //                         console.log('opssyy!', err)
    //                     })
    //                 }
    //             }
    //         })
    //     }else{
    //         console.log('input is null')
    //     }

    // }
    // sendMessage();
    
    run();


}())



// let cid = lsDB.getItem('godRay')
// router
// .add(`#chat/${cid}`, async () => {
//     console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
//     // container.innerHTML = await pages.booking.render()
//     // pages.booking.after_render()
//     // ui.renderNavbar()
// })
// // .add(/confirm-booking/, async () => {
// //     // // console.log()
// //     // container.innerHTML = await pages.confirmBooking.render()
// //     // pages.confirmBooking.after_render()
// //     // ui.hideNavBar()
// // })
