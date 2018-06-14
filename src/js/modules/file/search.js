import config from './../../config.js';
import File_open_class from './open.js';
import Dialog_class from './../../libs/popup.js';
import alertify from './../../../../node_modules/alertifyjs/build/alertify.min.js';

/** 
 * manages iamge search on https://pixabay.com/en/service/about/api/
 */
class File_search_media_class {

	constructor() {
		this.File_open = new File_open_class();
		this.POP = new Dialog_class();
		this.cache = [];
	}

	/**
	 * Image search api
	 * 
	 * @param {string} query
	 * @param {array} data
	 */
	search(query = '', data = []) {
		var _this = this;
		var html = '';

		var key = config.pixabay_key;
		key = key.split("").reverse().join("");
		console.log("pkarra",data);
		if (data.length > 0) {
			for (var i in data) {
				html += '<div class="item pointer">';
				html += '<img class="displayBlock" alt="" src="' + data[i].previewURL + '" data-url="' + data[i].webformatURL + '" />';
				html += '</div>';
			}
			//fix for last line
			html += '<div class="item"></div>';
			html += '<div class="item"></div>';
			html += '<div class="item"></div>';
			html += '<div class="item"></div>';
		}

		var settings = {
			title: 'Whats on your Mind!!',
			comment: '',
			className: 'wide',
			params: [
				{name: "query", title: "Keyword:", value: query.toLowerCase()},
			],
			on_load: function (params) {
				$('#image-wrapper').empty();
				var node = document.createElement("div");
				node.classList.add('flex-container');
				node.innerHTML = html;
				$('#image-wrapper').show();
				document.querySelector('#image-wrapper').appendChild(node);
				//events
				var targets = document.querySelectorAll('#image-wrapper .item img');
				for (var i = 0; i < targets.length; i++) {
					targets[i].addEventListener('click', function (event) {
						//window.State.save();
						this.dataset.url = this.dataset.url.replace('_640.', '_960.');
						var data = {
							url: this.dataset.url,
						};
						_this.File_open.file_open_url_handler(data);
					});
				}
				var views = document.querySelectorAll('#subwin-layout img');
				for (var i = 0; i < views.length; i++) {
					views[i].addEventListener('click', function (event) {
						var d = new Object();
						d.url=$(this).attr('src');
						
						$.post("http://54.186.153.173:9000/n3n/cloud/app/sample", JSON.stringify(d), function(result){
							_this.File_open.load_json(result);
						});
					});
				}
			},
			on_finish: function (params) {
				if (params.query == '')
					return;

				if (_this.cache[params.query] != undefined) {
					//using cache

					setTimeout(function () {
						//only call same fuction after all handlers finishes
						var data = _this.cache[params.query];
						if (parseInt(data.totalHits) == 0) {
							alertify.error('Your search did not match any images.');
						}
						_this.search(params.query, JSON.parse(data));
					}, 100);
				}
				else {
					//query to service

//query to service
                    //http://54.186.153.173:9000/n3n/cloud/app/template/update
                    //var URL = "https://pixabay.com/api/?key=" + key + "&per_page=50&q=" + encodeURIComponent(params.query);
                    //var URL = "http://54.186.153.173:9000/n3n/cloud/syntax";
                    var d  = new Object();
					d.text = params.query.toLowerCase();
					console.log(d);
                    $.post("http://54.186.153.173:9000/n3n/cloud/syntax", JSON.stringify(d), function(result){
                        //console.log("Data: " + JSON.stringify(d) + "\nStatus: " + result);
                        _this.cache[params.query] = result;
						_this.search(params.query, JSON.parse(result));
						//console.log(JSON.parse(result).templates)
						var templates = JSON.parse(result).templates;
						//var htmlString='';
						//htmlString+='<ul style="list-style-type:none;margin:0; padding:5px;">';
						$('#subwin-layout').empty();
						for(var i = 0;i<templates.length;i++){
							console.log(templates[i]);
							$('#subwin-wrapper').show();
							//var anchor = $('<a href="#" class="photo1"><div class="glow-wrap"><i class="glow"></i></div>');
							var img = $('<img id="dynamic">'); //Equivalent: $(document.createElement('img'))
							img.attr('src', templates[i].image);
							img.appendTo('#subwin-layout');
							//anchor.appendTo('#subwin-layout');
							//htmlString+='<li style="height:35px;font-size:1.2em;><a href="#" class="photo"><img src="'+templates[i].image+'"><div class="glow-wrap"><i class="glow"></i></div></a></li>';
						}
						//htmlString+='</ul>';
						$('#subwin-layout').show();
						//document.getElementById('templates').innerHTML(html);
						//console.log(htmlString);
						//document.getElementById("subwin-layout").innerHTML = html;
						//var encoded = decodeURIComponent(htmlString);

						//$('#subwin-layout').append(encoded);
						//_this.File_open.load_json(response);
						var images = JSON.parse(result).images;
						var data = JSON.parse(result).json.template;
						_this.search(params.query, images);
						console.log(data);
						_this.File_open.load_json(JSON.stringify(data));
                    });

					/*var URL = "https://pixabay.com/api/?key=" + key + "&per_page=50&q=" + encodeURIComponent(params.query);
					$.getJSON(URL, function (data) {
						_this.cache[params.query] = data;

						if (parseInt(data.totalHits) == 0) {
							alertify.error('Your search did not match any images.');
						}
						_this.search(params.query, data.hits);
					})
						.fail(function () {
							alertify.error('Error connecting to service.');
						}); */
				}
			},
		};
		this.POP.show(settings);
	}

}

export default File_search_media_class;

