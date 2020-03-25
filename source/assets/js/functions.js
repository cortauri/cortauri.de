import $ from "jquery"

$(function() {

  function setDate() {
    var retval = 1;
    $(".mod").change('input', function(){
    retval = this.value;
    console.log(retval);
  }); return retval; } //end MOD

  $.getJSON("https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json" , function(data){
    var poptotal =0;
    $.each( data, function( index, value ){
      var gtotal = Math.round(value.population/1);
      poptotal += gtotal;

    });

    console.log(poptotal);

  });



  $.getJSON( "https://pomber.github.io/covid19/timeseries.json", function(data) {
    var global_count_conf = 0;
    //var global_count_recov = 0;
    var global_count_death = 0;
    //var global_count_active = 0;
    var global_date;

    var modus = setDate();

    $.each( data, function( index, value ){
      var last_element = value[value.length - modus];
      global_count_conf += last_element.confirmed;
      //global_count_recov += last_element.recovered;
      global_count_death += last_element.deaths;
      //global_count_active = global_count_conf-global_count_recov-global_count_death;
      global_date = last_element.date;

      var indexclear = index.replace(/ /g, "-").replace("*","-").replace("(","-").replace(",","-").replace(")","-").replace("'","-");

      $( "<ul/>", {
        "class": ""+ indexclear +"-list",
        html: ("<li class='"+ indexclear +"-label')>"+ index +"</li>")
      }).appendTo( ".regionlists" );


      $("<option value='"+ indexclear +"'>").appendTo( "#regionaldata>select" );

      var conf = JSON.stringify(last_element.confirmed, null, 2);
      //var recov = JSON.stringify(last_element.recovered, null, 2);
      var death = JSON.stringify(last_element.deaths, null, 2);
      var iconf = parseInt(conf);
      //var irecov = parseInt(recov);
      var ideath = parseInt(death);
      var itotal = iconf;
      var ipr = ((ideath/itotal)*100).toFixed(2);
      var totalpro = ipr.toString();
      //var active = iconf-ideath-irecov;
      //var activepro = active.toString();

      $("<li class='mortality'>mortality rate<span>"+ totalpro +"%</span></li>").appendTo( "."+ indexclear +"-list" );
      //$("<li>active<span>"+ activepro +"</span></li>").appendTo( "."+ indexclear +"-list" );

      $.each( last_element, function (key, value){

        $( "<li class='"+ indexclear +"-"+ key +"'>"+ key +" <span>"+ value +"</span></li>" ).appendTo( "."+ indexclear +"-list" );

      });

    });




  $("<div class='date'><span>"+ global_date +"</span></div>").appendTo( ".headline" );
  $("<div class='confirmed'>Confirmed <span>"+ global_count_conf +"</span></div>").appendTo( ".global" );
  //$("<div class='recovered'>Recovered <span>"+ global_count_recov +"</span></div>").appendTo( ".global" );
  $("<div class='deaths'>Deaths <span>"+ global_count_death +"</span></div>").appendTo( ".global" );
  //$("<div class='active'>Active <span>"+ global_count_active +"</span></div>").appendTo( ".global" );

  var global_count_mort = ((global_count_death/global_count_conf)*100).toFixed(2);
  $("<div class='mort'>Mortality Rate <span>"+ global_count_mort+"%</span></div>").appendTo( ".global" );

  });

  $(".search,.compare,.comparesnd").on('input', function(){
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
    console.log(val);
  });

});
