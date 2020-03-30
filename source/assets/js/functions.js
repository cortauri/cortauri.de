import $ from "jquery"

function eUS(x){
return x.toLocaleString('en-US');
}

$(function() {

  $.getJSON("https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json" , function(data){
    var poptotal =0;
    $.each( data, function( index, value ){
      var gtotal = Math.round(value.population/1);
      poptotal += gtotal;

    });

    $("<div class='pop'>Population Total <span>"+ eUS(poptotal) +"</span></div>").appendTo( ".global" );

  });

  function setDate() {
    var retval = 1;
    $(".mod").change('input', function(){
    retval = this.value;
    console.log(retval);
  }); return retval; } //end MOD

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

      var indexclear = index.replace(/ /g, "-").replace("*","-").replace("(","-").replace(",","-").replace(")","-").replace("'","-");

      $( "<ul/>", {
        "class": ""+ indexclear +"-list",
        html: ("<li class='"+ indexclear +"-label')>"+ index +"</li>")
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

      $("<li class='mortality'>mortality rate<span>"+ totalpro +"%</span></li>").appendTo( "."+ indexclear +"-list" );
      $("<li class='active'>active<span>"+ activepro +"</span></li>").appendTo( "."+ indexclear +"-list" );

      $.each( last_element, function (key, value){

        $( "<li class='"+ indexclear +"-"+ key +"'>"+ key +" <span>"+ eUS(value) +"</span></li>" ).appendTo( "."+ indexclear +"-list" );

      });

      /*$.each( last_element_yes, function (key, value){

        $( "<li class='"+ indexclear +"-"+ key +"'>"+ key +" <span>"+ value +"</span></li>" ).appendTo( "."+ indexclear +"-list" );

      });*/

    });


  var poptotalsum = $(".pop>span").html().replace(/,/g,"");
  console.log(poptotalsum);
  var global_pop_mort = ((global_count_death/poptotalsum)*100).toFixed(5);

  var diff_conf = global_count_conf-global_count_conf_yes;
  var diff_death = global_count_death-global_count_death_yes;
  var diff_recov = global_count_recov-global_count_recov_yes;
  var diff_activ = global_count_active-global_count_active_yes;


  $("<div class='date'>Global Stats | <span>"+ global_date +"</span></div>").appendTo( ".headline" );
  $("<div class='poppro'>Population Affected<span>"+ global_pop_mort +"%</span></div>").appendTo( ".global" );
  $("<div class='confirmed'>Confirmed | -1Day  | &delta; <span>"+ eUS(global_count_conf) +" | "+ eUS(global_count_conf_yes) +" | +"+ eUS(diff_conf) +"</span></div>").appendTo( ".global" );
  $("<div class='active'>Active | -1Day | &delta; <span>"+ eUS(global_count_active) +" | "+ eUS(global_count_active_yes) + " | +"+ eUS(diff_activ) +"</span></div>").appendTo( ".global" );
  $("<div class='recovered'>Recovered | -1Day | &delta; <span>"+ eUS(global_count_recov) +" | "+ eUS(global_count_recov_yes) +" | +"+ eUS(diff_recov) +"</span></div>").appendTo( ".global" );
  $("<div class='deaths'>Deaths | -1Day | &delta; <span>"+ eUS(global_count_death) +" | "+ eUS(global_count_death_yes) +" | +"+ eUS(diff_death) +"</span></div>").appendTo( ".global" );

  var global_count_mort = ((global_count_death/global_count_conf)*100).toFixed(2);
  var global_count_mort_yes = ((global_count_death_yes/global_count_conf_yes)*100).toFixed(2);
  var diff_mort = (global_count_mort-global_count_mort_yes).toFixed(2);
  var pointer = "-";

  if (global_count_mort >= global_count_mort_yes) { pointer = "+"; }

  $("<div class='mort'>Mortality Rate | -1Day | &delta;<span>"+ global_count_mort+"% | "+ global_count_mort_yes +"% | "+ pointer+""+ diff_mort +"%</span></div>").appendTo( ".global" );

  });

  $(".search,.compare,.comparesnd,.comparetrd").on('input', function(){
    var val = this.value;
    $(".regionlists>ul").show();
    $(".regionlists>ul[class!='"+ val +"']").hide();
    $(".regionlists>ul[class!='save']").removeClass("save");
    $(".regionlists>ul[class!='save']").hide();
    $(".regionlists>ul[class*='save']").show();
    $(".regionlists>ul[class*='"+ val +"']").show().addClass("save");


    if (val == '') {
      $(".regionlists>ul[class!='save']").hide();
      $(".regionlists>ul[class*='save']").show();
      $(".regionlists>ul[class*='save']").removeClass("save");
      $(".regionlists>ul").show();


    }
    //console.log(val);
  });

});
