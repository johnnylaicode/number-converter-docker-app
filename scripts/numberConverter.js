/*######################################################################
Filename:   numberConverter.js
Version:    1.0
Author:     Johnny Lai

Description:
This file contains JavaScript and jQuery functions for number conversion.
######################################################################*/

// Clear output value when input changes.
$("#FromDropDownList, #ToDropDownList, #InputTextBox").on("change", function(e) 
{
    $("#OutputTextBox").val("");
});

// Prevent reloading the page when submitting using the form.
$("#InputForm").submit(function(e) 
{
    e.preventDefault();
});


// This is the main function for number conversions.
function convertNumber() 
{ 
    // Clear error message
    $("#ErrorMessage1, #ErrorMessage2").hide();

    // If there is no From or To selection, do nothing and return.
    if ($("#FromDropDownList").val() == "" || $("#ToDropDownList").val() == "") 
    {
        return;
    }
    // If user doesn't enter any input value, default input value to 1.
    if ($("#InputTextBox").val() == "") 
    {
        $("#InputTextBox").val("1");
    }

    // Identify the From base value (e.g., Base 2).
    if ($("#FromDropDownList").val() == 1) 
    {
        var baseValue = 2;
    }
    else if ($("#FromDropDownList").val() == 2) 
    {
        var baseValue = 8;
    }
    else if ($("#FromDropDownList").val() == 3) 
    {
        var baseValue = 10;
    }
    else if ($("#FromDropDownList").val() == 4) 
    {
        var baseValue = 16;
    }
    else if ($("#FromDropDownList").val() == 5) 
    {
        var baseValue = 60;
    }
   
    // Validate input data for valid characters.
    var inputDataValidated = validateInputData($("#InputTextBox").val(), baseValue);
    // If input data is invalid, display error message and return.
    if (inputDataValidated == "ERROR") 
    { 
        $("#ErrorMessage1").show();
        return;
    }
  
    // After validation, convert input data string into proper format to be ready for calculation.
    var inputDataFormatted = formatInputData(inputDataValidated);
    
    // First, based on the From (input) base value, convert input data to its corresponding decimal (base 10) value.
    var inputToDecimal = "";
    if ($("#FromDropDownList").val() == 1) 
    { 
        // Input is Base 2
        inputToDecimal = convertBaseNToDecimal(inputDataFormatted, 2);
    } 
    else if ($("#FromDropDownList").val() == 2) 
    { 
        // Input is Base 8
        inputToDecimal = convertBaseNToDecimal(inputDataFormatted, 8);
    } 
    else if ($("#FromDropDownList").val() == 3) 
    { 
        // Input is Base 10
        inputToDecimal = convertBaseNToDecimal(inputDataFormatted, 10);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    } 
    else if ($("#FromDropDownList").val() == 4) 
    { 
        // Input is Base 16
        inputToDecimal = convertBaseNToDecimal(inputDataFormatted, 16);
    } 
    
    // If there is input range error, display error message.
    if ((inputToDecimal == "INPUT_RANGE_ERROR") || (inputToDecimal == "DIGIT_LENGTH_ERROR")) 
    {
        $("#ErrorMessage2").show();
        return;
    }

    // Finally, convert the decimal (base 10) value to the To (output) base value.
    var outputData = "";
    if ($("#ToDropDownList").val() == 1) 
    { 
        // Output is Base 2
        outputData = convertDecimalToBaseN(inputToDecimal, 2);
    } 
    else if ($("#ToDropDownList").val() == 2) 
    { 
        // Output is Base 8
        outputData = convertDecimalToBaseN(inputToDecimal, 8); 
    } 
    else if ($("#ToDropDownList").val() == 3) 
    { 
        // Output is Base 10
        outputData = convertDecimalToBaseN(inputToDecimal, 10); 
    } 
    else if ($("#ToDropDownList").val() == 4) 
    { 
        // Output is Base 16
        outputData = convertDecimalToBaseN(inputToDecimal, 16); 
    } 
    
    // Display the converted value.
    $("#OutputTextBox").val(outputData);   
} 


// This function clears all fields.
function clearForm() 
{ 
    $("#FromDropDownList").prop('required',false);
    $("#ToDropDownList").prop('required',false);
    $("#FromDropDownList").val("");
    $("#ToDropDownList").val("");
    $("#InputTextBox").val("");
    $("#OutputTextBox").val("");
    $("#ErrorMessage1, #ErrorMessage2").hide();
}
