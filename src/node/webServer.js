//js libraries to include
var express = require("express");
var fs = require("fs");
var path = require("path");
var multer  = require('multer');
var bodyParser = require("body-parser");
var includeDir = __dirname + "/../WebContent/include";
var configFile = includeDir + "/config.properties";
var csvFile = includeDir + "/guests.csv";
var imageDir = includeDir + "/carousel";
var host = "127.0.0.1";
var port = "80";

//set up express web server
var app = express();
app.use(express.static(path.join(__dirname, '/../WebContent')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var upload = multer({ dest: imageDir });

app.set('views', __dirname + '/../WebContent/html/');
app.set('view engine', 'ejs');

//set port and ip for web server
app.listen(port, host);
console.log("Server Started on PORT: " + port + " with IP: " + host);
console.log("Application Server is Now Running");
console.log("incase you can't tell, go to this url to access application > http://"+host+":"+port);
console.log("to stop program simply exit or press ctrl+c within this command dialog");
console.log("=======================================================================================");
console.log("Enjoy, Love you ;)");
console.log("Some logging will display here as you go");
console.log("=======================================================================================");

//personal variables to use
var fName;
var lName;
var email;
var hasAgent;
var howSoonBuying;
var lookingToSell;
var phone;
var pictureArray = [];

//image variables
var backgroundImage = getPropertyValue("background");
var titleProperty = getPropertyValue("title");
var descriptionProperty = getPropertyValue("description");

//serve page in load
app.get('/', function(request, response) {
    backgroundImage = getPropertyValue("background");
    titleProperty = getPropertyValue("title");
    descriptionProperty = getPropertyValue("description");
    response.render('pages/page1', {
        background: backgroundImage,
        title: titleProperty,
        description: descriptionProperty
    });
});

//serve administration page
app.get('/admin', function(request, response) {
    backgroundImage = getPropertyValue("background");
    titleProperty = getPropertyValue("title");
    descriptionProperty = getPropertyValue("description");
    getPictures();
    
    response.render('pages/admin', {
        background: backgroundImage,
        title: titleProperty,
        description: descriptionProperty,
        pictures: pictureArray,
        uploadStatus:false
    });
});

app.post('/save-property', function(request, response){
    var name = request.body.property.name;
    var value = request.body.property.value;
    var data = setPropertyValue(name, value);
    response.status(200).send({status:data});
});

app.post('/remove-image', function(request, response){
    var name = request.body.property.name;
    var value = request.body.property.value;
    var data = removeImage(name, value);
    response.status(200).send({status:data});
});

app.post('/clear-csv', function(request, response){
    if (fs.existsSync(csvFile)){
    	try{
    		fs.unlink(csvFile);
    		response.status(200).send({status:true});
    	}catch(err){
    		response.status(400).send({status:false});
    	}
    }else{
    	response.status(200).send({status:true});
    }	
});

app.post('/authenticate', function(request, response) {
   var validated = isValidPass(request.body.password);
    response.status(200).send({validated:validated});
});

//serve carousel page
app.get('/carousel', function(request, response) {
    if (pictureArray === undefined || pictureArray.length === 0) {
        getPictures();
    }

    response.render('pages/carousel', {
        pictures: pictureArray
    });
});

app.post('/post-first-page', function(request, response) {
    backgroundImage = getPropertyValue("background");
    titleProperty = getPropertyValue("title");
    descriptionProperty = getPropertyValue("description");
    //set variables from form results
    fName = request.body.guestFName;
    lName = request.body.guestLName;
    email = request.body.guestEmail;
    hasAgent = request.body.guestHasAgent;

    //log results
    console.log("first name: " + fName);
    console.log("last name: " + lName);
    console.log("email: " + email);
    console.log("hasAgent: " + hasAgent);

    //check on the CSV file
    if (!checkCSVexist()) {
        console.log("ERROR-CSV file could not be created please check file system");
        response.render('pages/page1', {
            background: backgroundImage,
            title: titleProperty,
            description: descriptionProperty
        });
        return;
    }

    //set has agent to false or true depending on answer
    if (hasAgent === 'true') {
        fs.appendFileSync(csvFile, '"' + fName + '","' + lName + '","' + email + '","' + hasAgent + '","N/A","N/A","N/A"\n');
        fName = undefined;
        lName = undefined;
        email = undefined;
        phone = undefined;
        hasAgent = undefined;
        //show thank you screen for a couple seconds before redirect
        setTimeout(function() {
            response.render('pages/page1', {
                background: backgroundImage,
                title: titleProperty,
                description: descriptionProperty
            });
        }, 4000);
    }
    else if (hasAgent === 'false') {
        //go to second page for more info
        response.render('pages/page2', {
            background: backgroundImage,
            title: titleProperty,
            description: descriptionProperty
        });
    }
});

//post for second form
app.post('/post-page2', function(request, response) {
    backgroundImage = getPropertyValue("background");
    titleProperty = getPropertyValue("title");
    descriptionProperty = getPropertyValue("description");
    howSoonBuying = ((request.body.howSoonBuying) !== undefined && (request.body.howSoonBuying) !== "") ? request.body.howSoonBuying : "N/A";
    lookingToSell = ((request.body.lookingToSell) !== undefined && (request.body.lookingToSell) !== "") ? request.body.lookingToSell : "N/A";
    phone = ((request.body.guestPhone) !== undefined && (request.body.guestPhone) !== "") ? request.body.guestPhone : "N/A";

    //log results
    console.log("how soon to buy: " + howSoonBuying);
    console.log("looking to sell: " + lookingToSell);
    console.log("phone number: " + phone);

    fs.appendFileSync(csvFile, '"' + fName + '","' + lName + '","' + email + '","' + hasAgent + '","' + howSoonBuying + '","' + lookingToSell + '","' + phone + '"\n');

    fName = undefined;
    lName = undefined;
    email = undefined;
    phone = undefined;
    hasAgent = undefined;
    howSoonBuying = undefined;
    lookingToSell = undefined;
    phone = undefined;
    setTimeout(function() {
        response.render('pages/page1', {
            background: backgroundImage,
            title: titleProperty,
            description: descriptionProperty
        });
    }, 4000);
});

app.post('/upload-image', upload.array('imageUploadInputName', 12), function(request, response){
    backgroundImage = getPropertyValue("background");
    titleProperty = getPropertyValue("title");
    descriptionProperty = getPropertyValue("description");
    getPictures();
    response.render('pages/admin',{
        background: backgroundImage,
        title: titleProperty,
        description: descriptionProperty,
        pictures : pictureArray,
        uploadStatus: true
    });
});

//check and create csv file function
function checkCSVexist() {
    var results = false;
    var retries = 0;
    console.log('checking if CSV exists');

    while (results === false && retries <= 5) {
        if (!fs.existsSync(includeDir)) {
            fs.mkdirSync(includeDir);
        }
        else if (fs.existsSync(includeDir) && !fs.existsSync(csvFile)) {
            fs.writeFileSync(csvFile, '"firstName","lastName","email","isRepresented","howSoonBuying","lookingToSell","phone"\n');
        }

        if (fs.existsSync(csvFile)) {
            if (fs.readFileSync(csvFile).toString().search('"firstName","lastName","email","isRepresented","howSoonBuying","lookingToSell","phone"') !== -1) {
                results = true;
                console.log("INFO-CSV file ready");
            }
            else {
                fs.unlink(csvFile);
                console.log("ERROR-csv file could not be created with correct headers, check file system permissions");
            }
        }
        retries++;
        results ? "good" : console.log("ERROR-csv file could not be created, check file system permissions, retries left: " + (5 - retries));


    }
    return results;
}

function getPictures() {
	pictureArray = [];
    for (var i = 0; i < fs.readdirSync(imageDir).length; i++) {
        pictureArray[i] = fs.readdirSync(imageDir)[i];
    }
}

function getPropertyValue(name) {
    var confData = fs.readFileSync(configFile);
    var confDataArray = confData.toString().split(';');
    for (var i = 0; i < confDataArray.length; i++) {
        if (confDataArray[i].indexOf(name) > -1) {
            var results = confDataArray[i].substr(confDataArray[i].indexOf("=") + 1);
            return results;
        }
    }
}

function setPropertyValue(name, value){
     try{
        var confData = fs.readFileSync(configFile);
        var configDataString = confData.toString('utf8');
        var confDataStringArray = configDataString.split(';\n');
        var results = (name+'='+value);       
        for (var i = 0; i < confDataStringArray.length; i++) {
            if (confDataStringArray[i].indexOf(name) > -1) {
                confDataStringArray[i] = results;
                break;
            }
        }
        configDataString = confDataStringArray.join(";\n");
        fs.writeFileSync(configFile, configDataString, 'utf8');
        return true;
    }catch(err){
       console.error('Failed to set property: ' +err.message);
       return false;
    }
}

function removeImage(name, value){
    try{
        for (var i = 0; i < value.length; i++){
            fs.unlink(path.join(imageDir, value[i]));
        }
        getPictures();
        return true;
    }catch(err){
       console.error('Failed to delete all images: ' +err.message);
       return false;
    }
}

function isValidPass(pass){
   var password = getPropertyValue("password");
   if (pass === password){
       return true;
   }else{
       return false;
   }
    
}