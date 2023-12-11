document.addEventListener("DOMContentLoaded", () => { // wait for the DOM to be fully loaded
    countryDropDown(); // call function to populate the initial dropdown list
    const dropDown = document.getElementById("selectCountry"); //event listener to the dropdown for the change
    dropDown.addEventListener("change", () => { // when the dropdown selection changes call functions
        displayPopulationData();
        displayCountryData();
        displayCountryFlag();
    });

    const wikiButton = document.getElementById("button1");  //open the wiki page to the country selected by the user
    wikiButton.addEventListener("click", () => countryWikiButton()); 

    const areaSizeDropDown = document.getElementById("areaSizeDD");
    areaSizeDropDown.addEventListener("change", () =>{
        const userSelectedCountry = dropDown.value;

        fetch("countries.json")
        .then(parseingData => parseingData.json())
        .then(countryData => {
            let selectedCountry = countryData.find(country => country.Name === userSelectedCountry); //taking the user picked country name and finding the selected country is the json 
            let areaSizeAnswer = document.getElementById("areaSizeAnswer");
            
            let areaSizeCalc = areaSizeChoice(selectedCountry.Area);

            areaSizeAnswer.textContent =  areaSizeCalc.toFixed(2);
        });
    });


    const radioButtons = document.getElementsByName("choices");
    radioButtons.forEach(radio => {
        radio.addEventListener("change", () => {
            displayPopDenisty();
        });
    });

});//this event loads the dropdown list when page is done being loaded

function countryDropDown() //function to populate the dropdown list for users to select a country
{
    const dropDown = document.getElementById("selectCountry");

    fetch('countries.json') //getting data from countries.json
        .then(parseingData => parseingData.json()) //my friends, w3schools and googled helped me with this part, it is parsing the response body as a json
        .then(countryData => {                    //then working with the parsed json data here (also called a promis syntax)

        for (let i=0; i<countryData.length; i++)//for loop to get the country names
        {
            let countryInfo = countryData[i];
            let option = document.createElement("option"); //adding a new option to the drop down
            option.textContent = countryInfo.Name; //setting the text in the option the be the name of the country
            dropDown.add(option); //finally adding the option to the dropdown list
        }
    });
}

function displayPopulationData() //function to get population of selected country and display the population and % of population
{
    const dropDown = document.getElementById("selectCountry");
    let userSelectedCountry = dropDown.value; // assigning the user picked country to a var

    fetch("countries.json")
        .then(parseingData => parseingData.json()) 
        .then(countryData => {
            let selectedCountry = countryData.find(country => country.Name === userSelectedCountry); //taking the user picked country name and finding the selected country is the json 
          
            let populationAnswer = document.getElementById("populationAnswer");
            let percPopulationAnswer = document.getElementById("percPopulationAnswer");
            populationAnswer.textContent = selectedCountry.Population; //getting the population from the selectedCountry and returning that and the percentage of world pop
            percPopulationAnswer.textContent = parseFloat((selectedCountry.Population / 8000000000) * 100).toFixed(4);
        });       

}

function displayCountryData() //function to get popDensity and areaSize
{ //this funciton became pretty much a display flag helper after i started to work on radio button and areaDD
    const dropDown = document.getElementById("selectCountry");
    let userSelectedCountry = dropDown.value; // assigning the user picked country to a var

    fetch("countries.json")
        .then(parseingData => parseingData.json())
        .then(countryData => {
            let selectedCountry = countryData.find(country => country.Name === userSelectedCountry); //taking the user picked country name and finding the selected country is the json 
            
            /*
            let popDensityAnswer = document.getElementById("popDensityAnswer");
            let areaSizeAnswer = document.getElementById("areaSizeAnswer");

           let populationDensity = calcPopulationDensity(selectedCountry.Population, selectedCountry.Area); //sending to function for picking sqkm or sqm
           let areaSize = areaSizeChoice(selectedCountry.Area); //sending to function for picking sqkm or sqm
           
            popDensityAnswer.textContent = populationDensity.toFixed(2);
            areaSizeAnswer.textContent = areaSize 
  */

           displayCountryFlag(userSelectedCountry); //sending user picked country to flag display function
        });
}

function countryWikiButton() //wiki button function
{
    const dropDown = document.getElementById("selectCountry");
    let userSelectedCountry = dropDown.value;

    fetch ("countries.json")
    .then(parseingData => parseingData.json())
    .then(countryData => {
        let selectCountry = countryData.find(country => country.Name === userSelectedCountry);
        window.open(`https://en.wikipedia.org/wiki/${selectCountry.Name}`); //when button pressed open to country user picked

    });

}

function displayCountryFlag(userSelectedCountry) //function to display flag
{
    let countryFlag = document.getElementById("countryFlag");
    countryFlag.src = `flags/${userSelectedCountry}.png`;
    return countryFlag.src
}

function displayPopDenisty() //funtion to display popdensity
{
    const dropDown = document.getElementById("selectCountry");
    let userSelectedCountry = dropDown.value;

    fetch("countries.json")
        .then(parseingData => parseingData.json())
        .then(countryData => {
            let selectedCountry = countryData.find(country => country.Name === userSelectedCountry);
            let popDensityAnswer = document.getElementById("popDensityAnswer");

            //querySelector is used like getElementName but works better with radio buttons that can only be selected one at a time
            const selectedButton = document.querySelector('input[name="choices"]:checked'); 
            let popDensityCalc = calcPopulationDensity(selectedCountry.Population, selectedCountry.Area, selectedButton.value);

            popDensityAnswer.textContent = popDensityCalc.toFixed(2);


        });
}

function calcPopulationDensity(Population, Area, selectedButton) //function to calc the density in either km or miles user choice
{
    let popDensity = 0;
    if(selectedButton === "squareMile"){
        popDensity = Population / Area;
    }else if(selectedButton === "squareKilo"){
        popDensity = Population /(Area * 2.58999);
    }
    return popDensity
}
function areaSizeChoice(Area)//function to calc the area in km or miles user choise
{ 
    let areaSize = Area;
    
    const selectedOption = document.getElementById("areaSizeDD").value;

    if(selectedOption === "sqM"){
        areaSize = Area;
    }else if(selectedOption === "sqKM") {
        areaSize = Area * 2.58999;
    }

    return areaSize

}

