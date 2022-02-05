$(document).ready(function() {
  // Pokémon stats for generation
  // Natures
  var base_natures = [
    {id: 1,name: 'Hardy',increase: 0,decrease: 0},
    {id: 2,name: 'Lonely',increase: 2,decrease: 3},
    {id: 3,name: 'Brave',increase: 2,decrease: 6},
    {id: 4,name: 'Adamant',increase: 2,decrease: 4},
    {id: 5,name: 'Naughty',increase: 2,decrease: 5},
    {id: 6,name: 'Bold',increase: 3,decrease: 2},
    {id: 7,name: 'Docile',increase: 0,decrease: 0},
    {id: 8,name: 'Relaxed',increase: 3,decrease: 6},
    {id: 9,name: 'Impish',increase: 3,decrease: 4},
    {id: 10,name: 'Lax',increase: 3,decrease: 5},
    {id: 11,name: 'Timid',increase: 6,decrease: 2},
    {id: 12,name: 'Hasty',increase: 6,decrease: 3},
    {id: 13,name: 'Serious',increase: 0,decrease: 0},
    {id: 14,name: 'Jolly',increase: 6,decrease: 4},
    {id: 15,name: 'Naive',increase: 6,decrease: 5},
    {id: 16,name: 'Modest',increase: 4,decrease: 2},
    {id: 17,name: 'Mild',increase: 4,decrease: 3},
    {id: 18,name: 'Quiet',increase: 4,decrease: 6},
    {id: 19,name: 'Bashful',increase: 0,decrease: 0},
    {id: 20,name: 'Rash',increase: 4,decrease: 5},
    {id: 21,name: 'Calm',increase: 5,decrease: 2},
    {id: 22,name: 'Gentle',increase: 5,decrease: 3},
    {id: 23,name: 'Sassy',increase: 5,decrease: 6},
    {id: 24,name: 'Careful',increase: 5,decrease: 4},
    {id: 25,name: 'Quirky',increase: 0,decrease: 0}
  ];

  // Base Stats
  var base_stats = [
    {id: 1,name: 'hp'},
    {id: 2,name: 'attack'},
    {id: 3,name: 'defense'},
    {id: 4,name: 'special-attack'},
    {id: 5,name: 'special-defense'},
    {id: 6,name: 'speed'}
  ];

  // Moves
  var moves = []

  // Growth Rate
  var growth_rate


  $.fn.iv_roll = function() {
    return Math.floor(Math.random() * 31);
  }

  $.fn.nature_roll = function() {
    return Math.floor(Math.random() * 25 + 1);
  }

  $.fn.add = function( x, y ) {
    return x + y;
  }

  $.fn.percent_calc = function( x ) {
    x = (x * 10) / 100
    return x
  }

  // This randomizes 4 numbers using amount of moves we have in the moves array
  $.fn.moves_roll = function( x ) {
    var numbers = []
    var count = 0

    while (count < 4) {
      var number = Math.floor(Math.random() * x);
      
      if( $.inArray(number, numbers) == -1 ) {
        numbers.push(number)
        count++;
      } 
    }

    return numbers
  }


  // PokéAPI ajax calls
  // Get the full list of Pokémon available for select
  $.ajax({
    type: "GET",
    url:"https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1118",
    dataType: "json",
    success: function ( data ) {
      $.each(base_stats, function( index, value ) {
        $("#calculated-" + value.name).empty();

      });

      $.each( data.results, function( index, value ) {
        var pokemon_list = "<option value=" + value.name + ">" + value.name + "</option>";
        $( pokemon_list ).appendTo('#pokemon-list');
      });
    }
  });

  // Get the Pokémon move details
  $.fn.get_move_details = function( move_url ) {
    $.ajax({
      type: "GET",
      url: "https://pokeapi.co/api/v2/move/"+move_url,
      dataType: "json",
      success: function ( move ) {
        $("#move-description").html(
          '<div class="cap"> Name: <span class="text-danger">'+move.name+'</span></div>'+
          '<div class="cap"> Type: <span class="text-danger">'+move.type.name+'</span></div>'+
          '<div class="cap"> Target: <span class="text-danger">'+move.target.name+'</span></div>'+
          '<div class="cap"> Accuracy: <span class="text-danger">'+move.accuracy+'</span></div>'+
          '<div class="cap"> Power: <span class="text-danger">'+move.power+'</span></div>'+
          '<div class="cap"> PP: <span class="text-danger">'+move.pp+'</span></div>'+
          '<div class="cap"> Priority: <span class="text-danger">'+move.priority+'</span></div>'+
          '<div class="cap"> Effect: <span class="text-danger">'+move.effect_entries[0].effect+'</span></div>'
        )
      }
    });
  }

  // Get the Pokémon evolution
  $.fn.get_evolution = function( evolution_url ) {
    $.ajax({
      type: "GET",
      url: evolution_url,
      dataType: "json",
      success: function ( data ) {
        console.log( data )
      }
    });
  }

  // Get the Pokémon growth rate
  $.fn.get_growth_rate = function( growth_rate_url ) {
    $.ajax({
      type: "GET",
      url: growth_rate_url,
      dataType: "json",
      success: function ( data ) {
        $('.growth-rate').html(
          data.growth_rate.name + '- <a target="_blank" class="link-success" href="' + data.growth_rate.url + '">reference</a>'
          )
        
        // $.fn.get_evolution(data.evolution_chain.url)
      }
    });
  }

  // Get the selected Pokémon
  $.fn.get_pokemon = function( name ) {
    $.ajax({
      type: "GET",
      url:"https://pokeapi.co/api/v2/pokemon/"+name,
      dataType: "json",
      success: function ( pokemon ) {
        // console.log(pokemon)
        moves = []

        $.each(pokemon.moves, function( index, value ) {
          move = { 
                   id: index,
                   name: value.move.name,
                   url: value.move.url
                 }
          moves.push( move )
        });

        $.fn.get_growth_rate("https://pokeapi.co/api/v2/pokemon-species/" + pokemon.name)

        $('.pokemon-image').attr( "src", pokemon.sprites.front_default );
        $('.base-exp').text( pokemon.base_experience );
        $(".invisible").removeClass();

        $.each( pokemon.stats, function( index, value ) {
          $('[data-' + value.stat.name + '-stat]').val(value.base_stat);
        });

        $('#available-moves-list').empty();
        
        $.each(moves, function( index, move ) {
          var move_name = move.name.replace(/-/g, " ");
          
          $('#available-moves-list').append(
            '<a class="cap  start-font  move-list-item  list-group-item"  data-move-url="' + move.name + '">' + move_name + '</a>'
          );
        });

        $.fn.move_click();
      }
    });
  }

  // Get move details
  $.fn.move_click = function( name ) {
    $(".move-list-item").on('click touchstart', function() {
      var test = $(this).data( "move-url" );
      $.fn.get_move_details(test);
    });

    $(".move-list-item").on('click touchstart', function() {
      $(".details-modal").removeClass("hide")
    });
  }

  // Iterate each base stat
  $.each(base_stats, function( index, value ) {
    var stat_name = value.name.replace(/-/g, " ");

    $('#base-stats').append(
      '<div class="cap  col  start-font"> ' + stat_name + ' <input class="form-control" name="' + value.name + '" data-' + value.name + '-stat type="number" value="1" /></div>'
    );

    $('#iv-stats').append(
      '<div class="cap  col  start-font"> ' + stat_name + ': <span id="calculated-' + value.name + '" class="text-secondary"></span> '+'<span id="iv-rolled-' + value.name + '" class="text-success"></span> '+' </div>'
    );
  });

  // Calculate IVs and nature with base stat
  $(".calculate").on('click touchstart', function() {
    $(this).html("Re-roll Stats")

    var nature_roll = $.fn.nature_roll()
    var nature   = base_natures.find(x => x.id === nature_roll);
    var increase = base_stats.find(x => x.id === nature.increase);
    var decrease = base_stats.find(x => x.id === nature.decrease);

    $('#nature-stat').html(
      '<div class="cap">' + nature.name + '</div>'
    );

    $.each(base_stats, function( index, value ) {
      var stat_value  = parseInt( $("[data-" + value.name + "-stat]").val() );
      var stat_change = $.fn.percent_calc(stat_value)

      if (nature.increase > 0) {
        if (increase.name == value.name) {
          var stat_value = $.fn.add(stat_value, stat_change)
        }
      }

      if (nature.decrease > 0) {
        if (decrease.name == value.name) {
          var stat_value = $.fn.add(stat_value, -stat_change)
        }
      }

      var iv_roll = $.fn.iv_roll();
      var total = Math.floor($.fn.add(iv_roll, stat_value));

      $("#calculated-" + value.name).html(stat_value + " + " + iv_roll + " = ");
      $("#iv-rolled-" + value.name).html(total);
    });
  });

  // Generate moves
  $(".generate_moves").on('click touchstart', function() {
    $(this).html("Re-generate Moves");
    $('#generated-moves').empty();
    
    var rolled = $.fn.moves_roll( moves.length )

    $.each(rolled, function( index, value ) {
      var move_name = moves[value].name.replace(/-/g, " ");
      
      $('#generated-moves').append(
        '<a class="cap  start-font  move-list-item  list-group-item"  data-move-url="' + moves[value].name + '">' + move_name + '</a>'
      );
    });

    $.fn.move_click();
  });

  // Add search to select input for Pokémon
  $(document).ready(function() {
    $('.js-example-basic-single').select2();
  });

  $(".clode-modal").on('click touchstart', function() {
    $(".details-modal").addClass("hide")
  });
});