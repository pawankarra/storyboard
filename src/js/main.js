/**
 * miniPaint - https://github.com/viliusle/miniPaint
 * author: Vilius L.
 */

//css
import './../css/reset.css';
import './../css/layout.css';
import './../css/menu.css';
import './../css/print.css';
import './../css/style4.css';
import './../../node_modules/alertifyjs/build/css/alertify.min.css';
//js
import config from './config.js';
import Base_gui_class from './core/base-gui.js';
import Base_layers_class from './core/base-layers.js';
import Base_tools_class from './core/base-tools.js';
import Base_state_class from './core/base-state.js';
import File_search_media_class from './modules/file/search.js';
import File_open_class from './modules/file/open.js';
import File_new_class from './modules/file/new.js';
import File_save_class from './modules/file/save.js';
import Tools_borders_class from './modules/tools/borders.js';
import GUI_tools_class from './core/gui/gui-tools.js';

window.addEventListener('load', function (e) {
	//initiate app
	var Layers = new Base_layers_class();
	var Base_tools = new Base_tools_class(true);
	var GUI = new Base_gui_class();
	var Base_state = new Base_state_class();
	var search = new File_search_media_class();
	var f_file = new File_open_class();
	var new_file = new File_new_class();
	var save_file = new File_save_class();
	var tools = new Tools_borders_class();
	var gui_tools = new GUI_tools_class();
	//var selection = new Base_selection_class()

	//register as global for quick or external access
	window.Layers = Layers;
	window.AppConfig = config;
	window.State = Base_state;	// window.State.save();

	//render all
	GUI.load_modules();
	GUI.load_default_values();
	GUI.render_main_gui();

	Layers.init();

	var canvas = document.getElementById('canvas_minipaint');
	var ctx = canvas.getContext('2d');


	$('#imagesearch').click(function () {
		openNav();
		//search.search();
		//$('#template').addClass("active");
	});


	$('#newtemplate').click(function () {
		new_file.new();
	});


	$('#savefile').click(function () {
		console.log("saved");
		save_file.save();
	});


	$('#undo').click(function () {
		tools.borders();
	});


	$('#template').on('click', 'img', function () {
		alert(this);
	})


	$('.switch-icons').on('click', function () {
		if ($(this).html() === '-') {
			$(this).html('+');
		} else {
			$(this).html('-');
		}

		$('.title,.content').slideToggle();
	});


	$('.searchbtn').click(function () {
		//search.search();
		//$('#template').addClass("active");
		var d = new Object();
		d.text = $('#search-text').val();
		//$.post("http://54.186.153.173:9000/n3n/cloud/tags/themes", JSON.stringify(d), function(result){
		$.post("http://54.186.153.173:9000/n3n/cloud/syntax", JSON.stringify(d), function (result) {
			//console.log(result);
			//var obj = JSON.parse(result);
			var templates = JSON.parse(result).templates;
			var images = JSON.parse(result).images;
			var html = '';
			var imageArray = [];

			if (images.length > 0) {
				for (var i in images) {
					imageArray.push(images[i].webformatURL);
					html += '<div class="item pointer">';
					html += '<img class="displayBlock" alt="" src="' + images[i].previewURL + '" data-url="' + images[i].webformatURL + '" />';
					html += '</div>';
				}
				//fix for last line
				html += '<div class="item"></div>';
				html += '<div class="item"></div>';
				html += '<div class="item"></div>';
				html += '<div class="item"></div>';
			}
			//$('#theme-list').html('');
			var htmls = "<span>TEMPLATES</span>"
			htmls += "<ul class='theme-ul' data-key='" + JSON.stringify(imageArray) + "'>";

			for (var i = 0; i < templates.length; i++) {
				htmls += "<li id='" + templates[i].image + "'><img src='" + templates[i].image + "'>";
				htmls += "<div class='text'>" + templates[i].tag + "</div></li>";
			}

			htmls += '</ul>'
			$('#theme-list').html(htmls);


			$('#image-wrapper').empty();
			var node = document.createElement("div");
			node.classList.add('flex-container');
			node.innerHTML = html;
			$('#image-wrapper').show();
			document.querySelector('#image-wrapper').appendChild(node);
			var targets = document.querySelectorAll('#image-wrapper .item img');

			for (var i = 0; i < targets.length; i++) {
				targets[i].addEventListener('click', function (event) {
					//window.State.save();
					//this.dataset.url = this.dataset.url.replace('_640.', '_960.');
					this.dataset.url = this.dataset.url;
					var data = {
						url: this.dataset.url,
					};
					console.log("@#@#$@#$@$@#$@#$@$@#$", data);
					f_file.file_open_url_handler(data, "");
				});
			}

		});

	});


	$('#image-wrapper .item').on('click', 'img', function () {
		console.log('this');
	});


	$('#printemplate').click(function () {
		printCanvas();
	});


	function printCanvas() {
		const dataUrl = document.getElementById('canvas_minipaint').toDataURL();
		let windowContent = '<!DOCTYPE html>';
		windowContent += '<img src="' + dataUrl + '">';
		console.log(screen.availWidth);
		const printWin = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
		printWin.document.open();
		printWin.document.write(windowContent);

		printWin.document.addEventListener('load', function () {
			printWin.focus();
			printWin.print();
			printWin.document.close();
			printWin.close();
		}, true);
	}


	$('.closebtn').click(function () {
		closeNav();
	});


	$('#layoutsearch').click(function () {
		var name = $('#template').attr('data-name');
		if (name != undefined) {
			$('#layout').removeClass('hidden');
			dragElement(document.getElementById(("layout")));
			var data = new Object();
			data.text = $('#template').attr('data-name');

			$.post("http://54.186.153.173:9000/n3n/cloud/tags/layout", JSON.stringify(data), function (result) {
				//$('#layoutbody').html('');
				console.log(result);
				var html = '<ul>';
				var output = JSON.parse(result);
				for (var i = 0; i < output.length; i++) {
					html += "<li><img src=" + output[i].screen + "></li>";
				}
				html += '</ul>'
				$('#layoutbody').append(html);
			});
		}
	});

	$('#layoutheader i').click(function () {
		$('#layout').addClass('hidden');
	});


	function openNav() {
		document.getElementById("myNav").style.width = "100%";
	}


	function closeNav() {
		document.getElementById("myNav").style.width = "0%";
	}


	$('#theme-list').on('click', '.theme-ul li', function () {
		var d = new Object();
		//console.log($('.theme-ul').attr('data-key'));
		var img = JSON.parse($('.theme-ul').attr('data-key'));
		d['url'] = $(this).attr('id');

		$.post("http://54.186.153.173:9000/n3n/cloud/app/sample", JSON.stringify(d), function (result) {
			//console.log(result);
			var output = JSON.parse(result);
			var o_data = output.data;
			for (var i = 0; i < o_data.length; i++) {
				var placeholder = "placeholder" + i + ".png";
				if (img[i] != undefined) {
					output.data[i].data = img[i];
				} else {
					output.data[i].data = "http://54.186.153.173:9000/images/" + placeholder + "";
				}
			}
			f_file.load_json(JSON.stringify(output));
			closeNav();
			$('#layout').addClass('hidden');
			$('#layoutbody').html('');
			$('.head-right-span').show();
		});
	});


	$('#canvas_minipaint').click(function () {
		gui_tools.activate_tool('select');
	});


	$('body').on('keypress', '.searchbtn', function (args) {
		if (args.keyCode == 13) {
			$('.searchbtn').click();
			return false;
		}
	});


	$('#img-update').click(function () {
		var listItems = $(".image-lister .imageList");
		var html = '';

		listItems.each(function (idx, li) {
			var product = $('.imageList').closest('div').find('img').attr('src');
			console.log(product);
			if (product.length > 10) {
				console.log(product);
				// and the rest of your code
				html += "<div class='item pointer'><img class='displayBlock' alt src='http://54.186.153.173/unsafe/60x90/" + product + "' data-url='" + product + "'>";
				html += "</div>";
			}
		});

		$('#image-wrapper .flex-container').prepend(html);
	});


	$('#layoutbody').on('click', 'ul li', function () {
		var d = new Object();
		var img = JSON.parse($('.theme-ul').attr('data-key'));
		d['url'] = $(this).find('img').attr('src');

		$.post("http://54.186.153.173:9000/n3n/cloud/app/sample", JSON.stringify(d), function (result) {
			//console.log(result);
			var output = JSON.parse(result);
			var o_data = output.data;
			for (var i = 0; i < o_data.length; i++) {
				if (img[i] != undefined) {
					output.data[i].data = img[i];
				}
			}
			f_file.load_json(JSON.stringify(output));
		});
	});

	$('.tab-center ul li').click(function () {
		$(".sub-tab").addClass('hidden');
		console.log($(this).find('a').text().trim());
		var temp_html = '';

		if ($(this).find('a').text().trim() == "Download") {
			temp_html += "<div class='download-image'>";
			temp_html += "<input type='radio' name='download' value='PNG'> PNG";
			temp_html += "<input type='radio' name='download' value='JPG'> JPG";
			temp_html += "<input type='radio' name='download' value='GIF'> GIF";
			temp_html += "<input type='radio' name='download' value='WEBP'> WEBP";
			temp_html += "<input type='radio' name='download' value='BMP'> BMP";
			temp_html += "<input type='button' name='go' id='btn-type' value='GO'>";
			temp_html += "</div>";
		}

		$(".sub-tab").append(temp_html);
		//$(".sub-tab").removeClass('hidden');
		$(".sub-tab").slideDown("slow");
	})

	/*$('#redo').click(function() {
		console.log($(".sub-tab"));
		$(".sub-tab").removeClass('hidden');
		$(".sub-tab").slideDown("slow");
	});
	*/
	$(".btnSubmit").on('click', (function (e) {
		e.preventDefault();
		//console.log(new FormData(this));
		var files = $('#userImage')[0].files;
		for (var i = 0, f; f = files[i]; i++) {
			//console.log(new FormData(f));
			var formData = new FormData();
			formData.append('userImage', f);
			$.ajax({
				url: "http://54.186.153.173:9000/n3n/cloud/vision/tags",
				type: "POST",
				data: formData,
				beforeSend: function () { $("#body-overlay").show(); },
				contentType: false,
				processData: false,
				success: function (data) {
					var obj = JSON.parse(data);
					$("#targetLayer").css('opacity', '1');
					var tags = obj.tags;
					var html = '';
					html += '<ul class="tags-list" id="tags-list' + obj.id + '" data-id=' + obj.id + '>';
					html += '<li><div class="input-group"><input type="text" class="form-control" id=' + obj.id + ' placeholder="Add Custom Tags" name="search" hidden><div class="input-group-btn"><button class="btn btn-default" id="tag-update" type="submit"><i class="glyphicon glyphicon-plus"></i></button></div></div></li>'
					for (var i = 0; i < tags.length; i++) {
						html += '<li>' + tags[i] + '</li>';
					}
					html += '</ul>';
					var imageurl = 'http://54.186.153.173:9000/images/' + obj.name;
					var imagehtml = '';
					imagehtml += "<li class='imageList'><div class='img-title' style='width:420px;'><span>" + obj.name + "</span></div><div class='div-left floater'><img src=" + imageurl + "></div>";
					imagehtml += "<div class='div-right floater'>" + html + "</div></li>";
					$('.image-lister').append(imagehtml);
					//$('.icon-choose-image').show();    
					//setInterval(function() {$("#body-overlay").hide(); },500);
					return false;
				},
				error: function () {
					alert("please update valid photo");
				}
			});
		}
	}));


	$(document).on('click', '.input-group-btn #tag-update', function (e) {
		var d = new Object();
		var image_id = $(e.target).closest('ul').attr('data-id');
		d.id = image_id;
		d.tags = $('#' + image_id).val();
		console.log(d);

		$.ajax({
			url: "http://54.186.153.173:9000/n3n/cloud/tags/update",
			type: "POST",
			data: JSON.stringify(d),
			contentType: false,
			processData: false,
			success: function (data) {
				var obj = JSON.parse(data);
				console.log(obj);
				var html = '';
				var tags = obj.tags;
				html += '<ul class="tags-list" id="tags-list' + obj.id + '" data-id=' + obj.id + '>';
				html += '<li><div class="input-group"><input type="text" class="form-control" id=' + obj.id + ' placeholder="Add Custom Tags" name="search" hidden><div class="input-group-btn"><button class="btn btn-default" id="tag-update" type="submit"><i class="glyphicon glyphicon-plus"></i></button></div></div></li>'
				for (var i = 0; i < tags.length; i++) {
					html += '<li>' + tags[i] + '</li>';
				}
				html += '</ul>';
				$(e.target).closest('ul').html(html);
				//$('.display-tags').empty();
				//$('.display-tags').append(html);
			}
		});
	});


	//Make the DIV element draggagle:

	function dragElement(elmnt) {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		if (document.getElementById(elmnt.id + "header")) {
			/* if present, the header is where you move the DIV from:*/
			document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
		} else {
			/* otherwise, move the DIV from anywhere inside the DIV:*/
			elmnt.onmousedown = dragMouseDown;
		}

		function dragMouseDown(e) {
			e = e || window.event;
			// get the mouse cursor position at startup:
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			// call a function whenever the cursor moves:
			document.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || window.event;
			// calculate the new cursor position:
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			// set the element's new position:
			elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}

		function closeDragElement() {
			/* stop moving when mouse button is released:*/
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}



	// text editor
	$('#text').click((e) => {
		e.preventDefault();
		e.stopPropagation();
		gui_tools.activate_tool('text');
	});


}, false);
