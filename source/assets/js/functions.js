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

//matomo analytics
    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
      var u="//analytics.cortauri.de/";
      _paq.push(['setTrackerUrl', u+'matomo.php']);
      _paq.push(['setSiteId', '1']);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
    })();

  $(window).scroll(function() {
      var wScroll = $(this).scrollTop();
      return wScroll;
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

  /*$.getJSON("https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json" , function(data){
    var poptotal = 0;
    $.each( data, function( index, value ){
        var gtotal = Math.round(value.population);
        poptotal += gtotal;
    });

    $("<div class='pop'>Population Total <span>"+ eUS(7444509223) +"</span></div>").appendTo( ".global" );
  });*/

  $("<div class='pop'>Population Total <span>"+ eUS(7444509223) +"</span></div>").appendTo( ".global" );

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
    var i = 0;

    var poptotalsum = 7444509223;
    //console.log(poptotalsum);

      $.each( data, function( index, value ){
      var last_element = value[value.length - modus];
      //var first_element = value[value.length - value.length]
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
        html: ("<li class='"+ indexclear +"-label'><span>"+ index +"</span></li>")
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

      //yesterday starts /*
      var conf_yes = JSON.stringify(last_element_yes.confirmed, null, 2);
      var recov_yes = JSON.stringify(last_element_yes.recovered, null, 2);
      var death_yes = JSON.stringify(last_element_yes.deaths, null, 2);

      var iconf_yes = parseInt(conf_yes);
      var irecov_yes = parseInt(recov_yes);
      var ideath_yes = parseInt(death_yes);
      var itotal_yes = iconf_yes;

      var ipr_yes = ((ideath_yes/itotal_yes)*100).toFixed(2);
      var totalpro_yes = ipr_yes.toString();
      var active_yes = iconf_yes-ideath_yes-irecov_yes;
      var activepro_yes = eUS(active_yes);

      var iconf_diff = conf-conf_yes;
      var irecov_diff = recov-recov_yes;
      var ideath_diff = death-death_yes;
      var iactive_diff = active-active_yes;
      var itotal_diff = (totalpro-totalpro_yes).toFixed(2); //diff

      console.log(iconf_diff+" - "+ irecov_diff +" - "+ ideath_diff +" - Active: "+ iactive_diff +" - Mortality: "+ itotal_diff);

      $("<li class='mortality'>mortality<br><span class='today'><span>"+ totalpro +"%</span></span><span class='yesterday'>"+ totalpro_yes +"%</span><span class='diff-total'>"+ itotal_diff +"%</span></li>").appendTo( "."+ indexclear +"-list" );
      $("<li class='active'>active<br><span class='today'><span>"+ activepro +"</span></span><span class='yesterday'>"+ activepro_yes +"</span><span class='diff-active'>"+ eUS(iactive_diff) +"</span></li>").appendTo( "."+ indexclear +"-list" );

      $.each( last_element, function (key, value){
          console.log(value);
        $( "<li class='"+ indexclear +"-"+ key +"'>"+ key +"<br><span class='today'><span>"+ eUS(value) +"</span></span></li>" ).appendTo( "."+ indexclear +"-list" );

      });

      $.each( last_element_yes, function (key, value){
        $("ul[class='"+ indexclear +"-list']>li[class='"+ indexclear +"-"+ key +"']").append("<span class='yesterday'>"+ eUS(value) +"</span>");
      });

      $("ul[class='"+ indexclear +"-list']>li[class='"+ indexclear +"-confirmed']").append("<span class='diff-conf'>"+ eUS(iconf_diff) +"</span>");
      $("ul[class='"+ indexclear +"-list']>li[class='"+ indexclear +"-recovered']").append("<span class='diff-recov'>"+ eUS(irecov_diff) +"</span>");
      $("ul[class='"+ indexclear +"-list']>li[class='"+ indexclear +"-deaths']").append("<span class='diff-death'>"+ eUS(ideath_diff) +"</span>");

    });

      for (i = 0; i < data.Germany.length; i++){
        var xd_gcd = 0;
        var xd_gcr = 0;
        var xd_gcc = 0;
        var xd_date = 0;

        $.each (data, function(index, value){
          //console.log(index +" has "+value[i].confirmed);
          xd_gcd += value[i].deaths
          xd_gcr += value[i].recovered
          xd_gcc += value[i].confirmed
          xd_date = value[i].date
        });

        console.log(xd_gcc +"-"+ xd_gcd +"-"+ xd_gcr);
        xd_gcc = window.mapRange(xd_gcc, 0, global_count_conf, 1, 100);
        xd_gcd = window.mapRange(xd_gcd, 0, global_count_conf, 1, 100);
        xd_gcr = window.mapRange(xd_gcr, 0, global_count_conf, 1, 100);
        console.log(xd_gcc +" cases globaly at "+ xd_date);
        $("<div><div class='xd_gcc inner'></div><div class='xd_gcr inner'></div><div class='xd_gcd inner'></div></div>").appendTo(".graph-timeseries>.plot-confirmed").children(".xd_gcc").css("height",""+xd_gcc*2+"px").parent().children(".xd_gcr").css("height",""+xd_gcr*2+"px").parent().children(".xd_gcd").css("height",""+xd_gcd*2+"px");

      }

    $("<div class='daycount'>Day "+ i +"</div>").appendTo(".graph-timeseries>.plot-confirmed");
    //$("<div class='daycount-min'><</div>").appendTo(".graph-timeseries>.plot-confirmed");
    //$("<div class='daycount-pls'>></div>").appendTo(".graph-timeseries>.plot-confirmed");

    var diff_conf = global_count_conf-global_count_conf_yes;
    var diff_death = global_count_death-global_count_death_yes;
    var diff_recov = global_count_recov-global_count_recov_yes;
    var diff_activ = global_count_active-global_count_active_yes;

    var gcc_match = window.mapRange(global_count_conf, 0, global_count_conf, 0, 100);
    var gca_match = window.mapRange(global_count_active, 0, global_count_conf, 0, 100);
    var gcr_match = window.mapRange(global_count_recov, 0, global_count_conf, 0, 100);
    var gcd_match = window.mapRange(global_count_death, 0, global_count_conf, 0, 100);

    console.log(gcc_match +"-"+ gca_match +"-"+ gcr_match +"-"+ gcd_match);

    $(".graph>.plot-active").css("width",""+ gca_match +"%").append("a");
    $(".graph>.plot-recovered").css("width",""+ gcr_match  +"%").append("r");
    $(".graph>.plot-death").css("width",""+ gcd_match +"%").append("d");

    var global_pop_mort = ((global_count_conf/poptotalsum)*100).toFixed(2);
    var pointer_a = "";
    var co2 = global_count_death*4.8.toFixed(0);
    var co2_diff = diff_death*4.8.toFixed(0);
    var trees = co2*80.0.toFixed(0);
    var trees_diff = co2_diff*80.0.toFixed(0);
    if (global_count_active >= global_count_active_yes) { pointer_a = "+"; }

    $("<div class='date'>latest request - <span>"+ global_date +"</span></div>").appendTo(".headline");
    $("<div class='poppro'>Population Affected<span>"+ global_pop_mort +"%</span></div>").appendTo( ".global" );
    $("<div class='confirmed'>Confirmed | &delta; -1d <span>"+ eUS(global_count_conf) +" | +"+ eUS(diff_conf) +"</span></div>").appendTo( ".global" );
    $("<div class='active'>Active | &delta; -1d <span>"+ eUS(global_count_active) +" | "+ pointer_a+""+ eUS(diff_activ) +"</span></div>").appendTo( ".global" );
    $("<div class='recovered'>Recovered | &delta; -1d <span>"+ eUS(global_count_recov) +" | +"+ eUS(diff_recov) +"</span></div>").appendTo( ".global" );
    $("<div class='deaths'>Deaths | &delta; -1d <span>"+ eUS(global_count_death) +" | +"+ eUS(diff_death) +"</span></div>").appendTo( ".global" );
    $("<div class='co'>CO2 / p.a.<span>"+ eUS(co2) +" t | +"+ eUS(co2_diff) +" t</span></div>").appendTo( ".global" );
    $("<div class='cot'>Trees / p.a.<span>"+ eUS(trees) +" | +"+ eUS(trees_diff) +"</span></div>").appendTo( ".global" );


    var global_count_mort = ((global_count_death/global_count_conf)*100).toFixed(2);
    var global_count_mort_yes = ((global_count_death_yes/global_count_conf_yes)*100).toFixed(2);
    var diff_mort = (global_count_mort-global_count_mort_yes).toFixed(2);
    var pointer = "";


    if (global_count_mort >= global_count_mort_yes) { pointer = "+"; }


    $("<div class='mort'>Mortality Rate |  &delta; -1d <span>"+ global_count_mort+"% | "+ pointer+""+ diff_mort +"%</span></div>").appendTo( ".global" );

    $("span[class*=diff]").prepend(function(){
      var fv = $(this).html().replace("%","").replace(/,/g, "");
      if (fv > 0){
        this.prepend("+");
      }

    });

    $("span[class*=today]").append("<span>Act</span>");
    $("span[class*=diff]").append("<span>&delta;</span>");
    $("span[class*=yesterday]").append("<span>-1Day</span>");


    $.getJSON("https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population-density.json", function(data){
      $.each(data, function( index, value ){
        console.log(index +"-"+ value.country +"-"+ value.density);
        if (value.density != null) {
        $("li[class*='"+ value.country +"-label']").append("<span class='density'>Population density "+value.density.toFixed(2)+ " people per square kilometer</span>"); //append
        }
      });
    });

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

    var sortval = $(this).children('li[class*=-confirmed]').children('span').children('span').html().replace(/,/g, "");
    $(this).css("order","0");
    $(this).css("order","-"+ sortval +"");

    });

    }
  }).append("c");
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

    var sortval = $(this).children('li[class*=-recovered]').children('span').children('span').html().replace(/,/g, "");
    $(this).css("order","0");
    $(this).css("order","-"+ sortval +"");

    });

    }

  }).append("r");
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

    var sortval = $(this).children('li[class*=active]').children('span').children('span').html().replace(/,/g, "");
    $(this).css("order","0");
    $(this).css("order","-"+ sortval +"");

    });

    }

  }).append("a");
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

    var sortval = $(this).children('li[class*=-deaths]').children('span').children('span').html().replace(/,/g, "");
    $(this).css("order","0");
    $(this).css("order","-"+ sortval +"");

    });

    }

  }).append("d");
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

    var sortval = $(this).children('li[class*=mortality]').children('span').children('span').html().replace("%","").replace(".","");
    $(this).css("order","0");
    $(this).css("order","-"+ sortval +"");

    });

    }

  }).append("m");


});
