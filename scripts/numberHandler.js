/*######################################################################
Filename:   numberHandler.js
Version:    1.0
Author:     Johnny Lai

Description:
This file contains JavaScript and jQuery functions to perform various 
tasks of number conversion operations. 
######################################################################*/

// This function validates input data string for acceptable characters. The base (or radix) of input data ranges from 2 to 36 and 60.
function validateInputData(inputString, baseValue) 
{ 
    var outputString = "";
    var validUpperString = "";
    var validLowerString = "";
    var validBase60String = "";
    // Define valid characters for input data string.
    var signChar = "+\-\./, ";      // Plus and minus signs. Decimal point. Comma and space for separating number groups of thousands.
    var delimitChar = ":";      // Digit delimiter for base 60 numbers.
    var upperChar = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
    var lowerChar = "0123456789abcdefghijklmnopqrstuvwxyz"; 
    var base60Char = "0123456789"; 

    // Based on the base value, specify valid characters for input data. For example, base 16 (hexadecimal) numbers' valid characters include 0123456789ABCDEF.
    if (baseValue > 10 && baseValue <= 36) 
    {
        validUpperString = upperChar.substring(0, baseValue); 
        validLowerString = lowerChar.substring(10, baseValue); 
    }
    else if (baseValue <= 10) 
    {
        validUpperString = upperChar.substring(0, baseValue); 
        validLowerString = "";
    }
    if (baseValue == 60) 
    {
        validBase60String = String(signChar + delimitChar + base60Char); 
    }
    else 
    {
        validBase60String = String(signChar + validUpperString + validLowerString); 
    }                             
    // Verify each character of input data to ensure it is valid.
    for (let i = 0; i < inputString.length; i++) {
        // Check each character position of input data. If the current character is valid, continue to validate the next character.
        // If an invalid character is detected, return ERROR.
        if (validBase60String.indexOf(inputString.charAt(i)) != -1) 
        { 
            outputString += inputString.charAt(i);
        }
        else 
        { 
            outputString = "ERROR";
            return outputString;
        }
    }
    return outputString;
} 
    

// This function transform validated input data into proper number format ready for calculation.
function formatInputData(inputString) 
{ 
    // Replace <digit><one or more space><slash> with <digit><slash>. It changes "1   /2" to "1/2"
    while (inputString.match(/(\d)\s+(\/)/)) 
    { 
        inputString = inputString.replace(/(\d)\s+(\/)/, "$1$2"); 
    }
    // Replace <minus sign><one or more space><digit> with <minus sign><digit>. It changes "-   50" to "-50"	                
    while (inputString.match(/(\-)\s+(\d)/)) 
    { 
        inputString = inputString.replace(/(\-)\s+(\d)/, "$1$2"); 
    }
    // Replace <plus sign><one or more space><digit> with <plus sign><digit>. It changes "+   50" to "+50"
    while (inputString.match(/(\+)\s+(\d)/)) 
    { 
        inputString = inputString.replace(/(\+)\s+(\d)/, "$1$2"); 
    }
    // Remove any other space characters that are "not" between digits - like the leading and trailing spaces. It changes "   50      " to "50"
    while (inputString.match(/\s+/)) 
    { 
        inputString = inputString.replace(/\s+/, ""); 
    }
    // Remove comma character between digits. It changes "10,000" to "10000"
    while (inputString.match(/(\d)\,+(\d)/)) 
    { 
        inputString = inputString.replace(/(\d)\,+(\d)/, "$1$2"); 
    }
    // Remove comma character before digits. It changes ",10" to "10"
    while (inputString.match(/\,/)) 
    { 
        inputString = inputString.replace(/\,/, ""); 
    }
    return inputString;
} 


// This function converts from a base-n number into decimal (base 10). The base (or radix) ranges from 2 to 36.
function convertBaseNToDecimal(inputNum, fromBaseValue)
{
    // If input number is a negative value, temporarily change it to positive. (The negative sign will be added back after conversion.)
    if (inputNum < 0) 
    {
        var signValue = "-";
        inputNum = inputNum * -1;
    }
    else 
    {
        var signValue = "";
    }
    // Separate the integer and fractional parts of input number.
    if ( String(inputNum).match(/\./) ) 
    { 
        var splitString = String(inputNum).split("\.");
        var integerPart = splitString[0];
        var fractionalPart = splitString[1];
        if (integerPart == "") 
        {
            integerPart = 0;
        }
    }
    else 
    {
        var integerPart = inputNum;
        var fractionalPart = "";
    }

    // Convert input number (base 2 - 36) to decimal (base 10).
    var integerPartBase10 = "";
    var fractionalPartBase10 = "";    
    if (fromBaseValue >= 2 && fromBaseValue <= 36) 
    {
        // Convert integer part to decimal (base 10).
        integerPartBase10 = String(parseInt(integerPart, fromBaseValue)); 
        // If input number's absolute (non-signed) value is too large, return error code. 
        if (Number(integerPartBase10) > Number.MAX_SAFE_INTEGER)  
        {
            return("INPUT_RANGE_ERROR");
        }

        // Convert fractional part to decimal (base 10).
        // NOTE: Converting a fraction from base 2 to base 10 is as follows:
        // For example, 0.011 (base 2) = (0 × 2^-1) + (1 × 2^-2) + (1 × 2^-3) = 0 + 1/4 + 1/8 = 0 + 0.25 + 0.125 = 0.375 (base 10).
        if (fractionalPart != "") 
        {
	        var exponentNum = 0;
	        var productNum = 0;
	        var sumNum = 0;
 	        var sumNumString = "";
             // Convert each digit to decimal value.
	        for (let k = 0; k < fractionalPart.length; k++) 
            {
	            var digitNum = fractionalPart.charAt(k);
                var digitNumBase10 = getBase10Digit(digitNum, fromBaseValue);   
	            exponentNum = k + 1;
	            productNum = Number(digitNumBase10) * (Math.pow(fromBaseValue, -exponentNum));
	            sumNum = sumNum + productNum;
	            sumNumString = "" + sumNum;
	            var sumNumLength =  String(sumNum).length;
                // Extract resultant number's digits, skipping the integer digit "0" at the left side of decimal point.
	            var sumNumFinal = sumNumString.substring(1, sumNumLength); 
	        }
           fractionalPartBase10 = sumNumFinal;
        }
        else 
        {
           fractionalPartBase10 = "";
        } 
	    return (signValue + integerPartBase10 + fractionalPartBase10);
    }
    else 
    {
        // If the base (or radix) is not between 2 and 36, do nothing and return.
        return;     
    }
} 


// This function converts from decimal (base 10) number into base-n. The base (or radix) ranges from 2 to 36.
function convertDecimalToBaseN(inputNum, toBaseValue)
{
    // If input number is a negative value, temporarily change it to positive. (The negative sign will be added back after conversion.)
    if (inputNum < 0) 
    {
        var signValue = "-";
        inputNum = inputNum * -1;
    }
    else 
    {
        var signValue = "";
    }
    // Separate the integer and fractional parts of input number.
    if (String(inputNum).match(/\./)) 
    { 
        var splitString = String(inputNum).split("\.");
        var integerPart=splitString[0];
        var fractionalPart=splitString[1];
        if (integerPart == "") 
        {
            integerPart = 0;
        }
    }
    else 
    {
        var integerPart=inputNum;
        var fractionalPart="";
    }

    // Convert integer part from decimal to base n.
    var integerPartBaseN = "";
    var fractionalPartBaseN = "";
    var quotientNum = ""; 
    var remainderNumTemp = "";
    var remainderNum = 999;     // Set initial placeholder remainder value before calculation.
    var integerPartTemp = Number(integerPart);
    while (integerPartTemp > Number(toBaseValue - 1)) 
    {
        quotientNum = parseInt(integerPartTemp / toBaseValue);
        remainderNumTemp = integerPartTemp % toBaseValue;
        remainderNumTemp = getBaseNDigit(remainderNumTemp, toBaseValue);
        integerPartTemp = quotientNum;
        // Capture the remainder digit after each calculation.
        if (remainderNum == 999) 
        {
            remainderNum = remainderNumTemp.toString();
        }
        else 
        {
            remainderNum = remainderNumTemp.toString() + remainderNum.toString();
        }
    }
    if (integerPartTemp < toBaseValue && remainderNum != 999) 
    {
        let tempNum = getBaseNDigit(integerPartTemp, toBaseValue);
        remainderNum = tempNum.toString() + remainderNum.toString();
    }
    else if (integerPartTemp < toBaseValue && remainderNum == 999) 
    {
        remainderNum = getBaseNDigit(integerPartTemp, toBaseValue);
    }
    else if (remainderNum == 999) 
    {
        remainderNum = 1;
    }
    integerPartBaseN = remainderNum;

    // Convert fractional part to base n.
    if (fractionalPart != "") 
    {
        var coefficientNum = "";
        var coefficientNumTemp = "";
        // Reconstruct the decimal number by prefixing a decimal point.
        var decimalTemp = String("\." + fractionalPart);
        // Multiply the decimal number by the base number.
        var productNum = Number(decimalTemp) * toBaseValue;
        var splitSt = String(productNum).split("\.");
        // If the product is less than 1, set the new integer part to 0.
        // If the product is equal to or greater than 1, capture the new integer part.
        if (productNum < 1)
        {
            var integerPart2 = 0;
            var decimalPart2 = splitSt[1];
        }
        else
        {
            var integerPart2 = splitSt[0];
            var decimalPart2 = splitSt[1];
        }
        
        coefficientNumTemp = getBaseNDigit(Number(integerPart2), toBaseValue);
        coefficientNum = coefficientNumTemp.toString();
        for (let i = 0; i < 4; i++) 
        { 
            // Round to 5 decimal point places.
            if (Number(decimalPart2) > 0) 
            {
                decimalTemp = String("\." + decimalPart2);
                productNum = Number(decimalTemp) * toBaseValue;
                splitSt = String(productNum).split("\.");
                if (productNum < 1)
                {
                    var integerPart2 = 0;
                    var decimalPart2 = splitSt[1];
                }
                else
                {
                    var integerPart2 = splitSt[0];
                    var decimalPart2 = splitSt[1];
                }
                coefficientNumTemp = getBaseNDigit(Number(integerPart2), toBaseValue);
                coefficientNum = coefficientNum.toString() + coefficientNumTemp.toString();
            }
        }
        fractionalPartBaseN = "\." + coefficientNum;
    }
    else 
    {
        fractionalPartBaseN = "";
    }
    return (signValue + integerPartBaseN + fractionalPartBaseN);
} 


// This function converts a single base-n digit into decimal number (base 10). For example, it converts a hexadecimal digit A into decimal number 10.
// The base (or radix) ranges from 2 to 36. Since base 60 is all numeric, a base 60 digit is same as decimal (base 10) digit.
function getBase10Digit(inputNum, baseValue) 
{
    // Since all base 60 digits are numeric, a base 60 digit is same as decimal (base 10) digit.
    if (baseValue == 60) 
    {
        return inputNum; 
    }
    else 
    {
        var alphanumericChar = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var inputNumUpper = String(inputNum).toUpperCase(); 
        // The index position in "alphanumericChar" is the decimal (base 10) number.
        var base10Num = alphanumericChar.indexOf(inputNumUpper);
        return base10Num;
    }
} 


// This function converts from a single decimal (base 10) number into base-n number. For example, it converts a decimal number 10 into hexadecimal digit A.
// The base (or radix) ranges from 2 to 36. Since base 60 is all numeric, a base 60 digit is same as decimal (base 10) digit.
function getBaseNDigit(inputNum, baseValue) 
{
    // Since all base 60 digits are numeric, a base 60 digit is same as decimal (base 10) digit.
    if (baseValue == 60) 
    {
        return inputNum;
    }
    else 
    {
	    var baseNArray = new Array('0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
	    var baseNDigit;
	    if (Number(inputNum) > Number(baseValue - 1)) 
        {
		    return inputNum;
	    }
	    else if (Number(inputNum) <= Number(baseValue - 1)) 
        {
		    baseNDigit = baseNArray[inputNum];
		    return baseNDigit;
	    }
    }	    
} 








