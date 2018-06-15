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
//import Dialog_class from './libs/popup.js';
import Text_class from './tools/text.js';
import Tools_borders_class from './modules/tools/borders.js';
import GUI_tools_class from './core/gui/gui-tools.js';

window.addEventListener('load', function (e) {

	//document.write('<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>');
	document.getElementById("myNav").style.width = "100%";

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
	var text_t = new Text_class();
	//var POP = new Dialog_class();
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

	$('#imagesearch').click(function(){
		openNav();
		//search.search();
		//$('#template').addClass("active");
	});
	
	$('#newtemplate').click(function(){
		new_file.new();
	});

	$('#savefile').click(function(){
		console.log("saved");
		save_file.save();
	});

	$('#undo').click(function(){
		tools.borders();
	});

	$('#template').on('click','img',function(){
		alert(this);
	})

	$('.switch-icons').on('click',function(){
        if($(this).html()==='-'){$(this).html('+');}
        else $(this).html('-')
        $('.title,.content').slideToggle();
	});

	$('#text-search').click(function(){
		console.log('thi');
		gui_tools.activate_tool('text');
		//text_t.load();
	});

	$('.searchbtn').click(function(){
		//search.search();
		//$('#template').addClass("active");
		var d  = new Object();
		d.text = $('#search-text').val();
		//$.post("http://54.186.153.173:9000/n3n/cloud/tags/themes", JSON.stringify(d), function(result){
		$.post("http://54.186.153.173:9000/n3n/cloud/syntax", JSON.stringify(d), function(result){
			//console.log(result);
			//var obj = JSON.parse(result);
			var templates = JSON.parse(result).templates;
			var images = JSON.parse(result).images;
			var html='';
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
			var htmls="<span>TEMPLATES</span>"
			htmls+="<ul class='theme-ul' data-key='"+JSON.stringify(imageArray)+"'>";
			for(var i=0;i<templates.length;i++){
				htmls+="<li id='"+templates[i].image+"'><img src='"+templates[i].image+"'>";
				htmls+="<div class='text'>"+templates[i].tag+"</div></li>";
			}
				htmls+='</ul>'
			$('#theme-list').css('height','600px');	
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
						f_file.file_open_url_handler(data,"");
					});
				}

		});

	});

	$('#image-wrapper .item').on('click','img',function(){
			console.log('this');
	});

	$('#printemplate').click(function(){
		printCanvas();
	});


	function printCanvas()  
{  
	const dataUrl = document.getElementById('canvas_minipaint').toDataURL(); 
	let windowContent = '<!DOCTYPE html>';
	windowContent += '<img src="' + dataUrl + '">';
	console.log(screen.availWidth);
	const printWin = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
	printWin.document.open();
	printWin.document.write(windowContent); 

	printWin.document.addEventListener('load', function() {
		printWin.focus();
		printWin.print();
		printWin.document.close();
		printWin.close();            
	}, true);
}

	$('.head-left').click(function(){
		$.get("https://freegeoip.net/json/",function(output){
			$('.zip').text(output.zip_code);
			if(output.zip_code=="94010"){
				return;
			}else{

				var d = new Object();
				d['zipcode'] = "94010";
				$.ajax({
					url: "http://54.186.153.173:9000/n3n/cloud/app/service/categories",
					type: "POST",
					data:  JSON.stringify(d),
					contentType: false,
					processData:false,
					success: function(data)
					{
						var obj = JSON.parse(data);
						console.log(obj);
						var html="<div class='main'><h3>Concierge</h3>";
						for(var i=0;i<obj.length;i++){
							html+="<div class='view view-first'>";
							html+="<img src="+obj[i].icon+" />";
							html+="<div class='mask'><h2>"+obj[i].category+"</h2><p>"+obj[i].desc+"</p>";
							html+="<a href='#' data-name="+obj[i].category+" data-toggle='modal' data-target=#exampleModalCenter1 class='info'>Explore Options</a></div></div>";
							/*console.log(obj[i].icon);
							html+="<li data-item="+obj[i].category+"><p>"+obj[i].category+"</p>";
							html+="<img src='"+obj[i].icon+"'>";
							//html+="<p>"+obj[i].desc+"</p></li>";*/
						}
						html+="</div>";
						$('#sidebar').addClass('hidden');
						$('.image-header').css("left","0");
						//$('.categories').append(html);
						$('.conc-view').removeClass('hidden');
						$('.conc-img-sticker').append(html);
					}
				});
			}
		});
		 // $('.panel-wrap').css('transform','translateX(0%)');
	});

	/*$('.conc-img-sticker').on('click','.view .mask a',function(){
		console.log(this.dataset.name);
		//this.dataset.item;
		
	});
	*/

	$('.conc-img-sticker').on('click','.view .mask a',function(){
		//$('.canvas_wrapper').hide();
		//$('.panel-wrap').css('transform','translateX(100%)');
		$('#sidebar').addClass('hidden');
		$('.image-header').css("left","0");
		
		var template = $('#template').attr('data-name');
		var name = template;//"birthday-"+Math.floor(Math.random() * (9999 - 2323 + 1)) + 2323;
		var params = new Object();
		params.cType = "Birthday";
		params.calc_size = true;
		params.delay = 400;
		params.layers = "All";
		params.name = template;
		params.quality = 90;
		params.type = "JSON - Full layers data";
		params.wType = "TEMPLATE";
		params.widget_name="Pavan Karra";
		params.saveType = "next";
		//save_file.save_action(params);

		var d = new Object();
		var itemname = this.dataset.name;
		console.log("==================>",itemname);
		d.zipcode="94010";

		/*$('#myModal').modal({
			show : true
		});*/

		$.ajax({
			url: "http://54.186.153.173:9000/n3n/cloud/images/services",
			type: "POST",
			data:  JSON.stringify(d),
			contentType: false,
			processData:false,
			success: function(data)
			{
				var obj = JSON.parse(data);
				console.log(obj);
				var html=''; 
				$('.conc-view').removeClass('hidden');
				html+='<ul class="conc-img-list">';
				$('.lister-title').text(itemname);
				for (var key in obj) {
					//console.log(obj[key],$(this).attr("data-item"));
					if(key == itemname.toLowerCase()){
						for(var i=0;i<obj[key].length;i++){
							console.log(obj[key][i]);
							var price = obj[key][i].price.split('.');
							html+='<li><div class="image-info"><img style="height:210px;width:250px;" src='+obj[key][i].url+'></div>';
							html+='<div class="data-info" style=""><span class="item-title">'+obj[key][i].name+'</span><br/><span class="item-desc">'+obj[key][i].desc+'</span>';
							html+='<div class="price-tag"><span>'+price[0]+'</span><sup>'+price[1]+'</sup></div>';
							html+='<div id="conc-selection" data-toggle="modal" data-type="'+itemname.toLowerCase()+'" data-desc="'+obj[key][i].desc+'" data-name="'+obj[key][i].name+'" data-price="'+obj[key][i].price+'" data-url="'+obj[key][i].url+'" data-property="'+obj[key][i].property+'"><span>Add to Cart</span></div></div></li>';
						}
					}
				}
				html+='</ul>'
				//<span>&#43;</span>
				//if()

				if($('.checkout-list').length < 1){
					$('#image-wrapper').empty();
					$('#image-wrapper').html('<ul class="checkout-list"></ul>');
					//$('.conc-img-sticker').html('');
					var url="http://54.186.153.173/unsafe/120x90/http://54.186.153.173:9000/images/"+name.trim()+".png";
					$('.checkout-list').append("<li data-name='"+name.trim()+"' data-price='5.99' data-url='"+url+"' data-property='birthday'><img data-type='template' data-url='http://54.186.153.173:9000/images/"+name.trim()+".png' src='"+url+"'></li>");
				}else{
					$('#exampleModalLongTitle').text("checkout");
				}
				$('.modal-dialog').css("width",'100%');
				console.log('55555',html);
				$('#modalInfo').html(html);
			}
		});

	});





	function loadConcierge(){


	}
	
	$('.closebtn').click(function(){
		closeNav();
	});

	$('#layoutsearch').click(function(){
		var name =$('#template').attr('data-name');
		if(name != undefined){
			$('#layout').removeClass('hidden');
			dragElement(document.getElementById(("layout")));
			var data = new Object();
			data.text=$('#template').attr('data-name');
			$.post("http://54.186.153.173:9000/n3n/cloud/tags/layout", JSON.stringify(data), function(result){
				//$('#layoutbody').html('');
				console.log(result);
				var html='<ul>';
				var output = JSON.parse(result);
				for(var i=0; i<output.length;i++){
					html+="<li><img src="+output[i].screen+"></li>";
				}
				html+='</ul>'
				$('#layoutbody').append(html);
			});
		}
	});

	$('#layoutheader i').click(function(){
		$('#layout').addClass('hidden');
	});

	function openNav() {
		document.getElementById("myNav").style.width = "100%";
	}
	
	function closeNav() {
		document.getElementById("myNav").style.width = "0%";
	}

	$('#theme-list').on('click','.theme-ul li',function(){
		var d=new Object();
		//console.log($('.theme-ul').attr('data-key'));
		var img = JSON.parse($('.theme-ul').attr('data-key'));
		d['url'] = $(this).attr('id');
		$.post("http://54.186.153.173:9000/n3n/cloud/app/sample", JSON.stringify(d), function(result){
			console.log(result);
			var output = JSON.parse(result);
			var o_data = output.data;
			for(var i=0; i<o_data.length;i++){
				var placeholder = "placeholder"+i+".png";
				console.log("karra",output.data[i].data);
				if(img[i]!=undefined){
					if(!output.data[i].data.startsWith("data:image/png")){
						output.data[i].data = img[i];
					}
				}else{
					output.data[i].data = "http://54.186.153.173:9000/images/"+placeholder+"";
				}
			}
			console.log(output);
			f_file.load_json(JSON.stringify(output));
			closeNav();
			$('#layout').addClass('hidden');
			$('#layoutbody').html('');
			$('.head-right-span').show();
		});
	});

	$('#canvas_minipaint').click(function(){
		gui_tools.activate_tool('select');
	});


	

	$('body').on('keypress', '#search-text', function(args) {
		if (args.keyCode == 13) {
			$('.searchbtn').click();
			return false;
		}
	});

	$('#img-update').click(function(){
		var listItems = $(".image-lister .imageList");
		var html='';
		listItems.each(function(idx, li) {
			var product = $('.imageList').closest('div').find('img').attr('src');
			console.log(product);
			if(product.length > 10){
				console.log(product);
				// and the rest of your code
				html+="<div class='item pointer'><img class='displayBlock' alt src='http://54.186.153.173/unsafe/60x90/"+product+"' data-url='"+product+"'>";
				html+="</div>";
			}
		});

			$('#image-wrapper .flex-container').prepend(html);
	});

	$('#layoutbody').on('click','ul li',function(){
		var d=new Object();
		var img = JSON.parse($('.theme-ul').attr('data-key'));
		d['url'] = $(this).find('img').attr('src');
		$.post("http://54.186.153.173:9000/n3n/cloud/app/sample", JSON.stringify(d), function(result){
			//console.log(result);
			var output = JSON.parse(result);
			var o_data = output.data;
			for(var i=0; i<o_data.length;i++){
				if(img[i]!=undefined){
					output.data[i].data = img[i];
				}
			}
			f_file.load_json(JSON.stringify(output));
		});
	});

	$('.tab-center ul li').click(function(){
		$(".sub-tab").addClass('hidden');
		console.log($(this).find('a').text().trim());
		var temp_html = '';
		if($(this).find('a').text().trim() == "Download"){
			temp_html+="<div class='download-image'>";
			temp_html+="<input type='radio' name='download' value='PNG'> PNG";
			temp_html+="<input type='radio' name='download' value='JPG'> JPG";
			temp_html+="<input type='radio' name='download' value='GIF'> GIF";
			temp_html+="<input type='radio' name='download' value='WEBP'> WEBP";
			temp_html+="<input type='radio' name='download' value='BMP'> BMP" ;
			temp_html+="<input type='button' name='go' id='btn-type' value='GO'>";
			temp_html+="</div>";
		}else if ($(this).find('a').text().trim() == "Checkout"){
			$('.modal').css('top','0 !important');
			console.log("this");
			$('.modal-title').text('ORDER DETAILS');
			$('#modalInfo').html('');
			var listItems = $(".checkout-list li");
			$('.modal-dialog-centered').css('width','60%');
			var html="";
			listItems.each(function(idx, li) {
				//html+="<li>";					
				//html+="<div style='float:left;'><img src='http://54.186.153.173/unsafe/120x90/"+$(li).attr('data-url')+"'></div>";
				//html+="<div style='float:left;'><span>"+$(li).attr('data-name')+"</span></br><span style='font-size:1.5em;'>"+$(li).attr('data-price')+"</span></div></li>";

				console.log($(li));
				html+='<div class="product">';
				html+='<div class="product-image">'
				html+='<img src="'+$(li).attr('data-url')+'"></div>';
				html+='<div class="product-details">';
				html+='<div class="product-title">';
				html+=$(li).attr('data-name');
				html+='</div>'
				html+='<p class="product-description">'+$(li).attr('data-desc')+'</p>';
				html+='</div>';					  
				html+='<div class="product-price">';
				html+=$(li).attr('data-price');
				html+='</div><div class="product-quantity"><input type="number" value="2" min="1"></div>';
				html+='<div class="product-removal"><button class="remove-product">Remove</button></div><div class="product-line-price">25.98</div></div>';

				// and the rest of your code
			});
			html+="<div id='chkout'>checkout</div>";
			console.log(html);
			$('#modalInfo').html(html);
								  
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
	$(".btnSubmit").on('click',(function(e) {
		e.preventDefault();
		//console.log(new FormData(this));
		var files = $('#userImage')[0].files;
		for (var i = 0, f; f = files[i]; i++) {
			//console.log(new FormData(f));
			var formData = new FormData();
			formData.append( 'userImage', f );
			$.ajax({
				url: "http://54.186.153.173:9000/n3n/cloud/vision/tags",
				type: "POST",
				data:  formData,
				beforeSend: function(){$("#body-overlay").show();},
				contentType: false,
				processData:false,
				success: function(data)
				{
					var obj = JSON.parse(data);    
					$("#targetLayer").css('opacity','1');
					var tags = obj.tags;
					var html=''; 
					html+='<ul class="tags-list" id="tags-list'+obj.id+'" data-id='+obj.id+'>';
					html+='<li><div class="input-group"><input type="text" class="form-control" id='+obj.id+' placeholder="Add Custom Tags" name="search" hidden><div class="input-group-btn"><button class="btn btn-default" id="tag-update" type="submit"><i class="glyphicon glyphicon-plus"></i></button></div></div></li>'
					for(var i = 0;i<tags.length;i++){
						html+='<li>'+tags[i]+'</li>';
					}
					html+='</ul>'; 
					var imageurl = 'http://54.186.153.173:9000/images/'+obj.name;
					var imagehtml='';
					imagehtml+= "<li class='imageList'><div class='img-title' style='width:420px;'><span>"+obj.name+"</span></div><div class='div-left floater'><img src="+imageurl+"></div>";
					imagehtml+= "<div class='div-right floater'>"+html+"</div></li>";
					$('.image-lister').append(imagehtml);
					//$('.icon-choose-image').show();    
					//setInterval(function() {$("#body-overlay").hide(); },500);
					return false;
				},
				error: function() 
				{
					alert("please update valid photo");
				} 	        
		   });
		}
	}));


   $(document).on('click', '.input-group-btn #tag-update', function(e){ 
		var d = new Object();
		var image_id = $(e.target).closest('ul').attr('data-id');
		d.id=image_id;
		d.tags = $('#'+image_id).val();
		console.log(d);
		$.ajax({
			url: "http://54.186.153.173:9000/n3n/cloud/tags/update",
			type: "POST",
			data:  JSON.stringify(d),
			contentType: false,
			processData:false,
			success: function(data)
			{
				var obj = JSON.parse(data); 
				console.log(obj);
				var html=''; 
				var tags = obj.tags;
				html+='<ul class="tags-list" id="tags-list'+obj.id+'" data-id='+obj.id+'>';
				html+='<li><div class="input-group"><input type="text" class="form-control" id='+obj.id+' placeholder="Add Custom Tags" name="search" hidden><div class="input-group-btn"><button class="btn btn-default" id="tag-update" type="submit"><i class="glyphicon glyphicon-plus"></i></button></div></div></li>'
				for(var i = 0;i<tags.length;i++){
					html+='<li>'+tags[i]+'</li>';
				}
				html+='</ul>';
				$(e.target).closest('ul').html(html);
				//$('.display-tags').empty();
				//$('.display-tags').append(html);
			}
		});
	});



	$('#modalInfo').on('click','.conc-img-list li .data-info #conc-selection',function(){
		var d = new Object();
		d.name = $(this).attr('data-name');
		d.url = $(this).attr('data-url');
		d.price = $(this).attr('data-url');
		var url = "http://54.186.153.173/unsafe/120x90/"+$(this).attr('data-url');
		console.log(url);
		//$('#image-wrapper').html('');
		$('.checkout-list').append("<li data-name='"+$(this).attr('data-name')+"' data-desc='"+$(this).attr('data-desc')+"' data-price='"+$(this).attr('data-price')+"' data-url='"+$(this).attr('data-url')+"' data-property='"+$(this).attr('data-property')+"'><img data-type='"+$(this).attr('data-type')+"' src="+url+"></li>");
		/*$.ajax({
			url: "http://54.186.153.173:9000/n3n/cloud/app/orders",
			type: "POST",
			data:  JSON.stringify(d),
			contentType: false,
			processData:false,
			success: function(data)
			{
				var obj = JSON.parse(data);
				console.log(obj);
			}
		});*/

	});


	$('.items-div span').click(function(){
		$('.modal').css('top','0 !important');
			console.log("this");
			$('.modal-title').text('ORDER DETAILS');
			$('#modalInfo').html('');
			$('.modal-dialog-centered').css('width','60%');
	});

	
	/*$('.categories').on('click','.category-list li',function(){
		//$('.canvas_wrapper').hide();
		$('.panel-wrap').css('transform','translateX(100%)');
		$('#sidebar').addClass('hidden');
		$('.image-header').css("left","0");
		

		var name = "pkarra-111";//"birthday-"+Math.floor(Math.random() * (9999 - 2323 + 1)) + 2323;
		var params = new Object();
		params.cType = "Birthday";
		params.calc_size = true;
		params.delay = 400;
		params.layers = "All";
		params.name = "pkarra-111";
		params.quality = 90;
		params.type = "JSON - Full layers data";
		params.wType = "TEMPLATE";
		params.widget_name="Pavan Karra";
		params.saveType = "next";
		save_file.save_action(params);
		//save_file.save();
		//POP.show();
		var d = new Object();
		console.log($(this));
		console.log(this.dataset.item);
		var itemname = this.dataset.item;
		d.zipcode="94010";
		$.ajax({
			url: "http://54.186.153.173:9000/n3n/cloud/images/services",
			type: "POST",
			data:  JSON.stringify(d),
			contentType: false,
			processData:false,
			success: function(data)
			{
				var obj = JSON.parse(data);
				console.log(obj);
				var html=''; 
				$('.conc-view').removeClass('hidden');
				html+='<ul class="conc-img-list">';
				$('.lister-title').text(itemname);
				for (var key in obj) {
					//console.log(obj[key],$(this).attr("data-item"));
					if(key == itemname.toLowerCase()){
						for(var i=0;i<obj[key].length;i++){
							console.log("555555",obj[key][i]);
							var price = obj[key][i].price.split('.');
							html+='<li><div class="image-info"><img style="height:210px;width:250px;" src='+obj[key][i].url+'></div>';
							html+='<div class="data-info" style=""><span class="item-title">'+obj[key][i].name+'</span><br/><span class="item-desc">'+obj[key][i].desc+'</span>';
							html+='<div class="price-tag"><span>'+price[0]+'</span><sup>'+price[1]+'</sup></div>';
							html+='<div id="conc-selection" data-name="'+obj[key][i].name+'" data-price="'+obj[key][i].price+'" data-desc="'+obj[key][i].desc+'" data-url="'+obj[key][i].url+'" data-property="'+obj[key][i].property+'"><span><i class="glyphicon glyphicon-plus" style="font-size:1.3em;color:#575757"></i></span></div></div></li>';
						}
					}
				}
				html+='</ul>'
				console.log(html);
				//<span>&#43;</span>
				//if()

				if($('.checkout-list').length < 1){
					$('#image-wrapper').empty();
					$('#image-wrapper').html('<ul class="checkout-list"></ul>');
					$('.conc-img-sticker').html('');
					console.log("dfssafsafsafdsfasfasfasf");
					//var url="http://54.186.153.173/unsafe/120x90/http://54.186.153.173:9000/images/"+name.trim()+".png";
					//console.log("**************6",url);
					//$('.checkout-list').append("<li data-name='"+name.trim()+"' data-price='$5.99' data-url='"+url+"' data-property='birthday'><img data-type='template' data-url='http://54.186.153.173:9000/images/"+name.trim()+".png src="+url+"></li>");
					//$('.checkout-list').append('<li><img data-type="template" data-url="http://54.186.153.173:9000/images/'+name.trim()+'.png" src=http://54.186.153.173/unsafe/120x90/http://54.186.153.173:9000/images/'+name.trim()+'.png></li>');
				}else{
					$('#exampleModalLongTitle').text("checkout");
				}

				$('.conc-img-sticker').html(html);
			}
		});

	}); */


	$('#image-wrapper').on('click','.checkout-list > li',function(){
		var type = $(this).find('img').attr('data-type');
		var d = new Object();
		d['url']=$(this).find('img').attr('data-url');
		console.log(type);
		if(type=='template'){
			$('.conc-view').addClass('hidden');
			$('.canvas_wrapper').removeClass('hidden');
			$('#sidebar').removeClass('hidden');
			$('.image-header').css("left","80px");
			console.log(d);
			$.post("http://54.186.153.173:9000/n3n/cloud/app/sample", JSON.stringify(d), function(result){
			console.log(result);
			var output = JSON.parse(result);
			var o_data = output.data;
			var img = '';
			/*for(var i=0; i<o_data.length;i++){
				var placeholder = "placeholder"+i+".png";
				if(img!=undefined || img[i]!=undefined){
					output.data[i].data = img[i];
				}else{
					output.data[i].data = "http://54.186.153.173:9000/images/"+placeholder+"";
				}
			}*/
			f_file.load_json(JSON.stringify(output));
			$('#layout').addClass('hidden');
			$('#layoutbody').html('');
			$('.head-right-span').show();
		});
		}
	});


	$('.submitter').click(function(){
		console.log('dfsfsfs');
		var obj = new Object();
		obj.name = $('#fname').val();
		obj.desc = $('#subject').val();
		obj.price = $('#price').val();
		obj.count = $('#count').val();
		var url="http://ec2-54-186-153-173.us-west-2.compute.amazonaws.com:9000/n3n/cloud/app/add/items";
			$.post(url, JSON.stringify(obj), function(status){
				console.log(status);
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


}, false);
