/* Filename: am4.js
Author: Mary Ruth Ngo
Date: March 10, 2015

Goal: Javascript code for implementing a wep app that takes Wellesley's Course Info and makes
it searchable by distribution, subject and days in the week. The information of courses that
meet the given criteria will be displayed in a div, and ultimately be used to populate
a Google Calendar (that functionality is in the other js file).

Honor Code Statement:
On this task I collaborated with Lucy Cheng and Jessica Bu. Lucy focused on the CSS, HTML and jQuery
while Jessica and I focused on back-end Javascript stuff. I worked with the course feed and Jessica
worked on exporting a class schedule onto the Google Calendar. We had a lot of fun!

*/

//global variables!
var url = "https://spreadsheets.google.com/feeds/list/1035SQBywbuvWHoVof3G-VI0rapYJslaeYN5tTpNZq2M/od6/public/values?";
var cleanedCourses = [];
var courseArray = [];
var selectedCourses = [];
var subjects, abbr;

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
    subjects = [
      "Africana Studies", "American Studies","Anthropology","Arabic",
      "Art History","Art-Studio","Astronomy", "Babson", "Biochemistry","Biological Science",
      "Cinema and Media Studies","Chemistry","Chinese Language and Culture",
      "Classical Civilization","Cognitive and Linguistic Sci",
      "Comparative Literature","Computer Science","East Asian Languages and Cultures",
      "Economics","Education","English", "Engineering", "Environmental Studies",
      "Extradepartmental","French","Geosciences","German","Greek","Hebrew",
      "History","Hindi/Urdu","Italian Studies","Japanese Lang and Culture",
      "Korean Lang and Culture","Latin","Linguistics","Mathematics",
      "Medieval/Renaissance","Middle Eastern Studies", "Music",
      "Neuroscience", "Physical Education","Peace and Justice Studies","Philosophy","Physics",
      "Political Science (POL)","Political Science (POL1)","Political Science (POL2)",
      "Political Science (POL3)","Political Science (POL4)","Portuguese",
      "Psychology","Quantitative Reasoning","Russian Area Studies","Religion",
      "Russian","South Asia Studies","Sociology","Spanish","Sustainability",
      "Swahili","Theatre Studies","Women's & Gender Studies","Writing", ];
    abbr = [
      "AFR", "AMST", "ANTH","ARAB","ARTH","ARTS", "ASTR", "BABS", "BIOC", "BISC",
      "CAMS","CHEM","CHIN","CLCV","CLSC","CPLT","CS","EALC","ECON","EDUC","ENG", "ENGR",
      "ES","EXTD","FREN","GEOS","GER","GRK","HEBR","HIST","HNUR",
      "ITAS","JPN","KOR","LAT","LING","MATH","ME/R","MES","MUS","NEUR",
      "PE","PEAC","PHIL","PHYS","POL","POL1","POL2","POL3","POL4",
      "PORT","PSYC","QR","RAST","REL", "RUSS", "SAS","SOC","SPAN","SUST",
      "SWA","THST", "WGST","WRIT",];
    
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

    var courses = findCoursesALLConstraints(subject, distribution, days);
  });
});

$(document).on("click", 'button', function() {
  console.log(this);
  var index = selectedCourses.indexOf(findCoursesByCRN(this.id));
  if (index == -1) {
    selectedCourses.push(findCoursesByCRN(this.id));
    console.log(selectedCourses);
    var added = $(this).clone().appendTo('#calendar');
    $(added).css("width", "170px");
    $(added).css("border", "1px auto black");
  }
});

$(document).on("click", '#calendar button', function() {
  $(this).remove();
  var index = selectedCourses.indexOf(findCoursesByCRN(this.id));
  selectedCourses.splice(index, 1);
  console.log(selectedCourses + "after removal");
});

//important function that makes an .ajax request that pulls data from a Google Spreadsheet
//which was populated from the courses website for Wellesley College
$.getJSON(url+"alt=json-in-script&callback=?",
    function (response){
      items = response.feed.entry;
      if (response.feed) {
        processCourses(items);
        parseCoursesInfo(cleanedCourses);//This function just makes it easier to 
      } 
    });

function processCourses(allCourses){
  // 1. create an object that will store each course by its CRN
  for (var i in allCourses){
    var course = allCourses[i];
    var crsObj = {'CRN': course["gsx$crn"]["$t"],
                  'Name': course["gsx$course"]["$t"],
                  'Title': course["gsx$title"]["$t"],
                  'Days': course["gsx$days"]["$t"], // clean up days
                  'Times': course["gsx$meetingtimes"]["$t"].split("\n"),
                  'Distributions': course["gsx$distributions"]["$t"].split("\n"),
                  'Instructor': course["gsx$instructor"]["$t"]
                  };
    //2. Add it to the cleanedCourses object, using the CRN value as the property name.
    cleanedCourses[crsObj.CRN] = crsObj;
  }
  // other things
}

//go through the cleanedCourse array and make an array of courses that I could visualize
//a little better than the objects built in processCourses function.
function parseCoursesInfo(courses) {
  for (var key in courses) {
    courseArray.push(courses[key].Name.split(" "));//index 0 = subject, 1 = course level/num, 3 = section
    courseArray[courseArray.length-1][2] = (courses[key].CRN);//index 2
    courseArray[courseArray.length-1].push(courses[key].Title);//index 4
    courses[key].Days = courses[key].Days.replace(/\d/g, "").replace(/Th/g, "R").replace(/(.)(?=.*\1)/g, "");
    courses[key].Days = courses[key].Days.split("\n");
    courses[key].Days = courses[key].Days.slice(1, courses[key].Days.length);
    courseArray[courseArray.length-1].push(courses[key].Days);//index 5
    courseArray[courseArray.length-1].push(courses[key].Times);//index 6
    courseArray[courseArray.length-1].push(courses[key].Distributions);//index 7
    courseArray[courseArray.length-1].push(courses[key].Instructor);//index 8
  }
}

function checkSubject(course, subject) {
  console.log(course[0] + " : " + subject);
  if (course[0] == subject) {
    console.log("YAY! ^");
    return true;
  }
  return false;
}

function checkDays(course, daysArray) {    
  //to nullify the partitioned days, join everything, take away the commas, and resplit
  var days = course[5].join().replace(/,/g, "");
  days = days.split("");

  for (var i in daysArray) {
    for (var j in days) {
      if (daysArray[i] ==  days[j]) {//if 1 of the selected days is in the days of a course
        return true;
      }
    }
  }

  return false;
}

//returns courses that fulfill the distribution that the user selects
function checkDistribs(course, distribution) {
  if (course[7].length > 1) {//if multiple distributions
    for (j = 0; j<course[7].length;) {
      if (course[7][j] == distribution) {  
        return true;      
      }
      j += 2;//increment by 2 because every odd number array
      //element is fluff, no content
    }
  } else if (course[7].length == 1) {//if only one distribution, or distribution is separated by "or"
    var distribs = course[7];
    distribs = distribs[0].split(" or ");
    for (var j in distribs) {//in case there are 2 distributions split by "or"
      if (distribs[j] == distribution) {
        return true;
      }
    }
  }
  return false;
}

//this function iterates through the 774 courses exactly once and checks
//each course against the given criteria. Function works even if not all of
//the constraints are activated.
function checkAllConstraints(subject, distribution, days) {
  var results = [];
  for (var i in courseArray) {
    var courseFitsCriteria = true;
    if (subject) {//if subject is a constraint, check subject against all courses
      courseFitsCriteria = checkSubject(courseArray[i], searchSubjectQuery(subject));
    }
    if (courseFitsCriteria && distribution != "na") {//distributions is a constraint, check it against all courses
      courseFitsCriteria = checkDistribs(courseArray[i], distribution);
    }
    if (courseFitsCriteria && days.length > 0) {//if days is a constraint, check it against all courses
      courseFitsCriteria = checkDays(courseArray[i], days);
    }
    //at the very end, if courseFitsCriteria is still true, then the course has passed all
    //tests for constraints. It may be appended onto resulting course array
    if (courseFitsCriteria) {
      results.push(courseArray[i]);
    }
  }
  return results;
}

function findCoursesALLConstraints(subject, distribution, days) {
  //save all courses that fit the constraint into a variable
  var courses = checkAllConstraints(subject, distribution, days);

  //empty any courses that filled the list div from past inquiries
  list.innerHTML = "";

  //fill (or refill) the list div of course divs showing name, title, 
  //instructor, days and times, and distributions.
  if (courses.length == 0) {// if there are no courses, then 
    var obj = document.createElement("div");
    obj.className = "listElements";

    var alert = document.createElement("h3");
    alert.innerHTML = "No courses meet this set of criteria";

    obj.appendChild(alert);
    list.appendChild(obj);
  } else {
    for (var i in courses) {
      var obj = document.createElement("button");
      obj.className = "listElements";
      obj.id = courses[i][2]; // id name is the CRN

      var title = document.createElement("h1");
      title.innerHTML = courses[i][0] + " " + courses[i][1];
      var name = document.createElement("h2");
      name.innerHTML = courses[i][4] + " with " + courses[i][8]; 
      
      var distribution = document.createElement("p");
      distribution.innerHTML = toStringDistribs(courses[i]);
      
      var times = document.createElement("p");
      times.innerHTML = toStringDayAndTime(courses[i]);

      obj.appendChild(title);
      obj.appendChild(name);
      obj.appendChild(times);
      obj.appendChild(distribution);
      list.appendChild(obj);
    }
  }
}

function findCoursesByCRN(crn) {
  for (var i in courseArray) {
    if (courseArray[i][2] == crn) {
      return courseArray[i];
    }
  }
}

//returns the abbreviation of the given course subjectt
function searchSubjectQuery(sub) {
  var index;
  for (var i in subjects) {
    if (sub == subjects[i]) {
      index = i;
    }
  }
  return abbr[index];
}

//stringifies the days and times of a course for the div
function toStringDayAndTime(course) {
  var string = "Meets on: ";
  for (var i in course[5]) {
    string += course[5][i].replace(/R/g, "Th") + " at " + course[6][i];
  }
  return string;
}  

function toStringDistribs(course) {
  var string = "Fulfills: ";
  for (var i = 0; i < course[7].length; i++) {
    string += course[7][i];
    if (i + 1 != course[7].length) {
      string += " or ";
    }
    i += 1;
  }
  return string;
}
