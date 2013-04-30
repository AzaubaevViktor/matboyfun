var _alertHead = [
'Ангидрит твою перекись марганца','Апатит твою Хибины мать','В бога душу мать','В рот пароход','Грёбаный Экибастуз','Да ёксель-мопсель, трах-тибидох-тибидох','Дри твоё масло','Ё моё','Дарданелла через Босфора Гибралтар и Керченский пролив','Евпатий-коловратий','Едрёна колотушка','Едрёна кочерыжка','Едрёна макарона','Едрёна Матрёна','Едрид-мадрид','Едрит твои лапти','Едрит твою налево','Едрить твою колотушку','Едрить тебя за ногу','Едрическая сила','Едрический сандаль','Едришкин шиш','Ёж твою в корень','Ёк кошелёк','Ёк макарёк','Ёкараный бабай','Ёханый бабай','Ёклмн жэпэчэшэце','Ёклмнейка опрстейка','Ёксель-моксель','Ёлки-иголки','Ёлки-метёлки','Ёлки-моталки','Ёлки-палки','Ёлкина вошь','Ёлочки-палочки','Ёлы-палы','Ёперный балет','Ёперный театр','Епишкины калоши','Ёпрст иклмн','Ёптель-коптель','Ёптерный малахай','Ёптыш','Ёпть','Етит твою в качель','Етит твою, Филипыч','Етитный дух','Етить-колотить','Етишкин кот','Ёшки-матрёшки','Кошки-поварёшки','Ёшкин кот','Ёшкин-кошкин','Ёшкин пистолет','Ёшкин свет','И битвою мать-Россия спасена','И биться сердце перестало','Итить твою ежу налево','Итить твою за ногу','Матерь вашу','Мать моя женщина','Мать моя женщина, вся в саже','Мать моя женщина, отец мой мужчина','Мать моя, в коньках на босу ногу','Мать моя Сабонису по пояс','Мать моя с Ярмольником училась','Мать-перемать','Мать твою за ногу','Моп твою ять','Ну ёлки-палки','Ну ё-моё, черешня','Эфиоптвоюмать','Ядрён-батон','Япона мать','Японский башмак','Японский бог','Японский городовой','Японский хрен','Японский чайник','Разгридрит твою перекись водорода','Раскудрить твою через коромысло','Растудысь его в тудысь','Растудыть твою налево','Твою дивизию','Твою ж маму','Твою качель','Твою мать дивизию три раза за ногу','Твою мать через семь ворот да с погонами','Тить твою за ногу нехай','Твое налево','Тудыть его за ногу','Тудыть твою налево','В рот мне ноги'
];

var _news = {};

var _Bind = {
    "main.html": // сворачивать-разворачивать новости, подсветка small при наведении, раскрытие новостей, если пользователь не видел их и открытие комментариев на кнопки, работающие pagination
"$('#minimized').click(function(){\
    maxmin_news();\
    return false;\
});\
\
$('.btn-comment').click(function(){\
    var el = $(this);\
    loadcomment(el);\
    return false;\
});\
\
$('.head_quote').mouseenter(function() {\
    $(this).animate({'opacity':1},500);\
    $(this).dequeue();\
}).mouseleave(function() {\
$(this).animate({'opacity':0.6},500);\
$(this).dequeue();\
});\
\
$('.hq_left').find('a').click(function(){\
    showQuote($(this).parent().parent().parent().parent());\
    return false;\
});\
\
_news = {\
    'height':$('#newsheight').height(),\
    'news':$('#news'),\
    'minibutton':$('#minimized')\
};\
$(this).oneTime('500ms',function(){expandNews()});\
$('.pagination').find('a').click(function(){\
        var el = $(this);\
        loadpage(el);\
        return false;\
    });",
// ======================= //
    "add.html": // Обеспечивает работу кнопки отправить на ajax
"$('#send').click(function(){\
    var btn = $(this);\
    startAddSend(btn);\
    return false;\
    })",
// ======================= //
    "stat.html": // При загрузке страницы рисует график
    "draw();"}

var Debugging = false;

// ==== ОБЩИЕ ФУНКЦИИ ====
function d_log(funct,text) {
    if (Debugging) console.log("Function "+funct+": "+text);
}

function startLoadAnimation() {
    d_log('startLoadAnimation:','Start');
    div_loadimage.addClass("spinner").animate({"opacity":1},AnimationTimeSlideHorisontal); // Показываем картинку
}
function stopLoadAnimation() {
    d_log('startLoadAnimation:','Stop');
    div_loadimage.removeClass("spinner").animate({"opacity":0},AnimationTimeSlideHorisontal); // Скрываем картинку
}

function CreateAlert(type,text) { // Создаёт alert и передаёт его идентификатор
    md5 = hex_md5(type+text); // ID создаём из md5
    var head = _alertHead[Math.floor(Math.random() * (_alertHead.length))];
    arr = 
['   <div id='+md5+' class="alert alert-block alert-'+type+' fade in">\n      <button type="button" class="close" data-dismiss="alert">×</button> \n      <strong>'+head+'!</strong>'+text+'\n    </div>',md5];
    return arr; // Передаёт текст и id
} 

function errorLoad(text,thrown) { // Вызывается при ошибке
    $('.alert').alert('close'); // закрывает существующие алерты перед тем, как появится новый
    _showhideimage(); // Показываем неизменённую дату
    a = CreateAlert('error',' Произошла ошибка при загрузке страницы. Текст ошибки: '+thrown+' '+text)
    alerts.append(a[0]); // Добавляем алерт в див с алертами
    $('#'+a[1])
        .alert() // Делаем алерт удаляемым
        .oneTime("10s",function() {$(this).alert('close'); d_log('errorLoad','Closed alert')}); // И убираем его через десять секунд
}

function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

// =========== ДЛЯ СМЕНЫ КОНТЕНТА ===============
var div_content = $('#content'); // Блок с контентом
var div_loadimage = $('#spinner'); // Крутилка-загрузка
var alerts = $('#ForAlerts'); // Див для предупреждений
var AnimationTimeSlideHorisontal = 100; // Время анимации горизонтали
var AnimationTimeSlideVertical = 250; // Время анимации вертикали 


var Data = '';

function startAjax(el) { // Запускаем перед началом запроса
    startLoadAnimation(); // Показываем картинку
    div_content.queue('fx',[]).queue(function() {
        $(this).animate({"margin-left":"0px","opacity":0},AnimationTimeSlideHorisontal);
        $(this).dequeue();
    }); // Показываем и смещаем блок с контентом
    $('#menu').children().removeClass('active'); // Убираем метку активности
}

function insertHTML(el,data,page){ // Выполняет скрипты
    el.html(data);
    scripts = el.find('script');
    // for (i=0; i<scripts.length; i++) {
    //     eval(scripts[i]);
    // }
    eval("$(document).ready(function (){"+_Bind[page]+"})"); // Выаолняет нужный скрипт
    d_log('insertHTML','Page update on "'+page+'"');
}

function _showhideimage(data,page) { // Показываем всё обратно
    stopLoadAnimation(); // Скрываем картинку
    div_content.queue(function() {
        insertHTML($(this),data,page)
        $(this).animate({"margin-left":"20px","opacity":1},AnimationTimeSlideHorisontal); // Показываем и смещаем блок с контентом
        $(this).dequeue();
    });
}

function succesLoadPage(data,status,el,page) { // Вызывается при удачном запросе
    _showhideimage(data,page); // Показываем
    var url = el.attr('href'); // Из родителя достаёт адрес
    history.pushState(null,null,url); // Меняем адрес
    el.parent().addClass('active'); // 
}

function loadpage(el) {
    $('.alert').alert('close'); // Закрывает уже открытые алерты
    var url = el.attr('href'); // Нужный адрес находится в ссылке -- оттуда его и забираем
    $.ajax({
        url: url,
        cache: false,
        dataType: "html",
        data: {},
        beforeSend: function () {startAjax(el)},
        success: function (data,status) {succesLoadPage(data,status,el,url)},
        error: function(XHR,text,thrown) {errorLoad(text,thrown)}
    });
}


// ============= ДЛЯ РАЗВОРОТА НОВОСТЕЙ =================
var isMini = true;

// в _news, которая находится при обновлении страницы, содержатся
// блок с новостями, высота и кнопка

function _max_news() {
    _news['news'].animate({'height':_news['height']},AnimationTimeSlideVertical,'swing');
    _news['minibutton'].text("Свернуть");
    isMini = ! isMini;
    d_log('maxmin_news','Expand News');
}

function _min_news() {
    _news['news'].animate({'height':'1em'},AnimationTimeSlideVertical,'swing');
    _news['minibutton'].text("Развернуть");
    isMini = ! isMini;
    if (isLocalStorageAvailable()) { localStorage.setItem(_news['news'].attr('nid'),'Ы')}
    d_log('maxmin_news','Turn News');
}

function maxmin_news() { // Сворачивает - разворачивает новости
    if (isMini) {
        _max_news();
    } else {
        _min_news();
    }
}

// ================= ДЛЯ ПОДГРУЗКИ КОММЕНТАРИЕВ ================

var commentsOpened = {};

function commentHeightDown(id) {
    d_log('loadcomment','commentHeightDown;');
    var el = $('#comments'+id);
    el.animate({'height':0},AnimationTimeSlideVertical);
    el.children().animate({'opacity':0},AnimationTimeSlideVertical);
    commentsOpened[id] = false;
}

function commentHeightUp(id) {
    d_log('loadcomment','commentHeightDown;');
    var el = $('#comments'+id);
    var height = el.children().height();
    el.animate({'height':height},AnimationTimeSlideVertical);
    el.children().animate({'opacity':'1'},AnimationTimeSlideVertical);
    commentsOpened[id] = true;
}

function succesLoadComm(id,data) {
    d_log('loadcomment','== Success Load ==');
    var el = $("#comments"+id);
    el.children().html(data);
    stopLoadAnimation();
    commentHeightUp(id);
}

function loadcomment(el) { // принимает объект кнопки, которая его вызвала
    var id = el.attr('id').substr(3); // btn123 -> 123
    if (commentsOpened[id] == true) {
        d_log('loadcomment','== Down elements ==;');
        d_log('loadcomment','Id:'+id);
        commentHeightDown(id);
    } else {
        d_log('loadcomment','== Start Ajax ==;');
        var url = 'comments'+id+'.html';
        $.ajax({
            url: url,
            cache: false,
            dataType: "html",
            data: {},
            beforeSend: function () {startLoadAnimation()},
            success: function (data,status) {succesLoadComm(id,data)},
            error: function(XHR,text,thrown) {errorLoad(text,thrown); stopLoadAnimation()} 
        })
    }
}

// ================= ДОБАВЛЕНИЕ ЦИТАТЫ ================

function AddSendError (form,btn) {
    btn.button('loading');
    btn.addClass('btn-danger');
    btn.button('error');}

function AddSendSuccess (form,btn) { // принимает объекты
    btn.button('success');
    btn.addClass('btn-success')
    form.find('input').val('');
    form.find('textarea').val('');
}

function startAddSendAjax (data,form,btn) { // принимает данные и объекты
    btn.button('loading');
    alert('Оп-па гангнам стайл');
    AddSendSuccess(form,btn);
}

function startAddSend(btn) { // Принимает объект
    btn.removeClass('btn-danger'); // Убираем на всякий случай: вдруг есть?
    btn.removeClass('btn-success');
    form = btn.parent().parent();
    name = form.find('#name').val();
    captcha = form.find('#captcha').val();
    text = form.find('#text').val();
    data = {'name':name,'captcha':captcha,'text':text};
    startAddSendAjax(data,form,btn);
}

// ================== АВТО-ОТКРЫтИЕ НОВОСТЕЙ =================
// показывает новости, если пользователь видит их в раз

function expandNews() {
if (isLocalStorageAvailable()) {
    id = $('#news').attr('nid');
    d_log('expandNews','Id of current news is '+id)
    if (localStorage.getItem(id) == null) { // Если в localStorage пусто -- разворачиваем новости, пользователь не заходил
        _max_news();
    }
}
}

// ================= УБЕР-АНИМАЦИЯ ДЛЯ ПРОСМОТРА ОДНОЙ ЦИТАТЫ С ГЛАВНОЙ СТРАНИЦЫ =======================

function showQuote(el) { // получает блок с цитатой
    $("#content").children().not(el).not(".topic").slideUp(AnimationTimeSlideVertical); // Скрываем всё, кроме цитаты
    $(".topic").html("<a href=# onclick='showQuoteAndAll("+el.attr('id')+");'>&larr; Назад</a>");
    loadcomment(el.find(".btn-comment")); // Раскрываем комментарии; так же можно использовать el.click(), если много будет всего
    return false;
}
function showQuoteAndAll(el) { // Получает id цитаты
    id_div = $(el);
    $("#content").children().slideDown(AnimationTimeSlideVertical);
    $(".topic").html("Цитаты");
    loadcomment(id_div.find(".btn-comment"));
    return false;
}

// ================= ВЕШАЕМ ДЕЙСТВИЯ ================

$(document).ready(function (){
    $('#menu').find('a').click(function(){ // Активные менюшка
        var el = $(this);
        loadpage(el);
        return false;
    });
    $('.pagination').find('a').click(function(){
        var el = $(this);
        loadpage(el);
        return false;
    })

    alert.bind('closed', function () { // При закрытии алерта делать его скрытым
          alert.addClass("hide");
    });
    eval(_Bind['main.html']);    // Это костыль, в конечной версии ЭТОГО ЗДЕСЬ БЫТЬ НЕ ДОЛЖНО
    $('.dropdown-toogle').dropdown('toogle');
    $(window).scroll(function () { 
        if ($(this).scrollTop() > 100) $('#move_up').show();
        else                           $('#move_up').hide();  
    }); 
})