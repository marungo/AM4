//global variables!
var url = "https://spreadsheets.google.com/feeds/list/1035SQBywbuvWHoVof3G-VI0rapYJslaeYN5tTpNZq2M/od6/public/values?";
var cleanedCourses = {};
var courseArray = [];

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
    var subjects = [
      "Africana Studies", "American Studies","Anthropology","Arabic",
      "Art History","Art-Studio","Astronomy","Biochemistry","Biological Science",
      "Cinema and Media Studies","Chemistry","Chinese Language and Culture",
      "Classical Civilization","Cognitive and Linguistic Sci",
      "Comparative Literature","Computer Science","East Asian Languages and Cultures",
      "Economics","Education","English","Engineering","Environmental Studies",
      "Extradepartmental","French","Geosciences","German","Greek","Hebrew",
      "History","Hindi/Urdu","Italian Studies","Japanese Lang and Culture",
      "Korean Lang and Culture","Latin","Linguistics","Mathematics",
      "Medieval/Renaissance","Middle Eastern Studies","Music","Neuroscience",
      "Physical Education","Peace and Justice Studies","Philosophy","Physics",
      "Political Science (POL)","Political Science (POL1)","Political Science (POL2)",
      "Political Science (POL3)","Political Science (POL4)","Portuguese",
      "Psychology","Quantitative Reasoning","Russian Area Studies","Religion",
      "Russian","South Asia Studies","Sociology","Spanish","Sustainability",
      "Swahili","Theatre Studies","Women's & Gender Studies","Writing", ];
    var abbr = [
      "AFR", "AMST", "ANTH","ARAB","ARTH","ARTS", "ASTR", "BABS", "BIOC", "BISC",
      "CAMS","CHEM","CHIN","CLCV","CLSC","CPLT","CS","EALC","ECON","EDUC","ENG",
      "ENGR","ES","EXTD","FREN","GEOS","GER","GRK","HEBR","HIST","HNUR",
      "ITAS","JPN","KOR","LAT","LING","MATH","ME/R","MES","MUS","NEUR",
      "PE","PEAC","PHIL","PHYS","POL","POL1","POL2","POL3","POL4",
      "PORT","PSYC","QR","RAST","REL","RUSS","SAS","SOC","SPAN","SUST",
      "SWA","THST", "WGST","WRIT",];
    
    $('#classes').autocomplete({
      source: subjects
    });
  });

  $('#check').buttonset();

  $("#submitInfo").click(function() {
        var subject = $("#classes").val();
        var distribution = $('#menu').val();
        var days = [];
        $('#check input:checked').each(function() {
          days.push($(this).attr('id'));
        });   
        console.log(subject);
        console.log(distribution);
        console.log(days);
  });
});


$.getJSON(url+"alt=json-in-script&callback=?", callbackFunction(response)});

function callbackFunction(response) {
  items = response.feed.entry;
  if (response.feed) {
    processCourses(items);
    parseCoursesInfo(cleanedCourses);

    for (var i in cleanedCourses) {

    }

    console.log(courseArray);
    console.log(findCoursesBOConstraint("AFR", 0));
  }
}

function processCourses(allCourses){   
  // 1. create an object that will store each course by its CRN
  for (var i in allCourses){
    var course = allCourses[i];
    var crsObj = {'CRN': course["gsx$crn"]["$t"],
                  'Name': course["gsx$course"]["$t"],
                  'Title': course["gsx$title"]["$t"],
                  'Days': course["gsx$days"]["$t"].split("\n")[1], // clean up days
                  'Times': course["gsx$meetingtimes"]["$t"],
                  'Distributions': course["gsx$distributions"]["$t"],
                  'Instructor': course["gsx$instructor"]["$t"]
                  };
    //2. Add it to the cleanedCourses object, using the CRN value as the property name.
    cleanedCourses[crsObj.CRN] = crsObj;
  }
  // other things
}

function parseCoursesInfo(courses) {
	for (var key in courses) {
		courseArray.push(courses[key].Name.split(" "));//index 0 = subject, 1 = course level/num, 3 = section
		courseArray[courseArray.length-1][2] = (courses[key].CRN);//index 2
		courseArray[courseArray.length-1].push(courses[key].Title);//index 4
		courseArray[courseArray.length-1].push(courses[key].Days);//index 5
		courseArray[courseArray.length-1].push(courses[key].Times);//index 6
		courseArray[courseArray.length-1].push(courses[key].Distributions);//index 7
		courseArray[courseArray.length-1].push(courses[key].Instructor);//index 8
	}
}

//give the index of the constraint (based on its 
//placement in a courseArray element)
function findCoursesBOConstraint(constraint, index) {
	var courses = courseArray;
	var results = [];
	for (var i in courses) {
		if (courses[i][index] == constraint) {
			results.push(courses[i]);
		}
	}
	return results;
}

function searchSubjectQuery(query) {
  var index;
  for (var i in subjects) {
    if (query == subjects[i]) {
      index = i;
    }
  }
  return abbr[index];
}
