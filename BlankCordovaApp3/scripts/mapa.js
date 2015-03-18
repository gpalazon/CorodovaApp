        
    $(function () {
                    

        /*$('#pagEsquerda').click(function () {
            mapa.atualiza();
        });


        $("#Etnia").change(function () {                
            mapa.atualiza();
        });*/

        mapa.inicializa();
            
    });        

var map;
var markers = [];

// Sets the map on all markers in the array.
function setAllMap(m) {
    //alert('setAllMap');
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(m);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    //alert('clearMarkers');
    setAllMap(null);
}


var mapa = {

    inicializa: function () {

        // Google has tweaked their interface somewhat - this tells the api to use that new UI
        google.maps.visualRefresh = true;


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (p) {

                var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
                var mapOptions = {
                    center: LatLng,
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                var marker = new google.maps.Marker({
                    position: LatLng,
                    map: map,
                    draggable: true,
                    //icon: 'Images/user2.png'
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    //title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
                });

                //marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')

            });
        } else {

            var latlng = new google.maps.LatLng(-23.561965, -46.6557745);

            var mapOptions = {
                center: LatLng,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

            alert('Ops... Não foi possível encontrar a sua localização!.');
        }            

        //var url = 'http://localhost:49562/Service1.svc/getpin';
        //var url = 'http://rest-service.guides.spring.io/greeting';
        var url = "http://localhost:49562/Fornecedor.svc/GetFornecedores";


        /*var dados = [
            { "Altura": 0, "Descricao": "Morena Linda, corpo escultural", "Endereco": "-46.65577450", "Etnia": "Morena", "GeoLat": -23.561965, "GeoLong": -46.6557745, "Id": 5, "Idade": 23, "Imagem": "\/Images\/modelo1p.jpg", "Nome": "Ana Bella", "Olhos": "Verdes", "Preco": 250.00000000 },
            { "Altura": 0, "Descricao": "Loira sensacional, estilo panicat", "Endereco": "-46.65527040", "Etnia": "Loira", "GeoLat": -23.5681011, "GeoLong": -46.6552704, "Id": 9, "Idade": 23, "Imagem": "\/Images\/modelo4p.jpg", "Nome": "Bruna", "Olhos": "Pretos", "Preco": 275.00000000 },
            { "Altura": 0, "Descricao": "Loira", "Endereco": "-46.65527040", "Etnia": "Loira", "GeoLat": -23.566491, "GeoLong": -46.6552704, "Id": 11, "Idade": 23, "Imagem": "\/Images\/modelo6p.jpg", "Nome": "Barbara", "Olhos": "Verdes", "Preco": 300.00000000 },
            { "Altura": 0, "Descricao": "Mulata linda e inteligente. Corpo escultural!", "Endereco": "-46.65095460", "Etnia": "Negra", "GeoLat": -23.567757, "GeoLong": -46.6509546, "Id": 12, "Idade": 23, "Imagem": "\/Images\/modelo2p.jpg", "Nome": "Julia", "Olhos": "Pretos", "Preco": 300.00000000 },
            { "Altura": 0, "Descricao": "Linda Ruiva, serviço completo! Sensacional! Venha me conhecer ;)", "Endereco": null, "Etnia": "Ruiva", "GeoLat": -23.6962756, "GeoLong": -46.7996839, "Id": 13, "Idade": 23, "Imagem": "\/Images\/modelo1p.jpg", "Nome": "Barbara", "Olhos": "Azuis", "Preco": 275.00000000 },
            { "Altura": 0, "Descricao": "japa linda e divertida", "Endereco": null, "Etnia": "Assiática", "GeoLat": -23.7263789, "GeoLong": -46.5611202, "Id": 14, "Idade": 23, "Imagem": "\/Images\/modelo4p.jpg", "Nome": "Juliana", "Olhos": "pretos", "Preco": 200.00000000 }
        ];*/

        $.ajax({
            cache: true,
            url: url,
            data: "{}",
            type: "GET",
            jsonpCallback: "ListFornecedores",
            contentType: "application/javascript",
            dataType: "jsonp",
            error: function () {
                alert("Menu failed!");
            },
            success: function (dados) {
                
                //alert("Success");

                $.each(dados, function (i, item) {

                    //alert('Nome: ' + item.Nome + ', ' + item.Etnia);

                    var marker = new google.maps.Marker({
                        'position': new google.maps.LatLng(item.GeoLat, item.GeoLong),
                        'map': map,
                        'title': item.Nome
                    });

                    //Inclui o Pin no array
                    markers.push(marker);

                    // Make the marker-pin red!
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')

                    // put in some information about each json object - in this case, the opening hours.
                    var infowindow = new google.maps.InfoWindow({
                        content: "<html><body><table><tr><td></td><td rowspan='6'><img alt='' src='" + item.Imagem + "' width='75px' /></td><td></td><td>Nome: &nbsp;</td><td>" + item.Nome + "</td></tr><tr><td></td><td></td><td>Idade: &nbsp;</td><td>" + item.Idade + "</td></tr><tr><td></td><td></td><td>Etnia: &nbsp;</td><td>" + item.Etnia + "</td></tr><tr><td></td><td></td><td>Olhos: &nbsp;</td><td>" + item.Olhos + "</td></tr><tr><td></td><td></td><td>Preço: &nbsp;</td><td>R$" + String(item.Preco) + "</td></tr><tr><td></td><td></td><td colspan='2'><a href='../Fornecedor/View1/" + item.Id + "'>Visualizar Perfil</a></td></tr></table></body></html>"
                    });

                    // finally hook up an "OnClick" listener to the map so it pops up out info-window when the marker-pin is clicked!
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                    });

                    //alert(item.Nome + " - " + item.GeoLong + " x " + item.GeoLat);
                });

            }
        });           


        /*
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            //data: { etnia: '' },            
            success: function (dados) {
                //alert('teste');
                // Using the JQuery "each" selector to iterate through the JSON list and drop marker pins
                $.each(dados, function (i, item) {

                    //alert('Nome: ' + item.Nome + ', ' + item.Etnia);

                    var marker = new google.maps.Marker({
                        'position': new google.maps.LatLng(item.GeoLat, item.GeoLong),
                        'map': map,
                        'title': item.Nome
                    });

                    //Inclui o Pin no array
                    markers.push(marker);

                    // Make the marker-pin red!
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')

                    // put in some information about each json object - in this case, the opening hours.
                    var infowindow = new google.maps.InfoWindow({
                        content: "<html><body><table><tr><td></td><td rowspan='6'><img alt='' src='" + item.Imagem + "' width='75px' /></td><td></td><td>Nome: &nbsp;</td><td>" + item.Nome + "</td></tr><tr><td></td><td></td><td>Idade: &nbsp;</td><td>" + item.Idade + "</td></tr><tr><td></td><td></td><td>Etnia: &nbsp;</td><td>" + item.Etnia + "</td></tr><tr><td></td><td></td><td>Olhos: &nbsp;</td><td>" + item.Olhos + "</td></tr><tr><td></td><td></td><td>Preço: &nbsp;</td><td>R$" + String(item.Preco) + "</td></tr><tr><td></td><td></td><td colspan='2'><a href='../Fornecedor/View1/" + item.Id + "'>Visualizar Perfil</a></td></tr></table></body></html>"
                    });

                    // finally hook up an "OnClick" listener to the map so it pops up out info-window when the marker-pin is clicked!
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                    });

                    //alert(item.Nome + " - " + item.GeoLong + " x " + item.GeoLat);
                });

                $("#Etnia").val(0);

            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.status == 404) {
                    alert(thrownError);
                }
            }
        });*/



    },
    atualiza: function () {

        //var map;

        //map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

        var etnia = $("#Etnia").val()

        $.ajax({
            url: 'http://localhost:58062/Mapa/GetPin',
            dataType: 'json',
            type: 'GET',
            data: { etnia: '' },
            success: function (dados) {

                clearMarkers();

                $.each(dados, function (i, item) {

                    //alert('Nome: ' + item.Nome + ', ' + item.Etnia);

                    var marker = new google.maps.Marker({
                        'position': new google.maps.LatLng(item.GeoLat, item.GeoLong),
                        'map': map,
                        'title': item.Nome
                    });

                    //Inclui o Pin no array
                    markers.push(marker);

                    // Make the marker-pin red!
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')

                    // put in some information about each json object - in this case, the opening hours.
                    var infowindow = new google.maps.InfoWindow({
                        //content: "<div class='infoDiv'><h2>" + item.PlaceName + "</h2>" + "<div><h4>Opening hours: " + item.OpeningHours + "</h4></div></div>"
                        //content: "<html><body><table><tr><td></td><td rowspan='6'><img alt='' src='" + item.Imagem + "' width='75px' /></td><td></td><td>Nome: &nbsp;</td><td>" + item.Nome + "</td></tr><tr><td></td><td></td><td>Idade: &nbsp;</td><td>" + item.Idade + "</td></tr><tr><td></td><td></td><td>Etnia: &nbsp;</td><td>" + item.Etnia + "</td></tr><tr><td></td><td></td><td>Olhos: &nbsp;</td><td>" + item.Olhos + "</td></tr><tr><td></td><td></td><td>Preço: &nbsp;</td><td>" + item.Preco + "</td></tr><tr><td></td><td></td><td colspan='2'><a href='../Perfil.aspx'>Visualizar Perfil</a></td></tr></table></body></html>"
                        content: "<html><body><table><tr><td></td><td rowspan='6'><img alt='' src='" + item.Imagem + "' width='75px' /></td><td></td><td>Nome: &nbsp;</td><td>" + item.Nome + "</td></tr><tr><td></td><td></td><td>Idade: &nbsp;</td><td>" + item.Idade + "</td></tr><tr><td></td><td></td><td>Etnia: &nbsp;</td><td>" + item.Etnia + "</td></tr><tr><td></td><td></td><td>Olhos: &nbsp;</td><td>" + item.Olhos + "</td></tr><tr><td></td><td></td><td>Preço: &nbsp;</td><td>R$" + String(item.Preco) + "</td></tr><tr><td></td><td></td><td colspan='2'><a href='../Fornecedor/View1/" + item.Id + "'>Visualizar Perfil</a></td></tr></table></body></html>"
                    });

                    // finally hook up an "OnClick" listener to the map so it pops up out info-window when the marker-pin is clicked!
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                    });

                    //alert(item.Nome + " - " + item.GeoLong + " x " + item.GeoLat);
                });

            },
            error: function (response) {
                // products.getProductsShowcase(response.token);
                alert('Erro ao consultar os Fornecedores!');
            }
        });
    }

};