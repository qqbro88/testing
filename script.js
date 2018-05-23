const LOCATION_API       = 'http://api.open-notify.org/iss-now.json'; //Текущие координаты МКС
const STUFF_API          = 'http://api.open-notify.org/astros.json'; //Текущий стафф на МКС
var longitude, latitude;

/*
	@Проверка на успешность получения данных
	@Получаем данные из API о координатах МКС
	@Записываем их в глобальные переменные longitude, latitude
	@Выводим данные в HTML 
*/
function locationISS(){ 

	$.getJSON( LOCATION_API, function(data) {

		if( data['message'].toUpperCase() != 'success'.toUpperCase() ) {

			throw new Error('Cant recieve location data!');

		}else {

			longitude      =  data['iss_position']['longitude'];
			latitude       = data['iss_position']['latitude'];

			$('.lon').html('longitude: ' + longitude);
	  		$('.lat').html('latitude: ' + latitude);
		}

	});
}

/*
	@Проверка на успешность получения данных
	@Получаем данные из API о людях, находящихся в космосе
	@Выбираем из них тех, кто находится на МКС и создаем из них нвоый массив
	@Выводим данные в HTML
*/
function stuffISS(){

	$.getJSON( STUFF_API, function(data) {
		var currentStuff = [];

		if( data['message'].toUpperCase() != 'success'.toUpperCase() ) {

			throw new Error('Cant recieve stuff data!');

		}else {

			for(let i = 0; i < data['people'].length; i++){
				
				if( data['people'][i]['craft'].toUpperCase() == 'ISS'.toUpperCase()){
					currentStuff[i] = data['people'][i]['name'];
				}

			}
		}

		for(let i = 0; i < currentStuff.length; i++){
			var listElem = $("<li class='stuff-list-item'></li>").html(currentStuff[i]);
			$('.stuff-list').append(listElem);
		}

		$('.stuff-capacity').html('Total amount: ' + currentStuff.length + ' people on ISS')
	});
}

/*
	@Шаблон взят из документации Google
	@Меняем lat и lng на данные из переменных longitude, latitude, которые были получены в locationISS()
*/
function initMap() {
    var myLatLng = {
    	lat: +latitude, 
    	lng: +longitude
    };

    var map = new google.maps.Map( document.getElementById('map'), {
      zoom: 4,
      center: myLatLng
    });

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'ISS current location'
    });
}

/*
	@Получаем время UTC
	@Делаем его с ведущим 0 для большей наглядности
	@Дату получаем с помощью toLocaleString()
*/
function timer(){
	var date = new Date();
	var secs = date.getUTCSeconds();
	var hours = date.getUTCHours();
	var mins = date.getUTCMinutes();

	if( secs < 10 ) secs = '0' + secs;
	if( hours < 10 ) hours = '0' + hours;
	if( mins < 10 ) mins = '0' + mins;

	var options = {
	  year: 'numeric',
	  month: 'long',
	  day: 'numeric',
	  weekday: 'long',
	  timezone: 'UTC'
	};

	$('.time').html( 'Current UTC time: ' + hours + ':' + mins + ':' + secs );
	$('.date').html( date.toLocaleString("en-US", options) );
}

function go(){
	timer();
	stuffISS();
	locationISS();
}

go();

setTimeout( initMap, 500 ); //Поставил таймаут т.к. locationISS() не успевает записать данные в глобальные переменные longitude, latitude и тогда приходится ждать 5 сек

setInterval( function(){
	locationISS();	
	initMap();
}, 5000 );

setInterval( function(){
	timer();
}, 1000 );