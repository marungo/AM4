/* Filename: am4.js
Author: Mary Ruth Ngo
Date: March 10, 2015

Goal: Javascript code for implementing a wep app that takes Wellesley's Course Info and makes
it searchable by distribution, subject and days in the week. The information of courses that
meet the given criteria will be displayed in a div, and ultimately be used to populate
a Google Calendar (that functionality is in the other js file).

Honor Code Statement:
On this task I collaborated with Lucy Cheng and Jessica Bu. Lucy focused on the CSS and HTML
while Jessica and I focused on back-end Javascript stuff. I worked with the course feed and Jessica
worked on exporting a class schedule onto the Google Calendar. We had a lot of fun!

*/

//global variables!
var url = "https://spreadsheets.google.com/feeds/list/1035SQBywbuvWHoVof3G-VI0rapYJslaeYN5tTpNZq2M/od6/public/values?";
var cleanedCourses = [];
var courseArray = [];
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

    var courses = findCoursesALLConstraints(courseArray, subject, distribution, days);
  });
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

//returns the courses of the given subject. The easiest search function! No cases!
function findCoursesSub(courses, subject) {
	var results = [];
	for (var i in courses) {
		if (courses[i][0] == subject) {
			results.push(courses[i]);
		}
	}
	return results;
}

//returns courses that fit the exact combination of days that user selects
function findCoursesDays(courses, daysArray) {
  var results = [];
  for (var i in courses) {
    
    //to nullify the partitioned days, join everything, take away the commas, and resplit
    var days = courses[i][5].join().replace(/,/g, "");
    days = days.split("");

    // console.log(JSON.stringify(days) + " : " + JSON.stringify(daysArray));
    
    //stringify the arrays so that they can be compared to. If you just compare
    //arrays, they are not pointing to the same object, so even if they look the same,
    //they will return as false.
    if (JSON.stringify(days) == JSON.stringify(daysArray)) {//if array of days is equal to the days selected
      results.push(courses[i]);
    }
  }
  return results;
}

//returns courses that fulfill the distribution that the user selects
function findCoursesDistrib(courses, distribution) {
  var results = [];
  for (var i in courses) {    if (courses[i][7].length > 1) {//if multiple distributions
      for (j = 0; j<courses[i][7].length;) {
        if (courses[i][7][j] == distribution) {        
          results.push(courses[i]);
        }
        j += 2;//increment by 2 because every odd number array
        //element is fluff, no content
      }
    } else if (courses[i][7].length == 1) {//if only one distribution, or distribution is separated by "or"
      var distribs = courses[i][7];
      distribs = distribs[0].split(" or ");
      for (var j in distribs) {//in case there are 2 distributions split by "or"
        if (distribs[j] == distribution) {
          results.push(courses[i]);
          break;//as long as one of the distributions matches the given, no need to go on
        }
      }
    }
  }
  return results;
}

function findCoursesALLConstraints(courses, subject, distribution, days) {

  //call all three subjects, filtering the same set of courses so that at the end,
  //the courses left fulfill all of the constraints.
  if (subject) {
    courses = findCoursesSub(courses, searchSubjectQuery(subject));
  }
  if (distribution != "na") {//placeholder for no distribution
    courses = findCoursesDistrib(courses, distribution);
  }
  if (days.length > 0) {
    courses = findCoursesDays(courses, days);
  }

  //empty any courses that filled the list div from past inquiries
  list.innerHTML = "";

  //fill (or refill) the list div of course divs showing name, title, 
  //instructor, days and times, and distributions.

  if (courses.length == 0) {
    var obj = document.createElement("div");
    obj.className = "listElements";

    var alert = document.createElement("h3");
    alert.innerHTML = "No courses meet this set of criteria";

    obj.appendChild(alert);
    list.appendChild(obj);
  } else {
    
    for (var i in courses) {
      var obj = document.createElement("div");
      obj.className = "listElements";

      var courseName = document.createElement("h4");
      courseName.innerHTML = courses[i][4];

      var title = document.createElement("h5");
      title.innerHTML = courses[i][0] + " " + courses[i][1] + " by " + courses[i][8];
      
      var distrib = document.createElement("h6");
      var distribString = toStringDistribs(courses[i]);
      console.log(distribString);
      distrib.innerHTML = distribString;
      
      var times = document.createElement("p");
      times.innerHTML = toStringDayAndTime(courses[i]);

      obj.appendChild(courseName)
      obj.appendChild(title);
      obj.appendChild(distrib);
      obj.appendChild(times);
      list.appendChild(obj);
    }
  }
}

//returns the abbreviation of the given course subjectt
function searchSubjectQuery(query) {
  var index;
  for (var i in subjects) {
    if (query == subjects[i]) {
      index = i;
    }
  }
  return abbr[index];
}

//stringifies the days and times of a course for the div
function toStringDayAndTime(course) {
  var string = "Meets on: ";
  for (var i in course[5]) {
    string += course[5][i] + " at " + course[6][i];
    if (i + 1 != course[7].length) {
      string += " and ";
    }
  }
  return string;
}  

function toStringDistribs(course) {
  var string = "Fulfills ";
  for (var i = 0; i < course[7].length; i++) {
    string += course[7][i];
    if (i + 1 != course[7].length) {
      string += " or ";
    }
    i += 1;
  }
  return string;
}
