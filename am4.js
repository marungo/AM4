var url = "https://spreadsheets.google.com/feeds/list/1035SQBywbuvWHoVof3G-VI0rapYJslaeYN5tTpNZq2M/od6/public/values?";
var cleanedCourses = {}// global variable
var courseArray = [];

$.getJSON(url+"alt=json-in-script&callback=?",
    function (response){
      items = response.feed.entry;
      if (response.feed) {
        processCourses(items);
        parseCoursesInfo(cleanedCourses);
        console.log(courseArray);
        console.log(findCoursesBOConstraint("AFR", 0));
      }
});

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


// "200 level poli-sci courses that meet twice a week". You can 
// choose to restrict the range to three fields of your choice and
//  any combination of them, but you cannot ask users to enter
//   structured text such as: "subject=polisci;level=200;days=M,Th". 
//   Dealing with free-form text is difficult, but it's a good challenge 
//   for students who consider themselves strong in data structures.
function parseFeed(input) {
	var inputItems = input.split(" ");
	for (var i in inputItems) {
		if (isInt(inputItems[i])) {//if it's an integer, they're asking course number or class level
			if (inputItems[i].length == 3) {
				console.log(inputItems[i] + ": this input query is a particular class level i.e. 212");
				if (inputItems[i] == "100" || "200" || "300") {
					console.log(inputItems[i] + ": this input query is indicating a general class level i.e. 200");
				} else if (inputItems[i].indexOf(":")) {
					console.log("blah blah");
				}
			} else if (inputItems[i].length == 5) {
				console.log(inputItems[i] + ": this input query is a course number i.e. 24656");
			}
		}
		// } else {
		// 	console.log(inputItems[i] + ": this input query is not an integer");
		// }
	}
}

console.log(parseFeed("300, 24564, africana studies"));

function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
}


var button = document.querySelector("button");
button.onclick = function () {
    var input = document.querySelector("#guess");
    input = input.value;
    //get info
}





