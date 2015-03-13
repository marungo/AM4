/* Filename: ui.js
Author: Lucy Cheng
Date: March 10, 2015

Goal: jQuery code for the interface that allows for interaction and 
submission of user input 

Honor Code Statement:
On this task I collaborated with Mary Ruth Ngo and Jessica Bu. I talked
to Mary Ruth about synching up our functions so that the information
I gathered would serve as parameters. 
*/

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

$(document).on("click", '#list button', function() {
  console.log(this);
  var index = selectedCourses.indexOf(findCoursesByCRN(this.id));
  if (index == -1) {
    selectedCourses.push(findCoursesByCRN(this.id));
    console.log(selectedCourses);
    var added = $(this).clone().appendTo('#everything');
    $(added).css("width", "170px");
    $(added).css("border", "1px auto black");
  }
});

  $(document).on("click", '#everything button', function() {
    $(this).remove();
    var index = selectedCourses.indexOf(findCoursesByCRN(this.id));
    selectedCourses.splice(index, 1);
    console.log(selectedCourses + "after removal");
  });
