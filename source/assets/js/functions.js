import $ from "jquery"

window.constrain = function(n, low, high) {
    return Math.max(Math.min(n, high), low);
};

window.mapRange = function(n, start1,stop1,start2,stop2) {

  var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;

  if (start2 < stop2) {
    return this.constrain(newval, start2, stop2);
  } else {
    return this.constrain(newval, stop2, start2);
  }

};

$(function() {

  $(window).scroll(function() {
      var wScroll = $(this).scrollTop();
      console.log(wScroll);
  });

  function eUS(x){
  return x.toLocaleString('en-US');
  }

  function setDate() {
    var retval = 1;
    $(".mod").change('input', function(){
    retval = this.value;
    console.log(retval);
  }); return retval; } //Time Offset

  $.getJSON("https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json" , function(data){
    var poptotal =0;
    $.each( data, function( index, value ){
      var gtotal = Math.round(value.population);
      poptotal += gtotal;

    });

    $("<div class='pop'>Population Total <span>"+ eUS(poptotal) +"</span></div>").appendTo( ".global" );
    return poptotal;
  });

  $.getJSON( "https://pomber.github.io/covid19/timeseries.json", function(data) {
    var global_count_conf = 0;
    var global_count_conf_yes = 0;
    var global_count_recov = 0;
    var global_count_recov_yes = 0;
    var global_count_death = 0;
    var global_count_death_yes = 0;
    var global_count_active = 0;
    var global_count_active_yes = 0;
    var global_date;

    var modus = setDate();

    $.each( data, function( index, value ){
      var last_element = value[value.length - modus];
      global_count_conf += last_element.confirmed;
      global_count_recov += last_element.recovered;
      global_count_death += last_element.deaths;
      global_count_active = global_count_conf-global_count_recov-global_count_death;
      global_date = last_element.date;

      var last_element_yes = value[value.length - modus-1];
      global_count_conf_yes += last_element_yes.confirmed;
      global_count_recov_yes += last_element_yes.recovered;
      global_count_death_yes += last_element_yes.deaths;
      global_count_active_yes = global_count_conf_yes-global_count_recov_yes-global_count_death_yes;
      //global_date_yes = last_element_yes.date;

      var indexclear = index.replace(/ /g, "-").replace("*","").replace("(","-").replace(",","-").replace(")","-").replace("'","-");

      $( "<ul/>", {
        "class": ""+ indexclear +"-list",
        html: ("<li class='"+ indexclear +"-label'>"+ index +"</li>")
      }).appendTo( ".regionlists" );

      $("<option value='"+ indexclear +"'>").appendTo( "#regionaldata>select" );

      var conf = JSON.stringify(last_element.confirmed, null, 2);
      var recov = JSON.stringify(last_element.recovered, null, 2);
      var death = JSON.stringify(last_element.deaths, null, 2);
      var iconf = parseInt(conf);
      var irecov = parseInt(recov);
      var ideath = parseInt(death);
      var itotal = iconf;
      var ipr = ((ideath/itotal)*100).toFixed(2);
      var totalpro = ipr.toString();
      var active = iconf-ideath-irecov;
      var activepro = eUS(active);

      $("<li class='mortality'>mortality<br><span>"+ totalpro +"%</span></li>").appendTo( "."+ indexclear +"-list" );
      $("<li class='active'>active<br><span>"+ activepro +"</span></li>").appendTo( "."+ indexclear +"-list" );

      $.each( last_element, function (key, value){
          //console.log(value);
        $( "<li class='"+ indexclear +"-"+ key +"'>"+ key +"<br><span>"+ eUS(value) +"</span></li>" ).appendTo( "."+ indexclear +"-list" );

      });

      /*$.each( last_element_yes, function (key, value){

        $( "<li class='"+ indexclear +"-"+ key +"'>"+ key +" <span>"+ value +"</span></li>" ).appendTo( "."+ indexclear +"-list" );

      });*/

    });


  var poptotalsum = $(".pop>span").html().replace(/,/g,"");
  //console.log(poptotalsum);
  var global_pop_mort = ((global_count_death/poptotalsum)*100).toFixed(5);

  var diff_conf = global_count_conf-global_count_conf_yes;
  var diff_death = global_count_death-global_count_death_yes;
  var diff_recov = global_count_recov-global_count_recov_yes;
  var diff_activ = global_count_active-global_count_active_yes;

  var gcc_match = window.mapRange(global_count_conf, 0, global_count_conf, 0, 100);
  var gca_match = Math.round(window.mapRange(global_count_active, 0, global_count_conf, 0, 100));
  var gcr_match = Math.round(window.mapRange(global_count_recov, 0, global_count_conf, 0, 100));
  var gcd_match = Math.round(window.mapRange(global_count_death, 0, global_count_conf, 0, 100));

  console.log(gcc_match +"-"+ gca_match +"-"+ gcr_match +"-"+ gcd_match);

  $(".graph>.plot-active").css("width",""+ gca_match +"%");
  $(".graph>.plot-recovered").css("width",""+ gcr_match  +"%");
  $(".graph>.plot-death").css("width",""+ gcd_match +"%");


  $("<div class='date'>latest request confirmed <span>"+ global_date +"</span></div>").appendTo( ".headline" );
  $("<div class='poppro'>Population Affected<span>"+ global_pop_mort +"%</span></div>").appendTo( ".global" );
  $("<div class='confirmed'>Confirmed | -1d | &delta; <span>"+ eUS(global_count_conf) +" | "+ eUS(global_count_conf_yes) +" | +"+ eUS(diff_conf) +"</span></div>").appendTo( ".global" );
  $("<div class='active'>Active | -1d | &delta; <span>"+ eUS(global_count_active) +" | "+ eUS(global_count_active_yes) + " | +"+ eUS(diff_activ) +"</span></div>").appendTo( ".global" );
  $("<div class='recovered'>Recovered | -1d | &delta; <span>"+ eUS(global_count_recov) +" | "+ eUS(global_count_recov_yes) +" | +"+ eUS(diff_recov) +"</span></div>").appendTo( ".global" );
  $("<div class='deaths'>Deaths | -1d | &delta; <span>"+ eUS(global_count_death) +" | "+ eUS(global_count_death_yes) +" | +"+ eUS(diff_death) +"</span></div>").appendTo( ".global" );

  var global_count_mort = ((global_count_death/global_count_conf)*100).toFixed(2);
  var global_count_mort_yes = ((global_count_death_yes/global_count_conf_yes)*100).toFixed(2);
  var diff_mort = (global_count_mort-global_count_mort_yes).toFixed(2);
  var pointer = "-";

  if (global_count_mort >= global_count_mort_yes) { pointer = "+"; }

  $("<div class='mort'>Mortality Rate | -1d | &delta;<span>"+ global_count_mort+"% | "+ global_count_mort_yes +"% | "+ pointer+""+ diff_mort +"%</span></div>").appendTo( ".global" );

  });

  $(".search").on('input', function(){
    var val = this.value;
    $('.order-options>div').removeClass("select");
    $(".regionlists>ul").removeClass("save_one");
    $(".regionlists>ul").hide();
    $(".regionlists>ul[class*='save_two']").show();
    $(".regionlists>ul[class|='"+ val +"']").show().addClass("save_one").css("order","0");
    if (val == '') {
      $(".regionlists>ul").show().removeClass("save_one");
    }
    //console.log(val);
  });
  $(".compare").on('input', function(){
    var val = this.value;
    $('.order-options>div').removeClass("select");
    $(".regionlists>ul").removeClass("save_two");
    $(".regionlists>ul").hide();
    $(".regionlists>ul[class*='save_one']").show();
    $(".regionlists>ul[class|='"+ val +"']").show().addClass("save_two").css("order","2");
    if (val == '') {
      $(".regionlists>ul").show().removeClass("save_two").css("order","0");
    }

    //console.log(val);
  });

  $(".by-confirmed").click( function(){

    if ($(this).hasClass("select")) {
      $(this).removeClass("select");

    $('.regionlists>ul').each(function() {
      $(this).css("order","0");
    });

    } else {

    $('.order-options>div').removeClass("select");
    $(this).addClass("select");
    $('.regionlists>ul').each(function() {

    var sortval = $(this).children('li[class*=-confirmed]').children('span').html().replace(/,/g, "");
    $(this).css("order","0");
    $(this).css("order","-"+ sortval +"");

    });

    }
  });
  $(".by-recovered").click( function(){

    if ($(this).hasClass("select")) {
      $(this).removeClass("select");

    $('.regionlists>ul').each(function() {
      $(this).css("order","0");
    });

    } else {

    $('.order-options>div').removeClass("select");
    $(this).addClass("select");
    $('.regionlists>ul').each(function() {

    var sortval = $(this).children('li[class*=-recovered]').children('span').html().replace(/,/g, "");
    $(this).css("order","0");
    $(this).css("order","-"+ sortval +"");

    });

    }

  });
  $(".by-active").click( function(){

    if ($(this).hasClass("select")) {
      $(this).removeClass("select");

    $('.regionlists>ul').each(function() {
      $(this).css("order","0");
    });

    } else {

    $('.order-options>div').removeClass("select");
    $(this).addClass("select");
    $('.regionlists>ul').each(function() {

    var sortval = $(this).children('li[class*=active]').children('span').html().replace(/,/g, "");
    $(this).css("order","0");
    $(this).css("order","-"+ sortval +"");

    });

    }

  });
  $(".by-deaths").click( function(){

    if ($(this).hasClass("select")) {
      $(this).removeClass("select");

    $('.regionlists>ul').each(function() {
      $(this).css("order","0");
    });

    } else {

    $('.order-options>div').removeClass("select");
    $(this).addClass("select");
    $('.regionlists>ul').each(function() {

    var sortval = $(this).children('li[class*=-deaths]').children('span').html().replace(/,/g, "");
    $(this).css("order","0");
    $(this).css("order","-"+ sortval +"");

    });

    }

  });
  $(".by-mortality").click( function(){

    if ($(this).hasClass("select")) {
      $(this).removeClass("select");

    $('.regionlists>ul').each(function() {
      $(this).css("order","0");
    });

    } else {

    $('.order-options>div').removeClass("select");
    $(this).addClass("select");
    $('.regionlists>ul').each(function() {

    var sortval = $(this).children('li[class*=mortality]').children('span').html().replace("%","").replace(".","");
    $(this).css("order","0");
    $(this).css("order","-"+ sortval +"");

    });

    }

  });

});
