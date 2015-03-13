$(document).ready(function () {
  $('.about').click(function() {
    $('.info').css('visibility', 'visible');
    $('.about').css('visibility','hidden');
  });

  $('.info').click(function() {
    $('.info').css('visibility', 'hidden');
    $('.about').css('visibility','visible');
  });

  $(function() {
    $('#classes').autocomplete({
      source: subjects
    });
  });

  $('#check').buttonset();

  //this button takes all of the input from the 3 constraints and
  //searches from 774 courses to find all the courses that meet the specific constraints

  $("#submitInfo").click(function() {
    //making sure subjects align with their abbreviation
    // for (var i in subjects) {
    //   console.log(subjects[i] + " : " + abbr[i]);
    // }
    var subject = $("#classes").val();
    var distribution = $('#menu').val();
    var days = [];

    console.log(subject, distribution, days);

    $('#check input:checked').each(function() {
      days.push($(this).attr('id'));
    });

    var courses = divifyCourses(subject, distribution, days);
  });

  $('#clear').click(function() {
    $('#everything').empty();
    selectedCourses = [];
  });
});